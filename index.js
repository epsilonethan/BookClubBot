import { Client, Events, GatewayIntentBits, Collection, EmbedBuilder } from 'discord.js';
import dotenv from "dotenv";
import fs from "fs";
import path from 'path';

dotenv.config()

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('.\\commands\\').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.resolve(process.cwd(), './commands/' + file)
    const fileURL = new URL(filePath);
    const fileFile = fileURL.pathname.replace(/\\/g,'/')

    // Dynamic import for each file
    import(fileFile).then(command => {
        // Check if the command has 'data' and 'execute' properties
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${fileFile} is missing a required "data" or "execute" property.`);
        }
    }).catch(error => {
        console.log(`[ERROR] Failed to load command at ${fileFile}: ${error.message}`);
    });
}



client.once(Events.ClientReady, () => {
    console.log('Bot is online!');
})

client.login(process.env.DISCORD_TOKEN);