const { SlashCommandBuilder } = require("discord.js");
const eventReminders = require('../helpers/event-reminder.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Sends a reminder for future book club meeting'),
    async execute(interaction) {
		const embeds = await eventReminders(interaction.client)
		await interaction.reply({embeds: embeds});
    }
};
