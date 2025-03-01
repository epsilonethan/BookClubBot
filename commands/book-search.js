const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('book-search')
        .setDescription('Search for a book'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
