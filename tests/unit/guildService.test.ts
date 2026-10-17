import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGuildRepository } from '../fakes/guildRepo.fake'
import { GuildService } from '../../src/core/guilds/guildService'

describe('GuildService', () => {
	let repo: InMemoryGuildRepository
	let service: GuildService

	beforeEach(() => {
		repo = new InMemoryGuildRepository()
		service = new GuildService(repo)
	})

	describe('addGuild', () => {
		it('adds a guild with the given id and options', async () => {
			const guildId = 'guild-123'
			const result = await service.addGuild(guildId, { communityIcebreakerSubmissionsEnabled: true })
			expect(result).toEqual({
				id: guildId,
				icebreakersEnabled: false,
				communityIcebreakerSubmissionsEnabled: true,
				icebreakersDmRemindersList: [],
			})
		})
	})

	describe('getGuildFeaturesSettings', () => {
		it('returns the guild features settings', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { icebreakersEnabled: true, communityIcebreakerSubmissionsEnabled: false })

			const result = await repo.getGuildFeaturesSettings(guildId)
			expect(result).toEqual({ icebreakersEnabled: true, communityIcebreakerSubmissionsEnabled: false })
		})
	})

	describe('toggleIcebreakers', () => {
		it('toggles icebreakers from false to true', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { icebreakersEnabled: false })

			await service.toggleIcebreakers(guildId)

			const { icebreakersEnabled } = await repo.getGuildFeaturesSettings(guildId)
			expect(icebreakersEnabled).toBe(true)
		})

		it('toggles icebreakers from true to false', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { icebreakersEnabled: true })

			await service.toggleIcebreakers(guildId)

			const { icebreakersEnabled } = await repo.getGuildFeaturesSettings(guildId)
			expect(icebreakersEnabled).toBe(false)
		})
	})

	describe('toggleCommunityIcebreakerSubmissions', () => {
		it('toggles submissions state from false to true', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { communityIcebreakerSubmissionsEnabled: false })

			await service.toggleCommunityIcebreakerSubmissions(guildId)

			const { communityIcebreakerSubmissionsEnabled } = await repo.getGuildFeaturesSettings(guildId)
			expect(communityIcebreakerSubmissionsEnabled).toBe(true)
		})

		it('toggles submissions state from true to false', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { communityIcebreakerSubmissionsEnabled: true })

			await service.toggleCommunityIcebreakerSubmissions(guildId)

			const { communityIcebreakerSubmissionsEnabled } = await repo.getGuildFeaturesSettings(guildId)
			expect(communityIcebreakerSubmissionsEnabled).toBe(false)
		})
	})

	describe('addUsersToIcebreakersDmRemindersList', () => {
		it('adds new users and deduplicates input array', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { icebreakersDmRemindersList: ['user-1'] })

			await service.addUsersToIcebreakersDmRemindersList(guildId, ['user-2', 'user-1', 'user-2'])

			const list = await repo.getIcebreakersDmRemindersList(guildId)
			expect(list).toEqual(['user-1', 'user-2'])
		})
		it("doesn't add empty strings as users", async () => {
			const guildId = 'guild-123'
			await service.addUsersToIcebreakersDmRemindersList(guildId, ['user-1', ''])

			const list = await repo.getIcebreakersDmRemindersList(guildId)
			expect(list).toEqual(['user-1'])
		})
	})

	describe('removeUsersFromIcebreakersDmRemindersList', () => {
		it('removes specified users from the reminder list', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { icebreakersDmRemindersList: ['user-1', 'user-2', 'user-3'] })

			await service.removeUsersFromIcebreakersDmRemindersList(guildId, ['user-2'])

			const list = await repo.getIcebreakersDmRemindersList(guildId)
			expect(list).toEqual(['user-1', 'user-3'])
		})
		it('keeps current users of the reminder list when removing an unsubscribed user', async () => {
			const guildId = 'guild-123'
			repo.setGuild(guildId, { icebreakersDmRemindersList: ['user-1', 'user-2', 'user-3'] })

			await service.removeUsersFromIcebreakersDmRemindersList(guildId, ['user-4'])

			const list = await repo.getIcebreakersDmRemindersList(guildId)
			expect(list).toEqual(['user-1', 'user-2', 'user-3'])
		})
	})
})
