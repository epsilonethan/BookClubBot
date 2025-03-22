import {OpenLibraryClient} from "open-library-js";
import pg from "pg";
import {logger} from "./logger.js";
import {EmbedBuilder} from "discord.js";
import {getIsbn} from "./retrieve-book-info.js";
import moment from "moment-timezone";

export async function showCurrentRead(pgClientConfig, interaction) {
    let reply = '';
    let workId = '';
    let title = '';
    let author = '';
    let embed;
    const olc = new OpenLibraryClient();

    const selectQuery = 'SELECT * FROM bookclub.books WHERE read_end IS NULL AND read_start IS NOT NULL'
    const pgClient = new pg.Client(pgClientConfig);

    await pgClient.connect()
        .catch(err => logger.error(err));

    logger.info(`Retrieving current read for user ${interaction.user.id}`);
    await pgClient.query(selectQuery)
        .then(async results => {
            if (results.rows.length === 0) {
                reply = 'We are not currently reading anything';
            } else if (results.rows.length > 1) {
                throw new Error('Cannot have more than 1 current read at a time')
            } else {
                workId = results.rows[0].work_id;
                title = results.rows[0].title;
                author = results.rows[0].author;

                const isbn = await getIsbn(workId);

                if (isbn) {
                    embed = new EmbedBuilder()
                        .setTitle('Current Read')
                        .setColor('DarkRed')
                        .addFields([
                            {
                                name: 'Title:',
                                value: `[**${title}**](https://openlibrary.org/works/${workId})`,
                                inline: true
                            },
                            {name: '\u200B', value: '\u200B', inline: true},
                            {name: 'By:', value: `${author}`, inline: true},
                        ])
                        .setThumbnail(olc.getCoverUrlByIsbn(isbn))
                } else {
                    embed = new EmbedBuilder()
                        .setTitle('Current Read')
                        .setColor('DarkRed')
                        .addFields([
                            {
                                name: 'Title:',
                                value: `[**${title}**](https://openlibrary.org/works/${workId})`,
                                inline: true
                            },
                            {name: '\u200B', value: '\u200B', inline: true},
                            {name: 'By:', value: `${author}`, inline: true},
                        ])
                }
            }
            logger.info(`Successfully retrieved current read for user ${interaction.user.id}`);
        })
        .catch(err => {
            logger.error(err)
            reply = `Something went wrong. Please try again later.`
        })
        .finally(() => pgClient.end());

    if (embed) {
        await interaction.reply({embeds: [embed]});
    } else {
        await interaction.reply(reply)
    }
}

export async function setCurrentRead(pgClientConfig, interaction) {
    let reply = '';
    let title = '';
    let author = '';
    let currentlyReadingSetFlag = false;
    const bookId = interaction.options.getInteger('book-id');
    const date = moment().tz('America/Chicago').format('YYYY-MM-DD');

    const updateQuery = 'UPDATE bookclub.books SET read_start = ($1) WHERE id = ($2)'
    const values = [date, bookId]
    const pgClient = new pg.Client(pgClientConfig);

    await pgClient.connect()
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

    if (!currentlyReadingSetFlag) {
        logger.info(`Setting current read. Command ${interaction.commandName} executed by user ${interaction.user.id}`);
        await pgClient.query(updateQuery, values)
            .then(results => {
                logger.info(`Successfully set the current read`);
            })
            .catch(err => {
                logger.error(err)
                reply = `Something went wrong. Please try again later.`
            });

        await pgClient.query('SELECT * FROM bookclub.books WHERE read_start IS NOT NULL AND read_end IS NULL;')
            .then(results => {
                title = results.rows[0].title;
                author = results.rows[0].author;
                reply = `Successfully set the current read to ${title} by ${author}`
            }).catch(err => {
                logger.error(err)
            });
    }

    pgClient.end();

    await interaction.reply(reply);
}

export async function unsetCurrentRead(pgClientConfig, interaction) {
    let reply = '';
    let title = '';
    let author = '';

    const updateQuery = 'UPDATE bookclub.books SET read_start = NULL WHERE id = ($1)'
    const pgClient = new pg.Client(pgClientConfig);

    await pgClient.connect()
        .catch(err => logger.error(err));

    await pgClient.query('SELECT * FROM bookclub.books WHERE read_start IS NOT NULL AND read_end IS NULL;')
        .then(async results => {
            if (results.rows.length === 1) {
                logger.info(`Unsetting current read. Command ${interaction.commandName} executed by user ${interaction.user.id}`);
                await pgClient.query(updateQuery, [results.rows[0].id])
                    .then(results => {
                        logger.info(`Successfully unset the current read`);
                        reply = `${title} by ${author} is no longer the current read`
                        title = results.rows[0].title;
                        author = results.rows[0].author;
                    })
                    .catch(err => {
                        logger.error(err)
                        reply = `Something went wrong. Please try again later.`
                    });
            } else {
                logger.info(`No current read. Command ${interaction.commandName} executed by user ${interaction.user.id}`)
                reply = 'No current read is set'
            }
        })
        .catch(err => {
            logger.error(err)
        })
        .finally(() => pgClient.end());

    await interaction.reply(reply);
}

export async function markCurrentReadFinished(pgClientConfig, interaction) {
    let reply = '';
    let title = '';
    let author = '';
    const date = moment().tz('America/Chicago').format('YYYY-MM-DD');

    const updateQuery = 'UPDATE bookclub.books SET read_end = ($1) WHERE read_start IS NOT NULL AND read_end IS NULL;'
    const values = [date]
    const pgClient = new pg.Client(pgClientConfig);

    await pgClient.connect()
        .catch(err => logger.error(err));

    await pgClient.query('SELECT * FROM bookclub.books WHERE read_start IS NOT NULL AND read_end IS NULL;')
        .then(async results => {
            if (results.rows.length === 1) {
                title = results.rows[0].title;
                author = results.rows[0].author;
                logger.info(`Marking current read ${title} by ${author} as read. Command ${interaction.commandName} executed by user ${interaction.user.id}`);
                await pgClient.query(updateQuery, values)
                    .then(async results => {
                        logger.info(`Successfully marked ${title} by ${author} as read`);
                        reply = `Successfully marked ${title} by ${author} as read`;
                    })
                    .catch(err => {
                        logger.error(err)
                        reply = `Something went wrong. Please try again later.`
                    });
            } else {
                reply = 'There is no current read to mark finished';
            }
        })
        .catch(err => logger.error(err))
        .finally(() => pgClient.end());

    await interaction.reply(reply);
}