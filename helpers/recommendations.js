import {buildBookList} from "./build-book-list.js";
import {logger} from "./logger.js";
import pg from "pg";
import {capitalizeWords} from "./capitalizeWords.js";
import {getWorkFromTitleAuthor} from "./retrieve-book-info.js";

export async function listRecommendations(pgClientConfig, interaction) {
    const pgClient = new pg.Client(pgClientConfig);

    pgClient.connect()
        .catch((err) => logger.error(err));

    const recList = await pgClient
        .query('SELECT * FROM bookclub.books WHERE read_start IS NULL AND read_end IS NULL ORDER BY id')
        .catch(err => logger.error(err))
        .finally(() => pgClient.end());


    let botResponses = buildBookList('recommended', recList, interaction)

    let i = 0;
    for (const response of botResponses) {
        if (i === 0){
            await interaction.reply(response);
        } else {
            await interaction.followUp(response);
        }
        i++
    }
}

export async function addRecommendation(pgClientConfig, interaction) {
    let reply = '';

    const query = 'INSERT INTO bookclub.books (added_by, title, author, work_id, added_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;'

    const userId = interaction.user.id
    const title = capitalizeWords(interaction.options.getString('title'));
    const author = capitalizeWords(interaction.options.getString('author'));
    const work = await getWorkFromTitleAuthor(title, author);
    const workId = work.key.split('/').at(-1);
    const addedDate = moment(moment.now()).tz("America/Chicago");

    const values = [userId, title, author, workId, addedDate.format('YYYY-MM-DD')]

    const pgClient = new pg.Client(pgClientConfig);

    pgClient.connect()
        .catch(err => logger.error(err));

    await pgClient.query(query, values)
        .then(result => {
            logger.info(`User ${userId} added book record - work_id ${workId}`)
            reply = `${title} was successfully added!`
        })
        .catch(err => {
            if (err.code === '23505') {
                logger.warn(`User ${userId} attempted to add a duplicate book - title ${title}`)
                reply = `${title} is a duplicate entry...`
            } else {
                logger.error(err.message);
                reply = `Something went wrong. Please try again later.`
            }
        })
        .finally(() => pgClient.end());

    await interaction.reply(reply);
}

export async function deleteRecommendation(pgClientConfig, interaction) {
    const bookId = interaction.options.getInteger('book-id');
    let title = '';
    let author = '';
    let deleteFailedFlag = false;
    let selectFailedFlag = false;
    const selectQuery = 'SELECT * FROM bookclub.books WHERE id = ($1)'
    const deleteQuery = 'DELETE FROM bookclub.books WHERE id = ($1)';

    const pgClient = new pg.Client(pgClientConfig);

    pgClient.connect()
    await pgClient.query(selectQuery, [bookId])
        .then(async result => {
            if (result.rows.length > 0) {
                const selectRow = result.rows[0];
                await pgClient.query(deleteQuery, [bookId])
                    .then(result => {
                        title = selectRow.title;
                        author = selectRow.author;
                        logger.info(`Removed ${selectRow.title} by ${selectRow.author} from recommended list`);
                    })
                    .catch(err => {
                        logger.error('Failed to remove recommendation: ', err)
                        deleteFailedFlag = true;
                    });
            }
        })
        .catch(err => {
            logger.error('Failed to retrieve recommendation: ', err)
            selectFailedFlag = true
        })
        .finally(() => pgClient.end());

    if (deleteFailedFlag || selectFailedFlag) {
        await interaction.reply('Something went wrong. Please try again later.');
    } else {
        await interaction.reply(`Successfully deleted ${title} by ${author} from the recommended list`);
    }
}