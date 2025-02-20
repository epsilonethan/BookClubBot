import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('createEvent')
        .setDescription('Create an event for our next book club meeting'),
    async execute(interaction) {
        await interaction.reply('To be implemented');
    }
};
