# Portfolio ai-Chatbot

Frontend developer sumnie 인터랙티브 포트폴리오
방문자가 챗봇과 대화하며 기술, 프로젝트, 가치관 탐색

## 프로젝트 목표

- Nuxt3(Vue.js) 기반 개발 경험에서 Next.js 15(React)로 기술 확장
- 대화형 자기소개 챗봇
- 할루시네이션 방지 : 사전에 정의된 정보 프롬프트 기반으로 응답 제어

## 주요 기능

- 대화형 포트폴리오 | 경력, 기술 스택, 프로젝트, 가치관 기반 응답
- 닉네임 기반 세션 | 가입 필요 없이 방문자가 이름만 입력하면 자동으로 UUID 생성 후 대화 시작
- 서버 대화 기록 | 각 세션에 따른 대화 내용 서버(DB)에 저장
- GPT 모델 선택 | 사용 모델 변경 (GPT-4o, GPT-3.5)
- 다크/라이트 테마 전환 | UI모드 변경 지원

## 기술 스택

- Next.js 15 (App Router)
- TypeScript
- Zustand
- Drizzle ORM + Neon (postgres)
- shadcn/ui
- zod
- react-hot-toast
- ...

## 진행 기록

- 2025-10-17 | 프로젝트 초기화 및 README 작성, @shadcn-ui
- 2025-10-24 | Intro 페이지, Drizzle ORM + neon, 세션ID 추가 액션
