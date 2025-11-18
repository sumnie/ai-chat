// quick start route example for ai-sdk with openai
// AI SDK 모델 호출용 (useChat 자동으로 사용)

import { SYSTEM_PROMPT } from '@/constants/prompts';
import { basicInfo, projects, techStack, values } from '@/data/portfolio';
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
  let messagesForModel = [...messages];

  // 3. 질문 분석 -> 데이터 자동 주입
  const lastUserText =
    lastUserMessage?.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('\n')
      ?.toLowerCase() || '';

  const topicKeywords = {
    tech: ['기술', '스택', 'tech', '언어', '프레임워크', '도구', '라이브러리'],
    projects: ['프로젝트', '커리어', 'project', '개발한', '만든', '경험'],
    values: ['가치', '협업', '태도', '스타일', '마인드', '철학', '일하는 방식'],
    basic: ['소개', '누구', '자기소개', '본인', '당신', '경력'],
  };

  const matchedCategories = (
    Object.keys(topicKeywords) as Array<keyof typeof topicKeywords>
  ) // obj의 key만 추려서 타입으로 만들어줌
    .filter((key) =>
      topicKeywords[key].some((kw) => lastUserText.includes(kw))
    ); //some() : 하나라도 만족하면 true 반환, filter() : 조건 만족하는 key들만 배열로 반환

  const injectedData: Record<string, any> = {}; // 조건에 맞는 카테고리를 여러개 넣을 수 있는 유연한 객체생성. string키, any 값

  if (matchedCategories.includes('tech')) injectedData.tech = techStack;
  if (matchedCategories.includes('projects')) injectedData.projects = projects;
  if (matchedCategories.includes('values')) injectedData.values = values;
  if (matchedCategories.includes('basic')) injectedData.basic = basicInfo;

  if (Object.keys(injectedData).length > 0) {
    messagesForModel.unshift({
      id: 'injected-data-0',
      role: 'system',
      parts: [
        {
          type: 'text',
          text:
            `아래는 방문자에게 소개할 '김수민'님의 실제 포트폴리오 데이터입니다. \n` +
            `이 데이터의 주체는 챗봇이 아니라 '수민'입니다\n` +
            `항상 3인칭으로 설명하고, 제공된 정보로만 답하세요.` +
            `${JSON.stringify(injectedData, null, 2)}`,
        },
      ],
    });
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
