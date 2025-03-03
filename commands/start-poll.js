import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('start-poll')
	.setDescription('Start a poll to vote on the next read');
export async function execute(interaction) {
	await interaction.reply('To be implemented');
}
