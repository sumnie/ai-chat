// DB저장/조회용
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// 1️⃣ 모든 메시지 조회
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // searchParams은 주소표시줄에 있는 쿼리 스트링 정보지만 쿼리 스트링은 클라이언트에서만 접근 가능. 서버에서는 URL객체를 통해서만 접근 가능
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) {
    return Response.json({ error: 'sessionId required' }, { status: 400 });
  }
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.sessionId, sessionId))
    .orderBy(messages.createdAt);

  return Response.json(result);
}

// 2️⃣ 새 메시지 추가 (sessionId 포함)

export async function POST(req: Request) {
  const { sessionId, role, content } = await req.json();

  if (!sessionId || !role || !content) {
    return new Response('Invalid body', { status: 400 });
  }

  try {
    // ✅ sessionId를 uuid로 캐스팅
    const result = await db
      .insert(messages)
      .values({
        sessionId: sql`${sessionId}::uuid`,
        role,
        content,
      })
      .returning();

    return new Response('Message saved', { status: 201 });
  } catch (error) {
    return new Response('DB insert error', { status: 500 });
  }
}
