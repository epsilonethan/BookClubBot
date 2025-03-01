const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel-poll')
        .setDescription('Cancel the poll'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
