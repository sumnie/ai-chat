'use client';

import { FloatingCard } from '@/components/intro/FloatingCard';
import { Submit } from '@/components/intro/Submit';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon, CircleAlert } from 'lucide-react';
import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { useFormValidate } from '../../hooks/useFormValidate';
import { nameSchema } from '../../schema/auth';
import { createSession } from './actions';

// sessionId가 없으면 introPage로, 있다면 바로 chat으로

export default function IntroPage() {
  const [values, setValues] = useState({ name: '' });
  const { errors, validateField } = useFormValidate<{ name?: string[] }>(
    nameSchema
  );
  const [state, formAction, pending] = useActionState(createSession, {
    success: false,
    sessionId: '',
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // input의 name 속성과 value
    setValues((v) => ({ ...v, [name]: value }));
    validateField(name, value);
  };
  useEffect(() => {
    if (state.success && state.sessionId) {
      localStorage.setItem('sessionId', state.sessionId);
      // router.push("/chat")
    }
  }, [state]);

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
