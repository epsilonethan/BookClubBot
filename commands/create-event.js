import { SlashCommandBuilder, GuildScheduledEventManager, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import moment from 'moment-timezone'

export const data = new SlashCommandBuilder()
	.setName('create-event')
	.setDescription('Create an event for next meeting')
	.addStringOption(option => 
		option
			.setName('date')
			.setDescription('Date for next meeting in CST (MM/DD/YYYY h am/pm)')
			.setRequired(true)
	)
	.addStringOption(option => 
		option
			.setName('title')
			.setDescription('The book')
			.setRequired(true)
	);

export async function execute(interaction) {
	const dateString = interaction.options.getString('date');
	const title = interaction.options.getString('title');
	const date = moment.tz(dateString, "MM/DD/YYYY h a", "America/Chicago");

	if(!date.isValid()) {
		await interaction.reply('**ERROR**: *The date you entered had an invalid format. Enter in format* MM/DD/YYYY H am/pm')
		return
	}

	const event_manager = new GuildScheduledEventManager(interaction.guild)
	await event_manager.create({
		name: 'Book Club Meeting',
		scheduledStartTime: date.toDate(),
		entityType: GuildScheduledEventEntityType.Voice,
		privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
		description: title,
		channel: process.env.VOICE_CHANNEL_ID
	})


	await interaction.reply('Event successfully created');
}
