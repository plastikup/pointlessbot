import { Guild, NewGuild } from "../../infra/database/schema"
import { GuildSettings } from "../../types/guildSettings.type"

export interface IGuildRepository {
	/** Adds a new guild to the repository */
	addGuild(options: NewGuild): Promise<Guild>
	/** Returns the guild features settings for the given guild */
	getGuildFeaturesSettings(guildId: string): Promise<GuildSettings>
	/** Toggles icebreakers for the given guild */
	toggleIcebreakers(guildId: string, enabled: boolean): Promise<void>
	/** Toggles community icebreaker submissions for the given guild */
	toggleCommunityIcebreakerSubmissions(guildId: string, enabled: boolean): Promise<void>
	/** Returns the list of subscribed admin members for Dm icebreaker reminders for the given guild */
	getIcebreakersDmRemindersList(guildId: string): Promise<string[]>
	/** Updates the list of subscribed admin members for Dm icebreaker reminders for the given guild */
	updateIcebreakersDmRemindersList(guildId: string, users: string[]): Promise<void>
}
