'use client';
// auth 없이 sessionId 만으로 사용자 구분. middleWare 도입 없이 layout에서 세션 분기 처리. layout은 서버 컴포넌트로 유지

//todo 혹시 /intro에서 /c로 깜빡거린다면 useEffect 전까지 렌더링을 멈추게 하고 분기 완료 후 화면 렌더 허용시키기 **setReady

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loading } from './Loading';

export function SessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // redirect 방지 위해 pathname 추가. 조건이 맞다면 불필요한 리다이렉트 X
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');

    // 세션 없으면 intro
    if (!sessionId && pathname !== '/intro') {
      router.replace('/intro');
    }

    // 세션이 있다면 바로 chat으로
    if (sessionId && pathname !== '/chat') {
      router.replace('/chat');
    }

    setReady(true);
  }, [pathname, router]); // 라우트가 바뀔 때마다 실행되도록 pathname 추가... React Hook 규칙(ESLint) 에선 “effect 안에서 참조하는 모든 외부 값은 dependency에 포함하라”는 룰 있음

  if (!ready) {
    return (
    <Loading></Loading>
    )
  }
  return <>{children}</>;
}



// Nuxt vs Next

// nuxt의 useRouter().fullPath == next의 usePathname()
// watch로 감지 vs useEffect로 감지, 쿼리 정보를 포함 vs 쿼리 정보는 searchParams써야


// redirect()와 router.replace()의 차이 => 서버 전용함수, 클라 전용함수
// process.client 코드 실행 분기(런타임. nuxt전용. 동적 조건) / use client (빌드타임. 컴포넌트 단위선언. next전용. 정적 선언)