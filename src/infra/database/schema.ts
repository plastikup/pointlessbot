import { sqliteTable, text, integer,  } from 'drizzle-orm/sqlite-core';
import { IcebreakerPromptStatus } from '../../types/icebreaker.type';

export const icebreakersTable = sqliteTable('icebreakers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guildId: text('guild_id').notNull(),
  title: text('title'),
	prompt: text('prompt').notNull(),
  options: text('options', { mode: 'json' }).$type<string[]>(),
  status: text('status', { enum: Object.values(IcebreakerPromptStatus) as [string, ...string[]] }).notNull().default(IcebreakerPromptStatus.QUEUED),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type Icebreaker = typeof icebreakersTable.$inferSelect;
export type NewIcebreaker = typeof icebreakersTable.$inferInsert;
