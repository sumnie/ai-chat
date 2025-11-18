export const basicInfo = {
  name: '김수민',
  job: 'Frontend Developer',
  years: 6,
  summary:
    'SI·외주 중심 환경에서 여러 서비스를 빠르게 구축하며 실무 적응력과 문제 구조화 능력을 키워 온 프론트엔드 개발자입니다.',
  strengths: [
    '기획이 미완성된 상태에서도 화면 흐름을 재정립하고 구조를 잡아가는 능력',
    'Vue/Nuxt 기반 서비스 다수를 운영하며 쌓은 안정적인 실무 경험',
    'Next.js·React로 기술 스택 확장',
    'UI/UX 퍼블리싱 + 프론트엔드 개발을 모두 수행할 수 있는 범용성',
    'GPT·AI 도구 활용 능력 (플러터 앱 단기 제작 경험 등)',
  ],
  flutter:
    'Flutter 위젯을 활용해 공유 리워드 플랫폼 앱의 전체 화면을 단기간에 구현한 경험이 있습니다.',
};

export const techStack = [
  {
    name: 'Vue / Nuxt',
    usage:
      '심리상담 플랫폼, 음식배달 웹앱, 가상계좌 백오피스 등 다수의 SI 프로젝트에서 UI 구조 설계, 상태관리(Pinia/Vuex), API 연결, 라우팅 등 전반을 담당했습니다.',
  },
  {
    name: 'React / Next.js',
    usage:
      'Next.js 기반 AI 챗봇 프로젝트에서 서버 액션, DB 연동(Drizzle+Neon), 스트리밍 응답 구성 등 전체 흐름을 직접 구현하며 생태계를 확장했습니다.',
  },
  {
    name: 'Zustand / Pinia / Vuex',
    usage:
      '프로젝트 규모와 성격에 맞춰 상태를 모듈 단위로 정리하며 유지보수성을 높였습니다.',
  },
  {
    name: 'TailwindCSS / SCSS / Bootstrap',
    usage:
      '퍼블리셔 경험을 기반으로 반응형 UI 구성과 컴포넌트 스타일링을 빠르게 설계했습니다.',
  },
  {
    name: 'Flutter',
    usage:
      'UI 퍼블리싱 중심의 앱 프로젝트에서 디자인 시안 기반 전체 화면을 구현했습니다.',
  },
  {
    name: 'Drizzle ORM + NeonDB',
    usage:
      '세션 기반 대화 저장 구조를 직접 설계하며 가벼운 백엔드 역할까지 수행했습니다.',
  },
];

export const projects = [
  {
    name: 'AI 챗봇 포트폴리오',
    summary: 'Next.js 기반 개인 프로젝트',
    contributions: [
      'Drizzle ORM + NeonDB로 대화 세션 저장 구조 설계',
      'AI 스트리밍 응답 처리 및 상태 관리(useChat 커스텀)',
      '다크모드, 테마 시스템, ChatHero UI 기획·구현',
      '포트폴리오 데이터를 주입하는 질문 분석 로직 구현',
    ],
    stack: ['Next.js', 'React', 'Zustand', 'TailwindCSS'],
  },
  {
    name: '심리상담 예약 플랫폼',
    summary: '4개의 미니 서비스로 구성된 상담/관리 플랫폼',
    contributions: [
      '디자인 시안(Figma) 제작 및 퍼블리싱',
      'Vue3 컴포넌트 구조 설계 및 일부 로직 구현',
      '고객–관리자–보고서–설문 흐름의 UI 설계',
    ],
    stack: ['Vue3', 'Pinia', 'Figma'],
  },
  {
    name: '음식배달 웹앱',
    summary: 'QR 기반 룸서비스 주문 플랫폼',
    contributions: [
      '모바일 중심 UI/UX 전체 설계',
      '옵션/가격 처리 로직, 장바구니, 결제 흐름 설계',
      '스마트로 결제모듈·카카오 로그인 연동',
    ],
    stack: ['Nuxt', 'Vue', 'Pinia', 'Axios'],
  },
  {
    name: '가상계좌 백오피스',
    summary: '가상계좌 발급 및 결제대행 관리 시스템',
    contributions: [
      'CRUD + 권한 제어 기능 전체 개발',
      'ReusableInput 컴포넌트화로 효율적인 유효성 검증 구축',
      '업무 로직에 맞춘 UX 구성 및 설계',
    ],
    stack: ['Nuxt', 'Pinia', 'Bootstrap', 'Axios'],
  },
  {
    name: '코인 지갑/관리자 사이트',
    summary: '고객 페이지 + 백오피스 구성',
    contributions: [
      '실시간 리워드 로직 기반 비즈니스 처리',
      'CRUD 및 데이터 바인딩',
      '로그인·상태관리 등 기능 전반 구현',
    ],
    stack: ['Nuxt', 'Pinia', 'Axios'],
  },
];
export const values = [
  {
    title: '사용자 중심 UI/UX',
    detail:
      '기능 개발 전 화면 흐름을 먼저 잡고, 사용자 동선으로 흐름을 파악해 유저 친화적인 컴포넌트를 설계합니다.',
  },
  {
    title: '명확한 커뮤니케이션',
    detail:
      '모호한 요구사항은 기능 단위로 재정의해 문서화하고, 팀원과 요구사항 우선순위를 조율해 프로젝트 리스크를 줄입니다.',
  },
  {
    title: '구조적 문제 해결',
    detail:
      '복잡한 로직을 단계별로 쪼개서 처리하며 재사용성을 확보하는 구조를 선호합니다.',
  },
  {
    title: '지속 가능한 코드',
    detail: '유지보수 가능한 패턴을 우선하며 필요 시 리팩토링으로 정돈합니다.',
  },
  {
    title: '학습과 확장',
    detail:
      'Flutter·결제 SDK 등 낯선 환경에서도 AI 도구를 활용해 단기간에 실전에 적용한 경험이 있습니다.',
  },
];
export const personality = [
  {
    title: '원활한 협업 소통',
    detail:
      '모호한 요구사항은 질문하고 정리해 공유하며, 협업 과정에서 소통이 원활하다는 평가를 자주 받습니다.',
  },
  {
    title: '문서화와 정리 습관',
    detail:
      '작업 내용을 명확하게 정리하고 공유해 실수나 누락을 줄이는 데 도움이 됩니다.',
  },
  {
    title: '책임감 있는 태도',
    detail:
      '맡은 일은 끝까지 완수하며, 프로젝트 흐름을 안정적으로 유지하려 노력합니다.',
  },
  {
    title: '학습 의지와 기술 적응력',
    detail: '낯선 기술이라도 빠르게 익히고 실무에 적용하려고 노력합니다.',
  },
];
