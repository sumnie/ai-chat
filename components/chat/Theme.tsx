'use client';

import { useUserStore } from "@/store/userStore";
import { Moon, Sun } from "lucide-react";

export function Theme() {
    const changeTheme = () => {
        const currentTheme = useUserStore.getState().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        useUserStore.getState().setTheme(newTheme);
    }
  return (
    <div>
        {useUserStore((state) => state.theme) === "light" ? <Moon onClick={changeTheme} /> : <Sun onClick={changeTheme} />}        
    </div>
  )
}
