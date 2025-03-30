import {MessageFlags, SlashCommandBuilder} from "discord.js";
import {logger} from "../helpers/logger.js";
import {buildBookList} from "../helpers/build-book-list.js";

export const data = new SlashCommandBuilder()
	.setName('read-list')
	.setDescription('Display list of all books that have been read');
export async function execute(interaction, pgClientConfig) {
	let response;
	try{
		response = await fetch(process.env.MICRO_DOMAIN + "/read-list")
	} catch (e) {
		logger.error(e);
		await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
		return
	}

	const readList = await response.json()

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
