import { ChatInputCommandInteraction, Interaction } from 'discord.js'
import { AppContext } from '../../types/context.type'
import { Command } from '../../types/command.type'

export class InteractionRouter {
	constructor(
		private readonly context: AppContext,
		private readonly commands: Record<string, Command>,
	) { }

	public async handleInteractionCreate(interaction: Interaction) {
		// if (interaction.guildId) await this.addGuildIfNotExist(interaction.guildId)

		if (interaction.isChatInputCommand()) return await this.handleChatInputCommands(interaction)
		else if ('customId' in interaction) return await this.handleInteractionsWithCustomId(interaction)
	}

	// private async addGuildIfNotExist(guildId: string) {
	// 	const guildExists = !!await this.context.guildService.getGuildFeaturesSettings(guildId)
	// 	if (!guildExists) await this.context.guildService.addGuild(guildId)
	// }

	private async handleChatInputCommands(interaction: ChatInputCommandInteraction) {
		const command = this.commands[interaction.commandName]
		if (!command) return

		if ('execute' in command) return await command.execute(interaction, this.context)
		else {
			const subcommand = interaction.options.getSubcommand(false)
			if (!subcommand) return
			const allowedToContinue = await command.beforeAll?.(interaction, this.context) ?? true
			if (allowedToContinue) await command.subcommands[subcommand]?.(interaction, this.context)
		}
	}

	private async handleInteractionsWithCustomId(interaction: Interaction & { customId: string }) {
		console.log(interaction.customId)
	}
}
