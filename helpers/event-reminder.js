import { EmbedBuilder } from 'discord.js';
import moment from 'moment-timezone';
import { getWorkFromTitle, getWorkCoverImage, getIsbn } from './retrieve-book-info.js';
import { OpenLibraryClient } from 'open-library-api';

export async function eventReminders(client) {
	const olc = new OpenLibraryClient();

	function capitalizeWords(str) {
		return str.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	try {
		const guild = await client.guilds.fetch(process.env.GUILD_ID);
		const events = await guild.scheduledEvents.fetch();
		const textChannel = await guild.channels.fetch(process.env.CHANNEL_ID);

		const event = events.filter(event => event.channel.name === textChannel.name).first()
		const eventStartCst = moment.tz(event.scheduledStartAt, 'America/Chicago')
		const eventStartEst = moment.tz(event.scheduledStartAt, 'America/New_York')

		const startString = `${eventStartCst.format('dddd, MMMM Do YYYY, h a z')} / ${eventStartEst.format('h a z')}`

		const currentlyReading = event.description

		const work = await getWorkFromTitle(currentlyReading);
		const currentlyReadingLink = 'https://openlibrary.org' + work.key
		const summary = work.description
		const isbn_13 = await getIsbn(work.key);

		console.log(olc.getCoverUrlByIsbn(isbn_13))

		const embed = new EmbedBuilder()
			.setTitle(`${capitalizeWords(textChannel.name.replace('-', ' '))} Reminder`)
			.setColor('DarkRed')
			.setDescription(`**Meeting on**: ${startString}\n` +
				`**Book**: [${capitalizeWords(work.title)}](${currentlyReadingLink})\n` +
				`**Summary**: ${summary}`)
			.setImage(olc.getCoverUrlByIsbn(isbn_13))

		return [embed]

	} catch (error) {
		console.error('Error sending event reminders:', error);
	}
}