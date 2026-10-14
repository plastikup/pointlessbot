import { Command } from '../../types/command'
import { icebreakerCommand } from './icebreakers'
import { pingCommand } from './ping'

export const commands: Record<string, Command> = {
	[pingCommand.data.name]: pingCommand,
	[icebreakerCommand.data.name]: icebreakerCommand,
}
