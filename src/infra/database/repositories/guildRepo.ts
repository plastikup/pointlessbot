import { eq } from 'drizzle-orm'
import { IGuildRepository } from '../../../core/guilds/guildRepo.interface'
import { DatabaseInstance } from '../db'
import { Guild, guildsTable, NewGuild } from '../schema'
import { GuildSettings } from '../../../types/guildSettings.type'

export class GuildRepository implements IGuildRepository {
	constructor(private readonly db: DatabaseInstance) { }

	public async addGuild(options: NewGuild): Promise<Guild> {
		return await this.db
			.insert(guildsTable)
			.values(options)
			.returning()
			.execute()
			.then(([res]) => res)
	}

	public async getGuildFeaturesSettings(guildId: string): Promise<GuildSettings> {
		return await this.db
			.select({
				icebreakersEnabled: guildsTable.icebreakersEnabled,
				communityIcebreakerSubmissionsEnabled: guildsTable.communityIcebreakerSubmissionsEnabled,
			})
			.from(guildsTable)
			.where(eq(guildsTable.id, guildId))
			.execute()
			.then(([res]) => res)
	}

	public async toggleIcebreakers(guildId: string, enabled: boolean): Promise<void> {
		await this.db
			.update(guildsTable)
			.set({ icebreakersEnabled: enabled })
			.where(eq(guildsTable.id, guildId))
			.execute()
	}

	public async toggleCommunityIcebreakerSubmissions(guildId: string, enabled: boolean): Promise<void> {
		await this.db
			.update(guildsTable)
			.set({ communityIcebreakerSubmissionsEnabled: enabled })
			.where(eq(guildsTable.id, guildId))
			.execute()
	}

	public async getIcebreakersDmRemindersList(guildId: string): Promise<string[]> {
		return await this.db
			.select({ icebreakersDmRemindersList: guildsTable.icebreakersDmRemindersList })
			.from(guildsTable)
			.where(eq(guildsTable.id, guildId))
			.execute()
			.then(([res]) => res.icebreakersDmRemindersList)
	}

	public async updateIcebreakersDmRemindersList(guildId: string, users: string[]): Promise<void> {
		await this.db
			.update(guildsTable)
			.set({ icebreakersDmRemindersList: users })
			.where(eq(guildsTable.id, guildId))
			.execute()
	}
}
