const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mark-read')
        .setDescription('Add book to has been read list'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
