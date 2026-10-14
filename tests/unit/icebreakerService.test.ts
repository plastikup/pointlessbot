import { describe, expect, it } from 'vitest'
import { IcebreakerService } from '../../src/core/icebreaker/icebreakerService'
import { InMemoryIcebreakerRepository } from '../fakes/icebreakerRepo.fake'
import { NewIcebreaker } from '../../src/infra/database/schema'

describe('IcebreakerService Unit Tests', () => {
	it('should successfully queue a valid new icebreaker question', async () => {
		const repo = new InMemoryIcebreakerRepository()
		const service = new IcebreakerService(repo)

		const question = { title: 'Test title', prompt: 'Perfectly valid test body', guildId: '000' }
		const result = await service.addQuestion(question.guildId, question.prompt, question.title)

		expect(result.fail).toBe(false)
		expect(result.body).toMatchObject(question)
	})
	it('should fail queuing icebreakers when titles are too long', async () => {
		const repo = new InMemoryIcebreakerRepository()
		const service = new IcebreakerService(repo)

		const question = { title: 'Way too long title'.repeat(10), prompt: 'Perfectly valid test body', guildId: '000' }
		const result = await service.addQuestion(question.guildId, question.prompt, question.title)

		expect(result.fail).toBe(true)
	})
	it('should fail queuing icebreakers when prompts are too short', async () => {
		const repo = new InMemoryIcebreakerRepository()
		const service = new IcebreakerService(repo)

		const question = { title: 'Test title', prompt: 'Too short', guildId: '000' }
		const result = await service.addQuestion(question.guildId, question.prompt, question.title)

		expect(result.fail).toBe(true)
	})
	it('should fail queuing icebreakers when prompts are too long', async () => {
		const repo = new InMemoryIcebreakerRepository()
		const service = new IcebreakerService(repo)

		const question = { title: 'Test title', prompt: 'Way too long prompt'.repeat(100), guildId: '000' }
		const result = await service.addQuestion(question.guildId, question.prompt, question.title)

		expect(result.fail).toBe(true)
	})

	it('should successfully retrieve queued icebreaker questions in the guild', async () => {
		const currentGuildIcebreakers: NewIcebreaker[] = [{ prompt: 'Icebreaker body', guildId: '000' }, { prompt: 'Another icebreaker body', guildId: '000' }]
		const otherGuildIcebreakers: NewIcebreaker[] = [{ prompt: 'Icebreaker body', guildId: '111' }, { prompt: 'Another icebreaker body', guildId: '222' }]

		const repo = new InMemoryIcebreakerRepository()

		await Promise.all(currentGuildIcebreakers.map((question) => repo.addQuestion(question)))
		await Promise.all(otherGuildIcebreakers.map((question) => repo.addQuestion(question)))

		const service = new IcebreakerService(repo)

		const result = await service.getQueuedQuestions('000')
		expect(result).toEqual(expect.arrayContaining(
			currentGuildIcebreakers.map((question) => expect.objectContaining(question))
		))
	})
	it('should retrieve an empty list when no icebreaker questions are queued in the guild', async () => {
		const otherGuildIcebreakers: NewIcebreaker[] = [{ prompt: 'Icebreaker body', guildId: '111' }, { prompt: 'Another icebreaker body', guildId: '222' }]

		const repo = new InMemoryIcebreakerRepository()
		await Promise.all(otherGuildIcebreakers.map((question) => repo.addQuestion(question)))

		const service = new IcebreakerService(repo)

		const result = await service.getQueuedQuestions('000')
		expect(result).toEqual([])
	})

	it('should successfully mark the next icebreaker in queue as answered and remove it from the guild queue', async () => {
		const oldIcebreaker: NewIcebreaker = { prompt: 'Icebreaker body', guildId: '000' }
		const recentIcebreaker: NewIcebreaker = { prompt: 'Recent icebreaker body', guildId: '000' }

		const repo = new InMemoryIcebreakerRepository()
		await repo.addQuestion(oldIcebreaker)
		await new Promise(resolve => setTimeout(resolve, 100)) // micro delay
		await repo.addQuestion(recentIcebreaker)

		const service = new IcebreakerService(repo)

		const result = await service.markQuestionAsPosted('NEXT_IN_QUEUE', '000')
		const newQueue = await service.getQueuedQuestions('000')
		expect(result.fail).toBe(false)
		expect(newQueue).toEqual([expect.objectContaining(oldIcebreaker)])

		// expect(newQueue.length).toBe(1)
		// expect(newQueue[0]).toMatchObject(oldIcebreaker)
	})
	it('should return failure when trying to mark the next icebreaker in queue as answered when queue is empty', async () => {
		const repo = new InMemoryIcebreakerRepository()
		const service = new IcebreakerService(repo)

		const result = await service.markQuestionAsPosted('NEXT_IN_QUEUE', '000')
		expect(result.fail).toBe(true)
	})
	it('should successfully mark an icebreaker as answered by its ID and remove it from the guild queue', async () => {
		const repo = new InMemoryIcebreakerRepository()
		const question = await repo.addQuestion({ prompt: 'Icebreaker body', guildId: '000' })

		const service = new IcebreakerService(repo)

		const result = await service.markQuestionAsPosted(question.id)
		const newQueue = await service.getQueuedQuestions('000')
		expect(result.fail).toBe(false)
		expect(newQueue).toEqual([])
	})
	it('should return failure when trying to mark an non-existing icebreaker as answered', async () => {
		const repo = new InMemoryIcebreakerRepository()
		const service = new IcebreakerService(repo)

		const result = await service.markQuestionAsPosted(0) // nonexistent icebreaker ID
		expect(result.fail).toBe(true)
	})
})
