import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('read-list')
	.setDescription('Display list of all books that have been read');
export async function execute(interaction, pgClient) {
	await interaction.reply('To be implemented');
}
