import { Icebreaker } from '../../infra/database/schema'
import { IcebreakerPromptStatus } from '../../types/icebreaker.type'
import { fail, Failable, success } from '../../utils/failable'
import { IIcebreakerRepository } from './icebreakerRepo.interface'

export class IcebreakerService {
	constructor(private readonly repo: IIcebreakerRepository) { }

	/** Adds a new icebreaker question to the queue */
	public async addQuestion(guildId: string, prompt: string, title?: string): Promise<Failable<Icebreaker>> {
		// Icebreaker title length is defined by Discord's thread title max length
		// whereas the icebreaker prompt length is purely arbitrary
		if (title && title.length > 100) return fail({ message: 'Icebreaker title must be 100 characters or less' })
		if (prompt.length < 10) return fail({ message: 'Icebreaker prompt must be at least 10 characters' })
		if (prompt.length > 1000) return fail({ message: 'Icebreaker prompt must be 1000 characters or less' })
		// TODO: verify whether bot exists in the provided guild

		const icebreaker = await this.repo.addQuestion({ guildId, prompt, title })
		return success(icebreaker)
	}

	/** Returns the queued icebreaker questions for a guild */
	public async getQueuedQuestions(guildId: string): Promise<Icebreaker[]> {
		const questions = await this.repo.getQueuedQuestions(guildId)
		return questions
	}

	/**
	 * Marks a question as posted, either by its ID or as the next in the queue for a guild.
	 * @param questionId The ID of the question to mark as posted, or 'NEXT_IN_QUEUE' to mark the next question in the queue.
	 * @param guildId The ID of the guild to mark the question as posted for. Only required when `questionId` is `'NEXT_IN_QUEUE'`.
	 * @returns A boolean indicating whether the question was successfully marked as posted.
	 */
	public async markQuestionAsPosted(questionId: number): Promise<Failable<void>>;
	public async markQuestionAsPosted(questionId: 'NEXT_IN_QUEUE', guildId: string): Promise<Failable<void>>;
	public async markQuestionAsPosted(questionId: 'NEXT_IN_QUEUE' | number, guildId?: string): Promise<Failable<void>> {
		if (questionId === 'NEXT_IN_QUEUE') {
			const [nextQuestion] = await this.repo.getQueuedQuestions(guildId!, 1)
			if (nextQuestion) await this.repo.updateQuestionStatus(nextQuestion.id, IcebreakerPromptStatus.POSTED)

			return !!nextQuestion
				? success()
				: fail({ message: 'No queued icebreaker questions for this guild.' })
		} else {
			const updatedQuestion = await this.repo.updateQuestionStatus(questionId, IcebreakerPromptStatus.POSTED)
			return !!updatedQuestion
				? success()
				: fail({ message: 'Icebreaker question not found.' })
		}
	}
}
