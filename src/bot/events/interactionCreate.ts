import { Interaction } from 'discord.js'
import { AppContext } from '../../types/context'
import { Command } from '../../types/command'

export function handleInteractionCreate(
	interaction: Interaction,
	context: AppContext,
	commands: Record<string, Command>
) {
	if (interaction.isChatInputCommand()) {
		const command = commands[interaction.commandName]
		if (!command) return

		if ('execute' in command) command.execute(interaction, context)
		else {
			const subcommand = interaction.options.getSubcommand()
			if (subcommand) command.subcommands[subcommand](interaction, context)
		}
	} else if ('customId' in interaction) {
		console.log(interaction.customId)
	}
}
