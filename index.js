import { Client, Events, GatewayIntentBits, Collection, MessageFlags } from 'discord.js';
import { config } from "dotenv";
import { readdirSync, existsSync } from "fs";
import { join } from 'path';

config()

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

let foldersPath;

if (existsSync('/app/commands')){
	foldersPath = '/app/commands';
} else {
	foldersPath = join(process.cwd(), 'commands');
}

const commandFiles = readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = join(foldersPath, file);
	const command = await import(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});


client.once(Events.ClientReady, () => {
    console.log('Bot is online!');
})

client.login(process.env.DISCORD_TOKEN);