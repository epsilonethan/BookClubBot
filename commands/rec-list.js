const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rec-list')
        .setDescription('Show a list of all books that have been recommended'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
