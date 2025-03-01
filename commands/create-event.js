const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Create an event for our next book club meeting'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
