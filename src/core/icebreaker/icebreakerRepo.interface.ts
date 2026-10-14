import { Icebreaker, NewIcebreaker } from '../../infra/database/schema'
import { IcebreakerPromptStatus } from '../../types/icebreaker.type'

export interface IIcebreakerRepository {
	/** Adds a new question to the queue */
	addQuestion(question: NewIcebreaker): Promise<Icebreaker>;
	/** Gets queued questions for a guild */
	getQueuedQuestions(guildId: string, limit?: number): Promise<Icebreaker[]>;
	/** Update a prompt status */
	updateQuestionStatus(questionId: number, status: IcebreakerPromptStatus): Promise<Icebreaker | undefined>;
}
