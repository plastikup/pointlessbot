import { IcebreakerService } from '../core/icebreaker/icebreakerService'
import { DatabaseInstance } from '../infra/database/db'

export interface AppContext {
	db: DatabaseInstance
	icebreakerService: IcebreakerService
}
