import { Command } from '../../types/command.type'
import { adminCommand } from './admin'
import { icebreakerCommand } from './icebreakers'
import { pingCommand } from './ping'

export const commands: Record<string, Command> = {
	[pingCommand.data.name]: pingCommand,
	[icebreakerCommand.data.name]: icebreakerCommand,
	[adminCommand.data.name]: adminCommand,
}
