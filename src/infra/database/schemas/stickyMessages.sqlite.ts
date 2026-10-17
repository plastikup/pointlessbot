import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { guildsTable } from './guilds.sqlite'

export const stickyMessagesTable = sqliteTable('sticky_messages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	guildId: text('guild_id').notNull().references(() => guildsTable.id, { onDelete: 'cascade' }),
	channelId: text('channel_id').notNull().unique(),
	body: text('body').notNull(),
})
