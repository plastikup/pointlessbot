import { guildsTable } from "../infra/database/schema"

export type GuildSettings = Pick<typeof guildsTable.$inferSelect,
	| 'icebreakersEnabled'
	| 'communityIcebreakerSubmissionsEnabled'
>
