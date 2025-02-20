import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('cancelPoll')
        .setDescription('Cancel the poll'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
