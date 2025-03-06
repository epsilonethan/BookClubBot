import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('add-rec')
	.setDescription('Add a book recommendation to read for future book club meeting');
export async function execute(interaction, pgClient) {

	await interaction.reply('To be implemented');
}
