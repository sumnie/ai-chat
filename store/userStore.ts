import { create } from "zustand"; //create()는 Zustand의 핵심 훅 생성 함수

type Theme = "light" | "dark";

interface UserState {
  name: string;
  theme: Theme;
  setName: (value: string) => void;
  setTheme: (theme: Theme) => void;
}

// set()으로 상태업데이트
export const useUserStore = create<UserState>((set) => ({
  name: "",
  theme: "light", // 기본값
  setName: (value) => set({ name: value }),
  setTheme: (theme) => set({ theme }),
}));
