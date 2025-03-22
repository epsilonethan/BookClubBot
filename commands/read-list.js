import { SlashCommandBuilder } from "discord.js";
import pg from "pg";
import {logger} from "../helpers/logger.js";
import {buildBookList} from "../helpers/build-book-list.js";

export const data = new SlashCommandBuilder()
	.setName('read-list')
	.setDescription('Display list of all books that have been read');
export async function execute(interaction, pgClientConfig) {
	const pgClient = new pg.Client(pgClientConfig);

	await pgClient.connect()
		.catch((err) => logger.error(err));

	const readList = await pgClient
		.query('SELECT * FROM bookclub.books WHERE read_start IS NOT NULL AND read_end IS NOT NULL ORDER BY read_end')
		.catch(err => logger.error(err))
		.finally(() => pgClient.end());

	let botResponses = buildBookList('read', readList, interaction)

	let i = 0;
	for (const response of botResponses) {
		if (i === 0){
			await interaction.reply(response);
		} else {
			await interaction.followUp(response);
		}
		i++
	}
}
