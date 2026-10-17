import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const guildsTable = sqliteTable('guilds', {
	id: text('id').primaryKey(),
	icebreakersEnabled: integer('icebreakers_enabled', { mode: 'boolean' }).notNull().default(false),
	communityIcebreakerSubmissionsEnabled: integer('community_icebreaker_submissions_enabled', { mode: 'boolean' }).notNull().default(false),
	icebreakersDmRemindersList: text('icebreakers_reminders_wishlist', { mode: 'json' }).$type<string[]>().notNull().default([]),
})

export type Guild = typeof guildsTable.$inferSelect
export type NewGuild = typeof guildsTable.$inferInsert
