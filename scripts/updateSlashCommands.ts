import { Events } from 'discord.js'
import { client } from '../src'
import { commands } from '../src/bot/features'

client.once(Events.ClientReady, async () => {
	if (!client.application) return console.error('Client application is not initialized')

	await client.application.commands.set(Object.values(commands).map(command => command.data))
	console.log('Slash commands updated; exiting...')
	process.exit(0)
})
