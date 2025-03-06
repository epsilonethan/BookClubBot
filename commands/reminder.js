import { SlashCommandBuilder } from "discord.js";
import {eventReminders} from '../helpers/event-reminder.js';

export const data = new SlashCommandBuilder()
	.setName('reminder')
	.setDescription('Sends a reminder for the next book club meeting');
export async function execute(interaction, pgClient) {
	const embeds = await eventReminders(interaction.client);
	await interaction.reply({embeds: embeds})
}
