'use client';

import { QuestionCard } from './QuestionCard';

type ChatHeroProps = {
  userName: string;
  onSelectQuestion: (question: string) => void;
};

const presetQuestions = [
  {
    title: '기술 스택',
    description: '언어, 프레임워크, 도구 등 사용 기술',
    text: '수민님이 주로 사용하는 기술 스택을 알려주세요.',
    category: 'tech',
  },
  {
    title: '커리어',
    description: '경력 및 대표 프로젝트 경험',
    text: '수민님의 경력과 주요 포트폴리오 프로젝트를 소개해 주세요.',
    category: 'projects',
  },
  {
    title: '업무 스타일',
    description: '중요 가치, 협업 방식, 문제 해결 태도 등',
    text: '수민님이 일할 때 중요하게 생각하는 가치와 태도를 알려주세요.',
    category: 'values',
  },
];

export function ChatHero({ userName, onSelectQuestion }: ChatHeroProps) {
  return (
    <div className="flex py-5 flex-1 flex-col justify-center items-center">
      <h1 className="text-center mb-10">
        안녕하세요, <b>{userName || '방문자'} </b>님! 만나서 반가워요.
        <br />
        저는 수민 님의 포트폴리오 챗봇이에요.
        <br /> 어떤 것이 궁금하세요?
      </h1>
      {/* ul li 기술스택 / 커리어 / 인성으로 자동질문 카드 3개 */}
      <div className="w-full">
        {presetQuestions.map((q) => (
          <QuestionCard
            key={q.title}
            title={q.title}
            description={q.description}
            onClick={() => onSelectQuestion(q.text)}
          ></QuestionCard>
        ))}
      </div>
    </div>
  );
}
