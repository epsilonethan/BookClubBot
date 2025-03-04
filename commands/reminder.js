import { SlashCommandBuilder } from "discord.js";
import {eventReminders} from '../helpers/event-reminder.js';

export const data = new SlashCommandBuilder()
	.setName('reminder')
	.setDescription('Sends a reminder for the next book club meeting');
export async function execute(interaction) {
	const embeds = await eventReminders(interaction.client);
	await interaction.reply({embeds: embeds})
}
