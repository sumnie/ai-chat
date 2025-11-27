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
    const session = await db.execute(
      // execute는 단순 쿼리 실행용. 세션 존재 여부를 먼저 확인
      sql`SELECT 1 FROM sessions WHERE id = ${sessionId}::uuid`
    );
    if (session.rows.length === 0) {
      // ✅ 세션 불일치 → 404로 명확히 반환
      return Response.json(
        { error: '존재하지 않는 세션입니다.' },
        { status: 404 }
      );
    }

    // ✅ sessionId를 uuid로 캐스팅
    await db.insert(messages).values({
      sessionId: sql`${sessionId}::uuid`,
      role,
      content,
    });
    // .returning() // 삽입된 행 반환. 결과를 쓸 때만 사용

    return new Response('Message saved', { status: 201 });
  } catch (error) {
    return new Response('DB insert error', { status: 500 });
  }
}
