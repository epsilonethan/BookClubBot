import { SlashCommandBuilder } from "discord.js";
import moment from "moment-timezone";
import pg from "pg";
import {logger} from "../helpers/logger.js";

export const data = new SlashCommandBuilder()
	.setName('mark-read')
	.setDescription('Add book to has been read list')
	.addIntegerOption(option =>
		option
			.setName('book-id')
			.setDescription('ID of the book to mark as read')
			.setRequired(true)
	);
export async function execute(interaction, pgClientConfig) {
	let reply = '';
	let title = '';
	let author = '';
	let doNotMarkFlag = false;
	const bookId = interaction.options.getInteger('book-id');
	const date = moment().tz('America/Chicago').format('YYYY-MM-DD');

	const updateQuery = 'UPDATE bookclub.books SET read_end = ($1) WHERE id = ($2)'
	const values = [date, bookId]
	const pgClient = new pg.Client(pgClientConfig);

	pgClient.connect()
		.catch(err => logger.error(err));

	await pgClient.query('SELECT * FROM bookclub.books WHERE id = ($1) AND read_start IS NULL AND read_end IS NULL;', [bookId])
		.then(results => {
			if (results.rows.length > 0) {
				reply = `Cannot mark as read. ${results.rows[0].title} by ${results.rows[0].author} has not been started yet.`
				doNotMarkFlag = true;
			}
		})
		.catch(err => {
			logger.error(err)
		});

	await pgClient.query('SELECT * FROM bookclub.books WHERE id = ($1) AND read_start IS NOT NULL AND read_end IS NOT NULL;', [bookId])
		.then(results => {
			if (results.rows.length > 0) {
				reply = `${results.rows[0].title} by ${results.rows[0].author} has already been marked as read`;
				doNotMarkFlag = true;
			}
		})
		.catch(err => {
			logger.error(err)
		});


	if (!doNotMarkFlag){
		logger.info(`Marking current read as read. Command ${interaction.commandName} executed by user ${interaction.user.id}`);
		await pgClient.query(updateQuery, values)
			.then(async results => {
				logger.info(`Successfully set the current read`);
				await pgClient.query('SELECT title, author FROM bookclub.books WHERE id = ($1)', [bookId])
					.then(results => {
						title = results.rows[0].title;
						author = results.rows[0].author;
						reply = `Successfully marked the current read ${title} by ${author} as read`
					})
					.catch(err => logger.error('Failed getting updated row: ', err))
			})
			.catch(err => {
				logger.error(err)
				reply = `Something went wrong. Please try again later.`
			});
	}

	pgClient.end();

	await interaction.reply(reply);
}
