import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('rec-list')
	.setDescription('Show a list of all books that have been recommended');
export async function execute(interaction) {
	await interaction.reply('To be implemented');
}
