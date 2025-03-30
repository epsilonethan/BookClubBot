import moment from 'moment-timezone';

export function buildBookList(type, bookList, interaction) {
    let header = '';
    if (type === 'recommended') {
        header = '**Recommended List**:'
    } else if (type === 'read') {
        header = '**Completed Reads List**:'
    }

    let botResponses = [];
    let botResponse = header + '\n';
    bookList.forEach((row, i) => {
        const user = interaction.client.users.cache.get(row.added_by)

        let subString = `- ***${row.id}*** **[${row.title}](https://openlibrary.org/works/${row.work_id})** by **${row.author}**`

        if (user && user.globalName && type === 'recommended') {
            subString += ` - *Recommended by ${user.globalName}*`;
        }

        if (type === 'read') {
            const date = moment(row.read_end).tz('America/Chicago').format('MM/DD/YYYY');
            subString += ` - *Finished on ${date}*`;
        }

        if ((botResponse + subString).length > 2000){
            botResponses.push(botResponse);
            botResponse = '';
        }

        botResponse += subString;
        if(i !== bookList.length - 1){
            botResponse += '\n';
        }
    })

    botResponses.push(botResponse);

    return botResponses;
}