import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import pg from "pg";
import {logger} from "../helpers/logger.js";
import {getIsbn} from "../helpers/retrieve-book-info.js";
import {OpenLibraryClient} from "open-library-js";

export const data = new SlashCommandBuilder()
	.setName('get-current')
	.setDescription('Get our current read');
export async function execute(interaction, pgClientConfig) {
	let reply = '';
	let workId = '';
	let title = '';
	let author = '';
	let embed;
	const olc = new OpenLibraryClient();

	const query = 'SELECT * FROM bookclub.books WHERE read_end IS NULL AND read_start IS NOT NULL'
	const pgClient = new pg.Client(pgClientConfig);

	pgClient.connect()
		.catch(err => logger.error(err));

	logger.info(`Retrieving current read for user ${interaction.user.id}`);
	await pgClient.query(query)
		.then(async results => {
			if (results.rows.length === 0) {
				reply = 'We are not currently reading anything';
			} else if (results.rows.length > 1) {
				throw new Error('Cannot have more than 1 current read at a time')
			} else {
				workId = results.rows[0].work_id;
				title = results.rows[0].title;
				author = results.rows[0].author;

				embed = new EmbedBuilder()
					.setTitle('Current Read')
					.setColor('DarkRed')
					.addFields([
						{name: 'Title:', value: `[**${title}**](https://openlibrary.org/works/${workId})`, inline: true},
						{name: '\u200B', value: '\u200B', inline: true},
						{name: 'By:', value: `${author}`, inline: true},
					])
					.setThumbnail(olc.getCoverUrlByIsbn(await getIsbn(workId)))
			}
			logger.info(`Successfully retrieved current read for user ${interaction.user.id}`);
		})
		.catch(err => {
			logger.error(err)
			reply = `Something went wrong. Please try again later.`
		})
		.finally(() => pgClient.end());

	if (embed) {
		await interaction.reply({embeds: [embed]});
	} else {
		await interaction.reply(reply)
	}

}
