import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('addRec')
        .setDescription('Add a book recommendation to read for future book club meeting'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
