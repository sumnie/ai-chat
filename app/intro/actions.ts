"use server";

import { db } from "@/db";
import { sessions } from "@/db/schema";

export async function createSession(_:unknown,formData: FormData) {
  //  next server actions 함수(use server가 선언된 파일 안의 함수)에서 첫번째 인자는 자동으로 전달되는 요청관련 정보(context), 두번째 formData는 form 태그에서 action={} 자동으로 넘겨주는 객체.

  // 서버 액션은 기본적으로 이런 형식
  // someAction(prevState: any, formData: FormData) {...} _:unknown는 사용하지 않는 첫번째 인자 무시하기 위함

  const name = formData.get('name') as string;

  if (!name || name.trim().length === 0) {
    return { success: false, message: '이름을 입력해주세요.' };
  }
    const sessionId = crypto.randomUUID();

  await db.insert(sessions).values({
    id: sessionId,
    name,
    createdAt: new Date(),
  });

  // ✅ 클라이언트에서 localStorage.setItem('sessionId', sessionId)로 동기화 가능
  return { success: true, sessionId };
}

