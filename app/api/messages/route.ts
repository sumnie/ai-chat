// DB저장/조회용
import { db } from '@/db';
import { messages } from '@/db/schema';

// 1️⃣ 모든 메시지 조회
export async function GET() {
  const result = await db.select().from(messages).orderBy(messages.createdAt);
  return Response.json(result);
}

// 2️⃣ 새 메시지 추가
export async function POST(req: Request) {
  const { role, content } = await req.json();

  if (!role || !content) {
    return new Response('Invalid body', { status: 400 });
  }

  await db.insert(messages).values({ role, content });
  return new Response('Message saved', { status: 201 });
}
