'use client'; // 서버 컴포넌트로 두고 싶다면 session gate처럼 themeWrapper를 따로 만들어야

import { Header } from '@/components/chat/Header';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const theme = useUserStore((state) => state.theme);
  return (
    <div
      className={cn(
        'flex justify-center items-center min-h-[100vh] max-h-[100vh] overflow-y-auto',
        theme === 'dark' ? 'bg-gray-900' : 'bg-zinc-100'
      )}
    >
      <div className="flex flex-col w-full min-h-[100vh] md:w-[768px]">
        {/* Header - (l)모델 선택, (r)테마 설정,  */}
        <Header></Header>
        {/* 채팅 내역 - 세션 id를 통해 대화내역 불러오기 */}
        {/* 대화내역이 아무것도 없다면 대화를 시작해볼까요?  */}
        {children}
      </div>
    </div>
  );
}
