import { Client, Events, GatewayIntentBits } from 'discord.js'
import { IcebreakerService } from './core/icebreaker/icebreakerService'
import { db } from './infra/database/db'
import { IcebreakerRepository } from './infra/database/repositories/icebreakerRepo.sqlite'
import { AppContext } from './types/context'
import { handleInteractionCreate } from './bot/events/interactionCreate'
import { commands } from './bot/commands'
import { config } from 'dotenv'

config()

// ##### Initialize app context, infrastructure and repositories #####
const icebreakerRepository = new IcebreakerRepository(db)
const icebreakerService = new IcebreakerService(icebreakerRepository)

const context: AppContext = { db, icebreakerService }

// ##### Initialize Discord Client #####
export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessagePolls,
		GatewayIntentBits.DirectMessages,
	]
})

client.once(Events.ClientReady, () => console.log(`Logged in as ${client.user?.tag}`))
client.on(Events.InteractionCreate, (interaction) => handleInteractionCreate(interaction, context, commands))

client.login(process.env.DISCORD_TOKEN)
