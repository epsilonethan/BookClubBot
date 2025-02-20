import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('currentRead')
        .setDescription('Set our current read'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
