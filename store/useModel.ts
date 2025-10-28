import { useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
// createStore(): zustand의 상태 저장소를 생성하는 함수. React 의존성이 없는 zustand 코어 스토어. 순수 JS 상태 컨테이너로, server에서도 사용가능. use client 유무에 영향 X
// 단, React 컴포넌트에서 사용하려면 useStore 훅으로 래핑 필요

export const modelStore = createStore(
  persist(
    () => ({
      // () 꼭 감싸줘야 반환값(return)으로 인식. 없으면 코드 블록으로 이해해서 undefined 반환
      model: 'gpt-4',
      updateModel: (newModel: string) =>
        modelStore.setState({ model: newModel }),
    }),
    {
      name: 'model-storage', // localStorage key
    }
  )
);

// React에서 사용할 수 있도록 훅 형태로 래핑
export const useModelStore = () => useStore(modelStore);
