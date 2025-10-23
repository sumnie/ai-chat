"use server";

import { db } from "@/db";
import { sessions } from "@/db/schema";

export async function createSession(_:unknown,formData: FormData) {
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

