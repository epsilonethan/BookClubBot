import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('end-poll')
	.setDescription('End the current poll, and set winner as current read');
export async function execute(interaction, pgClient) {
	await interaction.reply('To be implemented');
}
