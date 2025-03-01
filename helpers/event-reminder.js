const { EmbedBuilder } = require('discord.js')
const momenttz = require('moment-timezone');

module.exports = async function eventReminders(client) {
	function capitalizeWords(str) {
		return str.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	let embeds = [];

	try {
		const guild = await client.guilds.fetch(process.env.GUILD_ID);
		const events = await guild.scheduledEvents.fetch();

		events.forEach(async (event) => {
			const textChannel = await guild.channels.fetch(process.env.CHANNEL_ID);
			const eventVoiceChannel = event.channel;

			if (textChannel && eventVoiceChannel.name === textChannel.name && textChannel.isTextBased()) {
				const eventStartCst = momenttz.tz(event.scheduledStartAt, 'America/Chicago')
				const eventStartEst = momenttz.tz(event.scheduledStartAt, 'America/New_York')

				const startString = `${eventStartCst.format('dddd, MMMM Do YYYY, h a z')} / ${eventStartEst.format('h a z')}`

				const currentlyReading = 'Akata Witch'
				const currentlyReadingLink = 'https://books.google.com/books/about/Akata_Witch.html?id=g2ZDrsToijoC'
				const summary = 'book summary'

				const embed = new EmbedBuilder()
					.setTitle(`${capitalizeWords(textChannel.name.replace('-', ' '))} Reminder`)
					.setColor('DarkRed')
					.setDescription(`**Meeting on**: ${startString}\n` +
									`**Book**: [${currentlyReading}](${currentlyReadingLink})\n` +
									`**Summary**: ${summary}`)

				embeds.push(embed);
			}
		});
	} catch (error) {
		console.error('Error sending event reminders:', error);
	}

	return embeds
}