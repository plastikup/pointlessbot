import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../../../types/command'

export const icebreakerCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('icebreaker')
		.setDescription('Group of icebreaker/QotD related commands')
		.addSubcommand((s) => s
			.setName('submit')
			.setDescription('Suggest a new icebreaker/QotD')
			.addStringOption((o) => o
				.setName('prompt')
				.setDescription('The content of the icebreaker/QotD')
				.setMinLength(10)
				.setRequired(true)
		)
	),

	subcommands: {
		'submit': async (interaction, context) => {
			if (!interaction.guildId) return

			const prompt = interaction.options.getString('prompt')
			if (!prompt) return

			const { body, fail } = await context.icebreakerService.addQuestion(interaction.guildId, prompt)

			if (fail) await interaction.reply(`Failed to submit icebreaker/QotD: ${body.message}`)
			else await interaction.reply(`Thank you for submitting the icebreaker/QotD: ${prompt}`)
		},
	}
}
