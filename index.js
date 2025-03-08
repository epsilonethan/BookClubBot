import { Client, Events, GatewayIntentBits, Collection, MessageFlags, Options } from 'discord.js';
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from 'path';
import {logger} from './helpers/logger.js';

config()

// Create a new Discord client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	sweepers: {
		...Options.DefaultSweeperSettings,
		users: {
			interval: 3_600,
			filter: () => user => user.bot && user.id !== user.client.user.id
		}
	}
});

const pgClientConfig = {
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: process.env.POSTGRES_PORT
}

client.commands = new Collection();

let foldersPath = join(process.cwd(), 'commands');

const commandFiles = readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = join(foldersPath, file);
	const command = await import(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		logger.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		logger.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, pgClientConfig);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});


client.once(Events.ClientReady, async () => {
    logger.info('Bot is online!');
	const guild = await client.guilds.fetch(process.env.GUILD_ID)
	await guild.members.fetch();
})

client.login(process.env.DISCORD_TOKEN);