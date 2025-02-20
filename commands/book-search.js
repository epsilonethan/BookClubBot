import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('bookSearch')
        .setDescription('Search for a book'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
