import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { IcebreakerPromptStatus } from '../../../types/icebreaker.type'
import { guildsTable } from './guilds.sqlite'

export const icebreakersTable = sqliteTable('icebreakers', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	guildId: text('guild_id').notNull().references(() => guildsTable.id),
	title: text('title'),
	body: text('body').notNull(),
	options: text('options', { mode: 'json' }).$type<string[]>().notNull().default([]),
	status: text('status', { enum: Object.values(IcebreakerPromptStatus) as [string, ...string[]] }).notNull().default(IcebreakerPromptStatus.QUEUED),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export type Icebreaker = typeof icebreakersTable.$inferSelect
export type NewIcebreaker = typeof icebreakersTable.$inferInsert
