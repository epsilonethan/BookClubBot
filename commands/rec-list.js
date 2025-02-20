import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('recList')
        .setDescription('Show a list of all books that have been recommended'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
