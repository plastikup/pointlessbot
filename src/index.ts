import { Client, Events, GatewayIntentBits } from 'discord.js'
import { IcebreakerService } from './core/icebreaker/icebreakerService'
import { db } from './infra/database/db'
import { IcebreakerRepository } from './infra/database/repositories/icebreakerRepo'
import { config } from 'dotenv'
import { InteractionRouter } from './bot/events/interactionRouter'
import { commands } from './bot/features'
import { GuildRepository } from './infra/database/repositories/guildRepo'
import { GuildService } from './core/guilds/guildService'
import { AppContext } from './types/context.type'

config()

// ##### Initialize app context, routers, infrastructure, and repositories #####
const icebreakerRepository = new IcebreakerRepository(db)
const icebreakerService = new IcebreakerService(icebreakerRepository)
const guildRepository = new GuildRepository(db)
const guildService = new GuildService(guildRepository)

const context: AppContext = { db, icebreakerService, guildService }
const interactionRouter = new InteractionRouter(context, commands)

// ##### Initialize Discord Client #####
export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		// GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessagePolls,
		GatewayIntentBits.DirectMessages,
	]
})

client.once(Events.ClientReady, () => console.log(`Logged in as ${client.user?.tag}`))
client.on(Events.InteractionCreate, interactionRouter.handleInteractionCreate.bind(interactionRouter))

client.login(process.env.DISCORD_TOKEN)
