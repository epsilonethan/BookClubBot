import { SlashCommandBuilder } from "discord.js";
import {markCurrentReadFinished, setCurrentRead, showCurrentRead, unsetCurrentRead} from "../helpers/current-read.js";

export const data = new SlashCommandBuilder()
	.setName('current-read')
	.setDescription('Our current read')
	.addSubcommand(subcommand =>
		subcommand
			.setName('show')
			.setDescription('Shows the current read')
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('set')
			.setDescription('Sets the current read')
			.addIntegerOption(option =>
				option
					.setName('book-id')
					.setDescription('ID of the book to set as our current read')
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('unset')
			.setDescription('Unset the current read')
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('mark-finished')
			.setDescription('Mark the current read as finished')
	);
export async function execute(interaction, pgClientConfig) {
	if (interaction.options.getSubcommand() === 'show') {
		await showCurrentRead(pgClientConfig, interaction);
	} else if (interaction.options.getSubcommand() === 'set') {
		await setCurrentRead(pgClientConfig, interaction);
	} else if (interaction.options.getSubcommand() === 'unset') {
		await unsetCurrentRead(pgClientConfig, interaction);
	} else if (interaction.options.getSubcommand() === 'mark-finished') {
		await markCurrentReadFinished(pgClientConfig, interaction);
	}
}
