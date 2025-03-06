import { SlashCommandBuilder } from "discord.js";
import moment from "moment-timezone"

export const data = new SlashCommandBuilder()
	.setName('rec-list')
	.setDescription('Show a list of all books that have been recommended');
export async function execute(interaction, pgClient) {

	pgClient.connect()
		.then(() => console.log('Connected to the database...'))
		.catch((err) => console.log(err));

	const recList = await pgClient.query('SELECT * FROM bookclub.books WHERE read_start IS NULL AND read_end IS NULL ORDER BY added_date')

	pgClient.end()

	let botResponse = '**Recommended List**:\n';
	let botResponses = [];

	recList.rows.forEach((row, i) => {
		const date = moment(row.added_date);
		const user = interaction.client.users.cache.get(row.added_by)

		let subString = `- **[${row.title}](https://openlibrary.org/works/${row.work_id})** by **${row.author}** \- *added on ${date.format('MM/DD/YYYY')}*`

		if (user && user.globalName) {
			subString += ` *by ${user.globalName}*`;
		}

		if ((botResponse + subString).length > 2000){
			botResponses.push(botResponse);
			botResponse = '';
		}

		botResponse += subString;
		if(i !== recList.rows.length - 1){
			botResponse += '\n';
		}
	})

	for (const response of botResponses) {
		await interaction.channel.send(response);
	}

	await interaction.reply(botResponse);
}
