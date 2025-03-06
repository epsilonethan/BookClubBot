import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('del-rec')
	.setDescription('Delete a book from the recommendations list');
export async function execute(interaction, pgClient) {
	await interaction.reply('To be implemented');
}
