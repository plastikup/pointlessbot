import { Guild, NewGuild } from '../../infra/database/schema'
import { GuildSettings } from '../../types/guildSettings.type'
import { IGuildRepository } from './guildRepo.interface'

export class GuildService {
	constructor(private readonly repo: IGuildRepository) { }

	/** Adds a new guild to the database */
	public async addGuild(guildId: string, options?: Omit<NewGuild, 'id'>): Promise<Guild> {
		return this.repo.addGuild({ id: guildId, ...options } satisfies NewGuild)
	}

	/** Returns the guild features settings for the given guild. Creates a new guild in the database if it does not exist */
	public async getGuildFeaturesSettings(guildId: string): Promise<GuildSettings> {
		// TODO: reddis caching
		const guildSettings = await this.repo.getGuildFeaturesSettings(guildId)
		if (!!guildSettings) return guildSettings
		const newGuildSettings = await this.repo.addGuild({ id: guildId })
		return newGuildSettings
	}

	/** Toggles the icebreaker mode for the given guild */
	public async toggleIcebreakers(guildId: string): Promise<void> {
		const { icebreakersEnabled } = await this.repo.getGuildFeaturesSettings(guildId)
		await this.repo.toggleIcebreakers(guildId, !icebreakersEnabled)
	}

	/** Toggles the community icebreaker submissions mode for the given guild */
	public async toggleCommunityIcebreakerSubmissions(guildId: string): Promise<void> {
		const { communityIcebreakerSubmissionsEnabled } = await this.repo.getGuildFeaturesSettings(guildId)
		await this.repo.toggleCommunityIcebreakerSubmissions(guildId, !communityIcebreakerSubmissionsEnabled)
	}

	/** Adds users to the list of DM reminders for icebreakers in the given guild */
	public async addUsersToIcebreakersDmRemindersList(guildId: string, users: string[]): Promise<void> {
		const existingUsers = await this.repo.getIcebreakersDmRemindersList(guildId)
		const updatedUsers = [...new Set([...existingUsers, ...users])].filter(Boolean)
		if (updatedUsers.length === existingUsers.length) return

		await this.repo.updateIcebreakersDmRemindersList(guildId, updatedUsers)
	}

	/** Removes users from the list of DM reminders for icebreakers in the given guild */
	public async removeUsersFromIcebreakersDmRemindersList(guildId: string, users: string[]): Promise<void> {
		const existingUsers = await this.repo.getIcebreakersDmRemindersList(guildId)
		const updatedUsers = existingUsers.filter(user => !users.includes(user))
		if (updatedUsers.length === existingUsers.length) return

		await this.repo.updateIcebreakersDmRemindersList(guildId, updatedUsers)
	}
}
