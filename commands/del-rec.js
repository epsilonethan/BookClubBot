import { SlashCommandBuilder } from "discord.js";
import pg from "pg";
import {logger} from "../helpers/logger.js";

export const data = new SlashCommandBuilder()
	.setName('del-rec')
	.setDescription('Delete a book from the recommendations list')
	.addIntegerOption(option =>
		option
			.setName('book-id')
			.setDescription('ID of the recommended book to delete')
			.setRequired(true)
	);
export async function execute(interaction, pgClientConfig) {
	const bookId = interaction.options.getInteger('book-id');
	let title = '';
	let author = '';
	let deleteFailedFlag = false;
	let selectFailedFlag = false;
	const selectQuery = 'SELECT * FROM bookclub.books WHERE id = ($1)'
	const deleteQuery = 'DELETE FROM bookclub.books WHERE id = ($1)';

	const pgClient = new pg.Client(pgClientConfig);

	pgClient.connect()
	await pgClient.query(selectQuery, [bookId])
		.then(async result => {
			if (result.rows.length > 0) {
				const selectRow = result.rows[0];
				await pgClient.query(deleteQuery, [bookId])
					.then(result => {
						title = selectRow.title;
						author = selectRow.author;
						logger.info(`Removed ${selectRow.title} by ${selectRow.author} from recommended list`);
					})
					.catch(err => {
						logger.error('Failed to remove recommendation: ', err)
						deleteFailedFlag = true;
					});
			}
		})
		.catch(err => {
			logger.error('Failed to retrieve recommendation: ', err)
			selectFailedFlag = true
		})
		.finally(() => pgClient.end());

	if (deleteFailedFlag || selectFailedFlag) {
		await interaction.reply('Something went wrong. Please try again later.');
	} else {
		await interaction.reply(`Successfully deleted ${title} by ${author} from the recommended list`);
	}
}
