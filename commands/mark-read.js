import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('markRead')
        .setDescription('Add book to has been read list'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
