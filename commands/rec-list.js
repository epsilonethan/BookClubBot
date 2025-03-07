import { SlashCommandBuilder } from "discord.js";
import pg from "pg";
import {logger} from "../helpers/logger.js";
import {buildBookList} from "../helpers/build-book-list.js";

export const data = new SlashCommandBuilder()
	.setName('rec-list')
	.setDescription('Show a list of all books that have been recommended');
export async function execute(interaction, pgClientConfig) {

	const pgClient = new pg.Client(pgClientConfig);

	pgClient.connect()
		.catch((err) => logger.error(err));

	const recList = await pgClient
		.query('SELECT * FROM bookclub.books WHERE read_start IS NULL AND read_end IS NULL ORDER BY id')
		.catch(err => logger.error(err))
		.finally(() => pgClient.end());


	let botResponses = buildBookList('recommended', recList, interaction)

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
