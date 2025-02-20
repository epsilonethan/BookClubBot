import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('delRec')
        .setDescription('Delete a book from the recommendations list'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
