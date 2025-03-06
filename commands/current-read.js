import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('current-read')
	.setDescription('Set our current read');
export async function execute(interaction, pgClient) {
	await interaction.reply('To be implemented');
}
