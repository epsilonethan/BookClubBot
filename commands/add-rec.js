import { SlashCommandBuilder } from "discord.js";
import moment from 'moment-timezone';
import {getWorkFromTitleAuthor} from "../helpers/retrieve-book-info.js";
import pg from "pg";
import {capitalizeWords} from "../helpers/capitalizeWords.js";
import {logger} from "../helpers/logger.js";

export const data = new SlashCommandBuilder()
	.setName('add-rec')
	.setDescription('Add a book recommendation to read for future book club meeting')
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
	);
export async function execute(interaction, pgClientConfig) {
	let reply = '';

	const query = 'INSERT INTO bookclub.books (added_by, title, author, work_id, added_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;'

	const userId = interaction.user.id
	const title = capitalizeWords(interaction.options.getString('title'));
	const author = capitalizeWords(interaction.options.getString('author'));
	const work = await getWorkFromTitleAuthor(title, author);
	const workId = work.key.split('/').at(-1);
	const addedDate = moment(moment.now()).tz("America/Chicago");

	const values = [userId, title, author, workId, addedDate.format('YYYY-MM-DD')]

	const pgClient = new pg.Client(pgClientConfig);

	pgClient.connect()
		.catch(err => logger.error(err));

	await pgClient.query(query, values)
		.then(result => {
			logger.info(`User ${userId} added book record - work_id ${workId}`)
			reply = `${title} was successfully added!`
		})
		.catch(err => {
			if (err.code === '23505') {
				logger.warn(`User ${userId} attempted to add a duplicate book - title ${title}`)
				reply = `${title} is a duplicate entry...`
			} else {
				logger.error(err.message);
				reply = `Something went wrong. Please try again later.`
			}
		})
		.finally(() => pgClient.end());

	await interaction.reply(reply);
}
