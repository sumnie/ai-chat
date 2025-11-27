'use client';

import { useModelStore } from '@/store/useModel';
import { useUserStore } from '@/store/userStore';
import { detectCategory } from '@/utils/chat/category';
import { handleInvalidSession } from '@/utils/session/sessionInvalid';
import type { UIMessage } from '@ai-sdk/react';
import { useChat } from '@ai-sdk/react';
import { ArrowRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Submit } from '../intro/Submit';
import { Loading } from '../Loading';
import { Input } from '../ui/input';
import { ChatHero } from './ChatHero';
import { FollowUpMessage } from './FollowUpMessage';

export function Chat() {
  const router = useRouter();
  const { model } = useModelStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);
  const userName = useUserStore((state) => state.name);

  // useCallback은 함수를 캐싱하는 React 훅. 값을 저장하는 useMemo의 함수버전
  // useCallback의 첫번째 인자 = "저장할 함수", 두번째 인자 = "함수를 언제 새로 만들지 정하는 의존성 배열"

  const saveMessage = useCallback(
    async (payload: {
      sessionId: string;
      role: 'user' | 'assistant';
      content: string;
    }) => {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // 세션 불일치 처리
      if (res.status === 404) {
        handleInvalidSession(router);
        throw new Error('invalid session.');
      }

      if (!res.ok) throw new Error(`message save failed : ${res.status}`);
    },
    [router]
  );

  // ✅ 마지막 user 입력값을 저장해두는 ref (messages 상태와 분리)
  const lastMetaRef = useRef<{ model?: string; userText?: string }>({});
  type DBMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
  const loadMessages = async (sessionId: string) => {
    setLoadError(null);
    try {
      const res = await fetch(`/api/messages?sessionId=${sessionId}`);
      if (!res.ok) throw new Error(`GET /api/messages ${res.status}`);
      const dbMessages: DBMessage[] = await res.json();

      // AI SDK 형식으로 변환
      const formattedMessages: UIMessage[] = dbMessages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        parts: [{ type: 'text', text: msg.content }],
      }));

      // ✅ messages 상태에 반영 (useChat의 setMessages 사용)
      setMessages(formattedMessages);
    } catch (error) {
      console.error('❌ 메시지 불러오기 실패:', error);
      setLoadError(
        error instanceof Error ? error.message : '메시지 불러오기에 실패했어요.'
      );
    } finally {
      setIsLoading(false);
    }
  };
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
  }, []); // 최초 1회 실행 deps 빈배열 고정

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

        await saveMessage({
          sessionId: currentSession,
          role: 'assistant',
          content: assistantText,
        });
      } catch (error) {
        console.error('❌ 메시지 저장 실패:', error);
      }
    },
  });

  const answeredCategories = useMemo(() => {
    const set = new Set<string>();

    for (const msg of messages) {
      if (msg.role !== 'user') continue;
      const text = msg.parts
        .filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('\n');

      const cats = detectCategory(text);
      cats.forEach((c) => set.add(c));
    }

    return Array.from(set);
  }, [messages]);

  const allCategories = ['tech', 'projects', 'values'] as const;
  const remainingCategories = allCategories.filter(
    (cat) => !answeredCategories.includes(cat)
  );
  const lastMessage = messages[messages.length - 1];
  const isStreaming = status === 'streaming';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendUserMessage = useCallback(
    async (text: string) => {
      const sid = sessionIdRef.current;
      if (!sid) return; // 세션 없으면 무시
      if (!text.trim() || isStreaming) return;
      lastMetaRef.current = { model, userText: text };

      const res = await saveMessage({
        sessionId: sid,
        role: 'user',
        content: text,
      });
      sendMessage({ text, metadata: { model } });
    },
    [model, sendMessage, isStreaming, saveMessage]
  );
  const handleSubmit = useCallback(
    //다른 컴포넌트에 props로 내려가거나 다른 hook의 deps로 들어가느냐에 따라 useCallback 적용 여부가 달라질 수 있음
    (e: React.FormEvent) => {
      e.preventDefault();
      sendUserMessage(input);
      setInput('');
    },
    [input, model, sendUserMessage, isStreaming]
  );

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <>
      <div className="flex flex-col w-full h-full flex-1 overflow-y-auto scrollbar px-2">
        {/* sessionId를 조회해서 대화가 없을 때(새 대화) */}
        {loadError ? (
          <div className="p-4 text-sm text-red-500">{loadError}</div>
        ) : (
          messages.length === 0 && (
            <ChatHero
              userName={userName}
              onSelectQuestion={(q) => sendUserMessage(q)}
            ></ChatHero>
          )
        )}

        {/* 기존에 나누던 대화가 있을 때 기존 대화 불러오기 */}
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {/* {message.role === 'user' ? userName : 'AI: '} */}
            {message.parts.map((part, i) => {
              if (part.type !== 'text') return null;
              const partKey = `${message.id}-${i}`;
              return message.role === 'user' ? (
                <div
                  className="flex w-full flex-col gap-1 empty:hidden items-end my-3"
                  key={partKey}
                >
                  <div
                    className="bubble-bg relative rounded-[18px] px-4 py-1.5 data-[multiline]:py-3 max-w-[90%] md:max-w-[70%]" //data-[multiline] : 속성이 붙어있으면 특정 스타일 적용,
                  >
                    {part.text}
                  </div>
                </div>
              ) : (
                <div key={partKey} className="empty:hidden">
                  {part.text}
                </div>
                // empty:hidden 아무 텍스트도 없을때 불필요한 공간 차지하지 않게 하기 위해. :empty CSS 선택자 기반
              );
            })}
          </div>
        ))}

        {/* 정적 데이터 기반 follow-up 질문 / 종료 메시지 */}
        <FollowUpMessage
          hasMessages={messages.length > 0}
          loadError={!!loadError}
          isStreaming={isStreaming}
          lastRole={lastMessage?.role}
          remainingCategories={remainingCategories}
          onSelectQuestion={sendUserMessage}
          onAppear={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
        <div ref={scrollRef} />
      </div>
      <form
        className="flex sticky bottom-0 w-full space-x-2 pb-3 app-surface pt-3"
        onSubmit={handleSubmit}
      >
        <Input
          value={input}
          placeholder="메시지를 입력하세요..."
          className="py-5"
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <Submit
          size="icon"
          className="p-5"
          disabled={isStreaming || !sessionIdRef.current}
        >
          <ArrowRightIcon />
        </Submit>
      </form>
    </>
  );
}
