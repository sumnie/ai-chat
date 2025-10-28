'use client';

import { useModelStore } from '@/store/useModel';
import { useChat } from '@ai-sdk/react';
import { ArrowRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Submit } from '../intro/Submit';
import { Loading } from '../Loading';
import { Input } from '../ui/input';

export function Chat() {
  const router = useRouter();
  const { model } = useModelStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);

  // ✅ 마지막 user 입력값을 저장해두는 ref (messages 상태와 분리)
  const lastMetaRef = useRef<{ model?: string; userText?: string }>({});

  const loadMessages = useCallback(async (sessionId: string) => {
    setLoadError(null);
    try {
      const res = await fetch(`/api/messages?sessionId=${sessionId}`);
      if (!res.ok) throw new Error(`GET /api/messages ${res.status}`);
      const dbMessages = await res.json();

      // AI SDK 형식으로 변환
      const formattedMessages = dbMessages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        parts: [{ type: 'text', text: msg.content }],
      }));

      // ✅ messages 상태에 반영 (useChat의 setMessages 사용)
      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('❌ 메시지 불러오기 실패:', error);
      setLoadError(error?.message ?? '메시지 불러오기에 실패했어요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 세션 로드
  useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
    if (!stored) {
      router.replace('/intro');
      return;
    }
    sessionIdRef.current = stored;
    loadMessages(stored);
  }, [router, loadMessages]);

  const { messages, setMessages, sendMessage, status } = useChat({
    // ✅ AI 응답 스트리밍이 끝난 “방금 생성된 assistant 메시지”가 인자로 들어옴
    onFinish: async ({ message }) => {
      const currentSession = sessionIdRef.current;
      if (!currentSession) {
        console.warn('세션이 아직 없습니다. skip');
        return;
      }

      try {
        const { userText } = lastMetaRef.current;
        const assistantText = message.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text)
          .join('\n');

        if (!userText) return;

        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentSession,
            role: 'user',
            content: userText,
          }),
        });

        // ✅ assistant 메시지 DB에 저장
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentSession,
            role: 'assistant',
            content: assistantText,
          }),
        });
      } catch (error) {
        console.error('❌ 메시지 저장 실패:', error);
      }
    },
  });

  const isStreaming = status === 'streaming';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const sid = sessionIdRef.current;
      if (!sid) return; // 세션 없으면 무시
      if (!input.trim() || isStreaming) return;
      lastMetaRef.current = { model, userText: input };
      // ✅ AI 호출
      sendMessage({ text: input, metadata: { model } });
      setInput('');
    },
    [input, model, sendMessage, isStreaming]
  );

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <>
      <div className="flex flex-col w-full h-full flex-1 overflow-y-auto">
        {/* sessionId를 조회해서 대화가 없을 때(새 대화) */}
        {loadError ? (
            <div className="p-4 text-sm text-red-500">{loadError}</div>
        ) :  messages.length === 0 ? (
          <div className="flex py-5 flex-1 justify-center items-center">
            <h1 className="text-lg sm:text-2xl text-center">
              대화를 시작해볼까요?
              {/* ul li 기술스택 / 커리어 / 인성으로 자동질문 카드 3개 */}
            </h1>
          </div>
        ) : (
          <div></div>
        )}
       
        {/* 기존에 나누던 대화가 있을 때 기존 대화 불러오기 */}
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <form
        className="flex sticky bottom-0 w-full space-x-2 pb-3"
        onSubmit={handleSubmit}
      >
        <Input
          value={input}
          placeholder="메시지를 입력하세요..."
          className="py-5"
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <Submit size="icon" className="p-5" disabled={isStreaming || !sessionIdRef.current}>
          <ArrowRightIcon />
        </Submit>
      </form>
    </>
  );
}
