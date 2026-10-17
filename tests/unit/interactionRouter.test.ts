import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ChatInputCommandInteraction } from 'discord.js'
import type { AppContext } from '../../src/types/context.type'
import type { Command } from '../../src/types/command.type'
import { InteractionRouter } from '../../src/bot/events/interactionRouter'

describe('InteractionRouter', () => {
	let context: AppContext
	let commands: Record<string, Command>
	let router: InteractionRouter

	const execute = vi.fn()
	const subexecute = vi.fn()
	const doNotCall = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()

		context = {} as AppContext
		commands = {
			ping: { execute } as unknown as Command,
			settings: { subcommands: { subexecute, doNotCall } } as unknown as Command,
		}
		router = new InteractionRouter(context, commands)
	})

	describe('ChatInputCommands', () => {
		it('finds and executes a command', () => {
			const interaction = {
				commandName: 'ping',
				isChatInputCommand: () => true,
			}
			router.handleInteractionCreate(interaction as unknown as ChatInputCommandInteraction)

			expect(execute).toHaveBeenCalledOnce()
			expect(execute).toHaveBeenCalledWith(interaction, context)
		})

		it('finds and executes a subcommand', () => {
			const interaction = {
				commandName: 'settings',
				isChatInputCommand: () => true,
				options: { getSubcommand: () => 'subexecute' },
			}
			router.handleInteractionCreate(interaction as unknown as ChatInputCommandInteraction)

			expect(subexecute).toHaveBeenCalledOnce()
			expect(subexecute).toHaveBeenCalledWith(interaction, context)
			expect(doNotCall).not.toHaveBeenCalled()
		})

		it('does not execute a handler for an unknown command', () => {
			const interaction = {
				commandName: 'unknown',
				isChatInputCommand: () => true,
			}
			router.handleInteractionCreate(interaction  as unknown as ChatInputCommandInteraction)

			expect(execute).not.toHaveBeenCalled()
			expect(subexecute).not.toHaveBeenCalled()
			expect(doNotCall).not.toHaveBeenCalled()
		})

		it('does not execute a handler for an unknown subcommand', () => {
			const interaction = {
				commandName: 'settings',
				isChatInputCommand: () => true,
				options: { getSubcommand: () => 'unknown' },
			}
			router.handleInteractionCreate(interaction as unknown as ChatInputCommandInteraction)

			expect(execute).not.toHaveBeenCalled()
			expect(subexecute).not.toHaveBeenCalled()
			expect(doNotCall).not.toHaveBeenCalled()
		})
	})
})
