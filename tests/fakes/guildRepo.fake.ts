import { IGuildRepository } from '../../src/core/guilds/guildRepo.interface'
import { NewGuild, Guild } from '../../src/infra/database/schema'
import { GuildSettings } from '../../src/types/guildSettings.type'

interface GuildState {
	icebreakersEnabled: boolean
	communityIcebreakerSubmissionsEnabled: boolean
	icebreakersDmRemindersList: string[]
}

export class InMemoryGuildRepository implements IGuildRepository {
	private guilds = new Map<string, GuildState>()

	/** Test helper to pre-seed or set state for a specific guild */
	public setGuild(guildId: string, state: Partial<GuildState>) {
		const current = this.guilds.get(guildId) || {
			icebreakersEnabled: false,
			communityIcebreakerSubmissionsEnabled: false,
			icebreakersDmRemindersList: [],
		}
		this.guilds.set(guildId, { ...current, ...state })
	}

	/** Returns the guild state for the given guild, initializing it if necessary */
	private getGuildState(guildId: string): GuildState {
		if (!this.guilds.has(guildId)) {
			this.guilds.set(guildId, {
				icebreakersEnabled: false,
				communityIcebreakerSubmissionsEnabled: false,
				icebreakersDmRemindersList: [],
			})
		}
		return this.guilds.get(guildId)!
	}

	public addGuild(options: NewGuild): Promise<Guild> {
		const { id } = options
		const guildSettings = {
			icebreakersEnabled: false,
			communityIcebreakerSubmissionsEnabled: false,
			icebreakersDmRemindersList: [],
			...options,
		}
		this.setGuild(id, guildSettings)
		return Promise.resolve(guildSettings)
	}

	public getGuildFeaturesSettings(guildId: string): Promise<GuildSettings> {
		const state = this.getGuildState(guildId)
		return Promise.resolve({
			icebreakersEnabled: state.icebreakersEnabled,
			communityIcebreakerSubmissionsEnabled: state.communityIcebreakerSubmissionsEnabled,
		})
	}

	public async toggleIcebreakers(guildId: string, enabled: boolean): Promise<void> {
		const state = this.getGuildState(guildId)
		state.icebreakersEnabled = enabled
	}

	public async toggleCommunityIcebreakerSubmissions(guildId: string, enabled: boolean): Promise<void> {
		const state = this.getGuildState(guildId)
		state.communityIcebreakerSubmissionsEnabled = enabled
	}

	public async getIcebreakersDmRemindersList(guildId: string): Promise<string[]> {
		return [...this.getGuildState(guildId).icebreakersDmRemindersList]
	}

	public async updateIcebreakersDmRemindersList(guildId: string, users: string[]): Promise<void> {
		const state = this.getGuildState(guildId)
		state.icebreakersDmRemindersList = [...users]
	}
}
