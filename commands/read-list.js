const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('read-list')
        .setDescription('Display list of all books that have been read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
