import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('readList')
        .setDescription('Display list of all books that have been read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
