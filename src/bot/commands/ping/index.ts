import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../../../types/command'

export const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Play a quick game of pong!'),

	execute: async (interaction) => {
		//* Send initial response
		const interactionCallbackResponse = await interaction.reply({ content: 'Calculating...', withResponse: true })

		//* Update message content with latency
		const roundtrip = interactionCallbackResponse.resource && interactionCallbackResponse.resource.message
			? interactionCallbackResponse.resource?.message?.createdTimestamp - interaction.createdTimestamp
			: undefined

		await interaction.editReply({ content: roundtrip ? `The roundtrip took ${roundtrip}ms.` : '...and I lost the ball.' })
	},
}
