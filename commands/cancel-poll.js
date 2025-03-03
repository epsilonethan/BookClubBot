import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('cancel-poll')
	.setDescription('Cancel the poll');
export async function execute(interaction) {
	await interaction.reply('To be implemented');
}
