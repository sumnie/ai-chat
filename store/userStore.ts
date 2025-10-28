import { create } from 'zustand'; //create()는 Zustand의 핵심 훅 생성 함수
import { persist } from 'zustand/middleware';

// React component 안에서만 호출 가능하고(클라 전용), SSR에서 직접 접근 불가.
// React 렌더링 생명주기에 맞춰 동작하므로,
// 반드시 'use client' 컴포넌트 내부에서만 사용 가능.

type Theme = 'light' | 'dark';

interface UserState {
  name: string;
  theme: Theme;
  setName: (value: string) => void;
  setTheme: (theme: Theme) => void;
}

// set()으로 상태업데이트
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      theme: 'light', // 기본값
      setName: (value) => set({ name: value }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'user-storage', // localStorage key
    }
  )
);
