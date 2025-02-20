import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('endPoll')
        .setDescription('End the current poll, and set winner as current read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
