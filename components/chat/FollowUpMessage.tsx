'use client';

import { CirclePlus } from 'lucide-react';
import { useEffect } from 'react';

type FollowUpMessageProps = {
  hasMessages: boolean;
  loadError: boolean;
  isStreaming: boolean;
  lastRole: 'user' | 'assistant' | 'system';
  remainingCategories: string[]; // 'tech' | 'projects' | 'values' 등,
  onSelectQuestion: (question: string) => void;
  onAppear?: () => void;
};
const labelMap: Record<string, string> = {
  tech: '기술 스택',
  projects: '프로젝트 경험',
  values: '가치관 / 업무 스타일',
};

const questionMap: Record<string, string> = {
  tech: '수민님의 기술 스택을 자세히 알려주세요.',
  projects: '수민님의 프로젝트 경험을 설명해 주세요.',
  values: '수민님의 일하는 방식과 가치관은 어떤가요?',
};

export function FollowUpMessage({
  hasMessages,
  loadError,
  isStreaming,
  lastRole,
  remainingCategories,
  onSelectQuestion,
  onAppear,
}: FollowUpMessageProps) {
  const visible =
    hasMessages && !loadError && !isStreaming && lastRole === 'assistant';

  useEffect(() => {
    if (visible && onAppear) {
      onAppear();
    }
  }, [visible, onAppear]);

  if (!visible) return null;

  if (!hasMessages) return null;
  if (loadError) return null;
  if (isStreaming) return null;
  if (lastRole !== 'assistant') return null;

  const hasRemaining = remainingCategories.length > 0;

  return (
    <div className="mt-2 mb-3 px-1 text-xs sm:text-sm fade-slide-in">
      {hasRemaining ? (
        <div className="flex flex-wrap gap-2 text-muted-foreground items-center">
          <CirclePlus size={16} />
          {remainingCategories.map((cat) => {
            const label = labelMap[cat];
            const q = questionMap[cat];
            if (!label || !q) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectQuestion(q)}
                className="rounded-full border px-3 py-1.5 bg-secondary text-foreground dark:bg-white/10 hover:bg-secondary/80 transition"
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">
          수민님의 기술·프로젝트·가치관에 대한 기본 정보를 다 안내해 드렸어요.
          이제 자유롭게 더 궁금한 내용을 물어봐 주세요 :)
        </div>
      )}
    </div>
  );
}
