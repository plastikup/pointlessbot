import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { AppContext } from './context.type'

type CommandExecute = (interaction: ChatInputCommandInteraction, context: AppContext) => Promise<void>
interface SingleLayerCommand {
	data: SlashCommandBuilder
	execute: CommandExecute
}
interface MultiLayerCommand {
	data: SlashCommandSubcommandsOnlyBuilder
	subcommands: Record<string, CommandExecute>
	beforeAll?: (interaction: ChatInputCommandInteraction, context: AppContext) => Promise<boolean>
}

export type Command = SingleLayerCommand | MultiLayerCommand
