import { SlashCommandBuilder } from "discord.js";
import pg from "pg";
import {logger} from "../helpers/logger.js";
import moment from 'moment-timezone';

export const data = new SlashCommandBuilder()
    .setName('set-current')
    .setDescription('Set our current read')
    .addIntegerOption(option =>
        option
            .setName('book-id')
            .setDescription('ID of the book to set as our current read')
            .setRequired(true)
    );
export async function execute(interaction, pgClientConfig) {
    let reply = '';
    let title = '';
    let author = '';
    let currentlyReadingSetFlag = false;
    const bookId = interaction.options.getInteger('book-id');
    const date = moment().tz('America/Chicago').format('YYYY-MM-DD');

    const updateQuery = 'UPDATE bookclub.books SET read_start = ($1) WHERE id = ($2)'
    const values = [date, bookId]
    const pgClient = new pg.Client(pgClientConfig);

    pgClient.connect()
        .catch(err => logger.error(err));

    await pgClient.query('SELECT * FROM bookclub.books WHERE read_start IS NOT NULL AND read_end IS NULL;')
        .then(results => {
            if (results.rows.length > 0) {
                reply = `${results.rows[0].title} by ${results.rows[0].author} is already set as the current read. Mark that one as read first {ID: ${results.rows[0].id}}`
                currentlyReadingSetFlag = true;
            }
        })
        .catch(err => {
            logger.error(err)
        });

    if (!currentlyReadingSetFlag){
        logger.info(`Setting current read. Command ${interaction.commandName} executed by user ${interaction.user.id}`);
        await pgClient.query(updateQuery, values)
            .then(results => {
                logger.info(`Successfully set the current read`);
                reply = `Successfully set the current read to ${title} by ${author}`
                title = results.rows[0].title;
                author = results.rows[0].author;
            })
            .catch(err => {
                logger.error(err)
                reply = `Something went wrong. Please try again later.`
            });
    }

    pgClient.end();

    await interaction.reply(reply);
}
