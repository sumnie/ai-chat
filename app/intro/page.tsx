'use client';

import { FloatingCard } from '@/components/intro/FloatingCard';
import { Submit } from '@/components/intro/Submit';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/userStore';
import { ArrowRightIcon, CircleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { useFormValidate } from '../../hooks/useFormValidate';
import { nameSchema } from '../../schema/auth';
import { createSession } from './actions';

// sessionId가 없으면 introPage로, 있다면 바로 chat으로

export default function IntroPage() {
  const router = useRouter();
  const [values, setValues] = useState({ name: '' });
  const { errors, validateField } = useFormValidate<{ name?: string[] }>(
    nameSchema
  );
  const [state, formAction, pending] = useActionState(createSession, {
    success: false,
    sessionId: '',
  });

  const { name, setName } = useUserStore();

  // 1️⃣ useActionState: form이 제출되면 formData를 Next.js 서버로 자동 전송하여 createSession(커스텀 서버 함수)을 실행
  // 2️⃣ createSession은 (prevState, formData)를 인자로 받으며, prevState는 액션 실행 직전의 state
  // 3️⃣ 함수의 return 값이 새로운 state로 업데이트됨

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // input의 name 속성과 value
    setValues((v) => ({ ...v, [name]: value }));
    validateField(name, value);
  };
  useEffect(() => {
    if (state.success && state.sessionId) {
      localStorage.setItem('sessionId', state.sessionId);
      useUserStore.getState().setName(values.name); // 훅은 컴포넌트 최상단에서만 호출되어야 함. useEffect, 조건문, 반복문 안에서 호출 금지.
      // useUserStore도 훅이지만, zustand는 getState()로 스토어 객체에 바로 접근하는 JS 메서드를 제공함. (훅 아님)
      router.replace('/chat');
    }
  }, [state, router, values.name]);

  return (
    <div className="flex justify-center items-center min-h-[100vh] max-h-[100vh] overflow-y-auto bg-zinc-100">
      <FloatingCard
        title="안녕하세요 :)"
        description="대화를 위해, 방문하신 분의 이름을 알려주세요"
      >
        <form action={formAction} className="flex-col w-[100%]">
          <div className="flex gap-2">
            <Input
              type="text"
              name="name"
              placeholder="이름 또는 닉네임을 알려주세요"
              className="py-5"
              onChange={handleChange}
              disabled={pending}
              value={values.name}
            />
            <Submit
              size="icon" // ...others로 넘어감
              className="p-5"
              hasError={!!errors?.name} // 에러있으면 true
            >
              <ArrowRightIcon />
            </Submit>
          </div>
          {errors?.name && (
            <p className="flex items-center gap-2 text-red-500 text-sm mt-2">
              <CircleAlert size={15}></CircleAlert>
              {errors.name}
            </p>
          )}
        </form>
      </FloatingCard>
    </div>
  );
}
