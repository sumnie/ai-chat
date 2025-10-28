import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey(), // 테이블 내에서 primaryKey 설정은 필수
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
