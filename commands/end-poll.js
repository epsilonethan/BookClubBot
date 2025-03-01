const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end-poll')
        .setDescription('End the current poll, and set winner as current read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
