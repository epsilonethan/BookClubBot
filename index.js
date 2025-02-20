/*
Commands for BookClubBot
- /addRec => add a suggestion to a running list of books for a future read
- /seeRecs => list all suggested books
- /removeRec => remove a suggestion from running list
- /seeRead => see list of previously read books
- /markAsRead => mark a book as read, remove it from current or suggestion list, add it to read list
- /startPoll => start a poll to pick next book from list of suggestions
- /endPoll => end poll, add winning book to currently reading, remove from suggestions
- /seeCurrent => show current book with description
- /createEvent => create channel event for next book club meeting
- /bookSearch => search google books. This could have subcommands for title, author, isbn
*/

import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import dotenv from "dotenv";

dotenv.config()

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once(Events.ClientReady, () => {
    console.log('Bot is online!');
})

client.login(process.env.DISCORD_TOKEN);