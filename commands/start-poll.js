import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('startPoll')
        .setDescription('Start a poll to vote on the next read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
