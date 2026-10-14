import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { AppContext } from './context'

type CommandExecute = (interfaction: ChatInputCommandInteraction, context: AppContext) => Promise<void>
interface SingleLayerCommand {
	data: SlashCommandBuilder
	execute: CommandExecute
}
interface MultiLayerCommand {
	data: SlashCommandSubcommandsOnlyBuilder
	subcommands: Record<string, CommandExecute>
}

export type Command = SingleLayerCommand | MultiLayerCommand
