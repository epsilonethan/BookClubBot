const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-rec')
        .setDescription('Add a book recommendation to read for future book club meeting'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
