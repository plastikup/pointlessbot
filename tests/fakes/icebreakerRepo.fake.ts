import { Icebreaker, NewIcebreaker } from '../../src/infra/database/schema'
import { IIcebreakerRepository } from '../../src/core/icebreaker/icebreakerRepo.interface'
import { IcebreakerPromptStatus } from '../../src/types/icebreaker.type'

export class InMemoryIcebreakerRepository implements IIcebreakerRepository {
	public questions: Icebreaker[] = []

	public async addQuestion(question: NewIcebreaker): Promise<Icebreaker> {
		const newQuestion: Icebreaker = {
			id: this.questions.length + 1,
			title: null,
			status: IcebreakerPromptStatus.QUEUED,
			createdAt: new Date(Date.now()),
			...question,
		}
		this.questions.push(newQuestion)
		return newQuestion
	}

	public async getQueuedQuestions(guildId: string, limit?: number): Promise<Icebreaker[]> {
		return this.questions
			.filter(q => q.guildId === guildId && q.status === IcebreakerPromptStatus.QUEUED)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, limit)
	}

	public async updateQuestionStatus(questionId: number, status: IcebreakerPromptStatus): Promise<Icebreaker | undefined> {
		const question = this.questions.find(q => q.id === questionId)
		if (question) question.status = status
		return question
	}
}
