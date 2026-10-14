import { desc, eq } from 'drizzle-orm'
import { IIcebreakerRepository } from '../../../core/icebreaker/icebreakerRepo.interface'
import { DatabaseInstance } from '../db'
import { Icebreaker, icebreakersTable, NewIcebreaker } from '../schema'
import { IcebreakerPromptStatus } from '../../../types/icebreaker.type'

export class IcebreakerRepository implements IIcebreakerRepository {
	constructor(private readonly db: DatabaseInstance) { }

	/** Adds a new question to the queue */
	public async addQuestion(question: NewIcebreaker): Promise<Icebreaker> {
		const [newQuestion] = await this.db.insert(icebreakersTable).values(question).returning().execute()
		return newQuestion
	}

	/** Gets queued questions for a guild */
	public async getQueuedQuestions(guildId: string, limit?: number): Promise<Icebreaker[]> {
		const queueBuilder = this.db
			.select()
			.from(icebreakersTable)
			.where(eq(icebreakersTable.guildId, guildId))
			.orderBy(desc(icebreakersTable.createdAt))
		return limit ? queueBuilder.limit(limit).execute() : queueBuilder.execute()
	}

	/** Updates the status of a question */
	public async updateQuestionStatus(questionId: number, status: IcebreakerPromptStatus): Promise<Icebreaker | undefined> {
		const [updatedQuestion] = await this.db
			.update(icebreakersTable)
			.set({ status })
			.where(eq(icebreakersTable.id, questionId))
			.returning()
			.execute()
		return updatedQuestion
	}
}
