import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
// 유틸함수는 React 훅 직접 쓰기 금지 *유틸이 프레임워크에 종속되지 않게
export const handleInvalidSession = (router: AppRouterInstance) => {
  // 세션 무효 처리: 로컬스토리지 세션 제거 + intro 리다이렉트
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sessionId');
  }
  router.replace('/intro?reason=session-expired');
};
