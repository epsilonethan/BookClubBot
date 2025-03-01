const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('del-rec')
        .setDescription('Delete a book from the recommendations list'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
