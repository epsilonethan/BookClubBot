import { EmbedBuilder } from 'discord.js';
import moment from 'moment-timezone';
import { getWorkFromTitle, getIsbn } from './retrieve-book-info.js';
import { OpenLibraryClient } from 'open-library-js';

export async function eventReminders(client) {
	const olc = new OpenLibraryClient();

	function capitalizeWords(inputString) {
		// Split the input string by hyphens
		const words = inputString.split('-');

		// Capitalize the first letter of each word and make other letters lowercase
		const capitalizedWords = words.map(word => {
			// Capitalize the first letter and make the rest lowercase
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		});

		// Join the words back together with spaces
		return capitalizedWords.join(' ');
	}

	try {
		const guild = await client.guilds.fetch(process.env.GUILD_ID);
		const events = await guild.scheduledEvents.fetch();
		const textChannel = await guild.channels.fetch(process.env.TEXT_CHANNEL_ID);

		const eventsFiltered = events.filter(event => event.channel.name === textChannel.name)
		const eventsFilteredSorted = eventsFiltered.sort((a, b) => a.scheduledStartTimestamp - b.scheduledStartTimestamp);
		const event = eventsFilteredSorted.first();
		const eventStartCst = moment.tz(event.scheduledStartAt, 'America/Chicago')
		const eventStartEst = moment.tz(event.scheduledStartAt, 'America/New_York')

		const startString = `${eventStartCst.format('dddd, MMMM Do YYYY, h a z')} / ${eventStartEst.format('h a z')}`

		const currentlyReading = event.description

		const work = await getWorkFromTitle(currentlyReading);
		const currentlyReadingLink = 'https://openlibrary.org' + work.key
		let summary;
		if (typeof work.description === 'string') {
			summary = work.description
		} else {
			summary = work.description.value
		}

		const isbn_13 = await getIsbn(work.key);

		const embed = new EmbedBuilder()
			.setTitle(`Next ${capitalizeWords(textChannel.name.replace('-', ' '))} Meeting Reminder`)
			.setColor('DarkRed')
			.setDescription(`<@&${process.env.ROLE_ID}>\n` +
				`**Meeting on**: ${startString}\n` +
				`**Book**: [${capitalizeWords(work.title)}](${currentlyReadingLink})\n` +
				`**Summary**: ${summary}`)
			.setImage(olc.getCoverUrlByIsbn(isbn_13))

		return [embed]

	} catch (error) {
		console.error('Error sending event reminders:', error);
	}
}