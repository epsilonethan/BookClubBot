const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('current-read')
        .setDescription('Set our current read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
