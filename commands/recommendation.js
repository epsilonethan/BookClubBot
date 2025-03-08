import { SlashCommandBuilder } from "discord.js";
import {addRecommendation, deleteRecommendation, listRecommendations} from "../helpers/recommendations.js";

export const data = new SlashCommandBuilder()
	.setName('recommendation')
	.setDescription('Show a list of all books that have been recommended')
	.addSubcommand(subcommand =>
		subcommand
			.setName('list')
			.setDescription('List of books that have been recommended')
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('add')
			.setDescription('Add book to the list of recommendations')
			.addStringOption(option =>
				option
					.setName('title')
					.setDescription('Title of the book')
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName('author')
					.setDescription('Author of the book')
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('delete')
			.setDescription('Delete book from the list of recommendations')
			.addIntegerOption(option =>
				option
					.setName('book-id')
					.setDescription('ID of the recommended book to delete')
					.setRequired(true)
			)
	);
export async function execute(interaction, pgClientConfig) {
	if (interaction.options.getSubcommand() === "list") {
		await listRecommendations(pgClientConfig, interaction);
	} else if (interaction.options.getSubcommand() === "add") {
		await addRecommendation(pgClientConfig, interaction);
	} else if (interaction.options.getSubcommand() === "delete") {
		await deleteRecommendation(pgClientConfig, interaction);
	}
}
