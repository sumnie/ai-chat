'use client';

import { useModelStore } from '@/store/useModel';
import { useChat } from '@ai-sdk/react';
import { ArrowRightIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Submit } from '../intro/Submit';
import { Input } from '../ui/input';

export function Chat() {
  const { model } = useModelStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ 마지막 user 입력값을 저장해두는 ref (messages 상태와 분리)
  const lastMetaRef = useRef<{ model?: string; userText?: string }>({});

  const { messages, sendMessage, status } = useChat({
    // ✅ AI 응답 스트리밍이 끝난 “방금 생성된 assistant 메시지”가 인자로 들어옴
    onFinish: async ({ message }) => {
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
          body: JSON.stringify({ role: 'user', content: userText }),
        });

        // ✅ assistant 메시지 DB에 저장
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'assistant', content: assistantText }),
        });
      } catch (error) {
        console.error('❌ 메시지 저장 실패:', error);
      }
    },
  });

  const isLoading = status === 'streaming';
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full flex-1">
      {/* sessionId를 조회해서 대화가 없을 때(새 대화) */}

      {messages.length === 0 && (
        <div className="flex py-5 flex-1 justify-center items-center">
          <h1 className="text-lg sm:text-2xl text-center">
            대화를 시작해볼까요?
            {/* ul li 기술스택 / 커리어 / 인성으로 자동질문 카드 3개 */}
          </h1>
        </div>
      )}

      {/* 기존에 나누던 대화가 있을 때 기존 대화 불러오기 */}

      {messages.map((message) => (        
        <div className="flex-1">
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                }
              })}
            </div>
        </div>
      ))}

      <div ref={scrollRef} />

      <form
        className="flex sticky bottom-0 w-full space-x-2 pb-3"
        onSubmit={(e) => {
          e.preventDefault();

          // ✅ 입력한 user 텍스트를 ref에 저장
          lastMetaRef.current = { model, userText: input };
          // ✅ AI 호출
          sendMessage({ text: input, metadata: { model } });
          setInput('');
        }}
      >
        <Input
          value={input}
          placeholder="메시지를 입력하세요..."
          className="py-5"
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <Submit size="icon" className="p-5" disabled={isLoading}>
          <ArrowRightIcon />
        </Submit>
      </form>
    </div>
  );
}
