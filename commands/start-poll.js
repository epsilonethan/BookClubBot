const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start-poll')
        .setDescription('Start a poll to vote on the next read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
