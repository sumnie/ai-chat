// quick start route example for ai-sdk with openai
// AI SDK 모델 호출용 (useChat 자동으로 사용)

import { SYSTEM_PROMPT } from '@/constants/prompts';
import {
  basicInfo,
  personality,
  projects,
  techStack,
  values,
} from '@/data/portfolio';
import { detectCategory } from '@/utils/chat/category';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
// route handler는 클라이언트로부터 요청을 받아 외부 AI API를 호출하고, 받은 응답을 매플리케이션이 사용할 수 있는 스트림 형태로 변환하는 역할 담당.

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  //   const { messages }: { messages: UIMessage[] } = await req.json(); // 기본 구조였으나, 아래처럼 수정

  const body = await req.json();
  const messages = body.messages as UIMessage[];

  // 1. metadata는 messages 배열의 마지막 user message에서 추출
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'user');

  const meta = lastUserMessage?.metadata as { model?: string };
  const selectModel = meta?.model ?? 'gpt-4o-mini';

  // 2. 모델 호출용 메시지 배열 복사 (DB/클라이언트 저장 X)
  const messagesForModel = [...messages];

  // 3. 질문 분석 -> 데이터 자동 주입
  const lastUserText =
    lastUserMessage?.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('\n')
      ?.toLowerCase() || '';

  // 카테고리 감지
  const matchedCategories = detectCategory(lastUserText);

  // 4. 카테고리별로 주입할 텍스트 조립 (카테고리가 하나도 안 맞는 경우 -> 추측 금지)
  if (matchedCategories.length === 0) {
    messagesForModel.unshift({
      id: 'injected-none',
      role: 'system',
      parts: [
        {
          type: 'text',
          text: [
            '사용자의 질문은 현재 제공된 포트폴리오 데이터와 직접적으로 연결되지 않습니다.',
            '절대 새로운 정보를 생성하거나 추측하지 말고,',
            '반드시 다음과 같이만 답변하세요:',
            '',
            '제가 가지고 있는 정보는 기술·경력·프로젝트·가치관에 관한 내용이에요.',
            '이 범위 안에서 다시 질문해 주시면 더 정확하게 답변드릴 수 있습니다 :)',
          ].join('\n'),
        },
      ],
    });
  } else {
    const contextPieces: string[] = [];

    if (matchedCategories.includes('basic')) {
      contextPieces.push(
        [
          `- 기본 정보:`,
          `• 이름: ${basicInfo.name}`,
          `• 직무: ${basicInfo.job}`,
          `• 경력: 약 ${basicInfo.years}년`,
          `• 요약: ${basicInfo.summary}`,
          basicInfo.flutter ? `• Flutter 경험: ${basicInfo.flutter}` : '',
        ]
          .filter(Boolean)
          .join('\n')
      );
    }

    if (matchedCategories.includes('tech')) {
      contextPieces.push(
        [
          `- 기술 스택 및 활용 맥락:`,
          ...techStack.map((t) => `• ${t.name}: ${t.usage}`),
        ].join('\n')
      );
    }

    if (matchedCategories.includes('projects')) {
      contextPieces.push(
        [
          `- 주요 프로젝트 및 기여:`,
          ...projects.map((p) => {
            const contrib = p.contributions.map((c) => `  - ${c}`).join('\n');
            return `• ${p.name} (${p.summary || '프로젝트'})\n${contrib}`;
          }),
        ].join('\n')
      );
    }

    if (matchedCategories.includes('values')) {
      contextPieces.push(
        [
          `- 일하는 방식과 가치관:`,
          ...values.map((v) => `• ${v.title}: ${v.detail}`),
        ].join('\n')
      );
    }
    if (matchedCategories.includes('personality')) {
      contextPieces.push(
        [
          `- 인성 및 협업 스타일:`,
          ...personality.map((p) => `• ${p.title}: ${p.detail}`),
        ].join('\n')
      );
    }

    if (contextPieces.length > 0) {
      const injectedText = [
        `아래는 프론트엔드 개발자 김수민님의 포트폴리오 관련 요약 정보입니다.`,
        `이 내용을 참고해, 인사담당자가 보기 편한 자연스러운 한국어 문장으로만 답변하세요.`,
        `데이터를 그대로 나열하지 말고, 질문과 가장 관련 있는 부분만 골라 핵심 위주로 다시 정리해서 설명하세요.\n`,
        contextPieces.join('\n\n'),
      ].join('\n');

      messagesForModel.unshift({
        id: `injected-text`,
        role: 'system',
        parts: [{ type: 'text', text: injectedText }],
      });
    }
  }

  // 4. 첫 메시지라면 system prompt 추가
  if (messages.length === 1) {
    messagesForModel.unshift({
      id: 'system-0',
      role: 'system',
      parts: [{ type: 'text', text: SYSTEM_PROMPT }],
    });
  }

  // 5. 모델 호출
  const result = streamText({
    model: openai(selectModel),
    messages: convertToModelMessages(messagesForModel),
  });

  return result.toUIMessageStreamResponse();
}
// 종속성 npm add ai @ai-sdk/react @ai-sdk/openai zod 버셀 ai-sdk는 open ai 외에도 gemini역시 비슷한 방식으로 추가 가능
