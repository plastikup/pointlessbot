import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../../types/command.type'

export const icebreakerCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('icebreakers')
		.setDescription('Groups icebreaker/QotD related commands')
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

	beforeAll: async (interaction) => !!interaction.guildId,

	subcommands: {
		'submit': async (interaction, context) => {
			// Verify if user has submitted a prompt
			const prompt = interaction.options.getString('prompt')
			if (!prompt) return

			// Verify if icebreakers are enabled for this guild and this user
			const guildSettings = await context.guildService.getGuildFeaturesSettings(interaction.guildId!)
			if (!guildSettings.icebreakersEnabled) {
				await interaction.reply(`Sorry, your admin has disabled icebreakers for this server.`)
				return
			}
			if (!guildSettings.communityIcebreakerSubmissionsEnabled && !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
				await interaction.reply(`Sorry, your admin has disabled community-driven icebreakers for this server.`)
				return
			}

			// Attempt to submit the icebreaker
			const { body, fail } = await context.icebreakerService.addQuestion(interaction.guildId!, prompt)

			// Back to the user
			if (fail) await interaction.reply(`Failed to submit icebreaker/QotD: ${body.message}`)
			else await interaction.reply(`Thank you for submitting the icebreaker/QotD: ${prompt}`)
		},
	}
}
