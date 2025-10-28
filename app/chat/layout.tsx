'use client'; // 서버 컴포넌트로 두고 싶다면 session gate처럼 themeWrapper를 따로 만들어야

import { Header } from '@/components/chat/Header';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useUserStore((state) => state.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return (
    <div className="flex justify-center items-center min-h-[100vh] max-h-[100vh] overflow-y-auto bg-zinc-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex flex-col w-full min-h-[100vh] max-w-md px-3">
        {/* Header - (l)모델 선택, (r)테마 설정,  */}
        <Header></Header>
        {/* 채팅 내역 - 세션 id를 통해 대화내역 불러오기 + 로딩 Comp*/}
        {/* 대화내역이 아무것도 없다면 대화를 시작해볼까요? */}
        {children}
      </div>
    </div>
  );
}
