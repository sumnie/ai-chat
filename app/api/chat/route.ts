// quick start route example for ai-sdk with openai
// AI SDK 모델 호출용 (useChat 자동으로 사용)

import { SYSTEM_PROMPT } from '@/constants/prompts';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
// route handler는 클라이언트로부터 요청을 받아 외부 AI API를 호출하고, 받은 응답을 매플리케이션이 사용할 수 있는 스트림 형태로 변환하는 역할 담당.

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  //   const { messages }: { messages: UIMessage[] } = await req.json();

  const body = await req.json();
  const messages = body.messages as UIMessage[];

  // ✅ metadata는 messages 배열의 마지막 user message에서 추출
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'user');
  const meta = lastUserMessage?.metadata as { model?: string };
  const selectModel = meta?.model ?? 'gpt-4o-mini';

  // ✅ 모델 호출용 임시 배열 생성 (DB/클라이언트 저장 X)
  // system prompt는 실제 모델 호출 직전에만 prepend
  let messagesForModel = [...messages];

  if (messages.length === 1) {
    // 첫 메시지라면 system prompt 임시 추가
    const systemMessage: UIMessage = {
      id: 'system-0',
      role: 'system',
      parts: [{ type: 'text', text: SYSTEM_PROMPT }],
    };
    messagesForModel.unshift(systemMessage);
  }

  const result = streamText({
    model: openai(selectModel),
    messages: convertToModelMessages(messagesForModel),
  });

  return result.toUIMessageStreamResponse();
}
// 종속성 npm add ai @ai-sdk/react @ai-sdk/openai zod 버셀 ai-sdk는 open ai 외에도 gemini역시 비슷한 방식으로 추가 가능
