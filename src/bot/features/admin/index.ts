import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../../types/command.type'

export const adminCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Group of administrator related commands')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((s) => s
			.setName('icebreakers')
			.setDescription('View and edit icebreaker/QotD settings')
		),

	beforeAll: async (interaction) => {
		// double check only the admin is running the command
		const isAdmin = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) ?? false
		if (!isAdmin) await interaction.reply(`Non-admins are not permitted to run this command.`)
		return isAdmin
	},

	subcommands: {
		'icebreakers': async (interaction, context) => {
			// show to admin the current guild settings related to QotDs
			const guildSettings = await context.guildService.getGuildFeaturesSettings(interaction.guildId!)
			// TODO: FORMATTING, ADD BUTTONS, AND ADD CONFIRMATION FLOW
			await interaction.reply(JSON.stringify(guildSettings))
		}
	}
}
