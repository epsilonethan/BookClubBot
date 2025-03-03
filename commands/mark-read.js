import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('mark-read')
	.setDescription('Add book to has been read list');
export async function execute(interaction) {
	await interaction.reply('To be implemented');
}
