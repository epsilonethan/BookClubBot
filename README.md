

# BookClubBot
**BookClubBot** is a Discord bot designed to enhance your book club experience by providing various features to manage
and engage with your reading community.

## Features
- Manage past, current, and future reads
- Setup events and reminders for meetings

## Prerequisites
**Node.js**: Ensure you have Node.js installed.

**Discord Bot Token**: Obtain a bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

**Create Postgresql Database**: You'll need to set one up to contain book data
- `id` (integer)
  - This will need to be the primary key
  - Also setup a sequence to auto increment when rows are added
- `added_by` (bigint)
- `title` (character varying)
  - Create constraint that this column must contain unique values
- `author` (character varying)
- `work_id` (character varying)
- `read_start` (date)
- `read_end` (date)
- `added_date` (date)

## Installation (the hard way)
1. **Clone the Repository**:
```bash
git clone https://github.com/epsilonethan/BookClubBot.git
cd BookClubBot
```
2. **Install Dependencies**:
```bash
npm install
```
3. **Set Up Environment Variables**: Create a `.env` file in the root directory and add your Discord bot token:
```ini
DISCORD_TOKEN=<your-discord-bot-token>
BOOKCLUBBOT_APP_ID=<your-discord-bot-app-id>
GUILD_ID=<guild-id>
TEXT_CHANNEL_ID=<book-clubs-text-channel-id>
VOICE_CHANNEL_ID=<book-clubs-voice-channel-id>
ROLE_ID=<book-clubs-role-id>
POSTGRES_USER=<postgres-user>
POSTGRES_PASSWORD=<postgres-password>
POSTGRES_DB=<postgres-databse>
POSTGRES_HOST=<postgres-host>
POSTGRES_PORT=<postgres-port>
```
4. **Set up Postgres Database**:
- Install Postgresql your favorite way
- Create a database
- Create a schema named `bookclub` with a table `books`
- The table will need the following columns
  - `id` (integer)
    - This will need to be the primary key
    - Also setup a sequence to auto increment when rows are added
  - `added_by` (bigint)
  - `title` (character varying)
      - Create constraint that this column must contain unique values
  - `author` (character varying)
  - `work_id` (character varying)
  - `read_start` (date)
  - `read_end` (date)
  - `added_date` (date)

5. **Deploy Commands**:
```bash
node deploy-commands.js
```
6. **Run the Bot**: Start the bot using:
```bash
node index.js
```

## Installation With Kube/Helm
TBD

## Usage
Once the bot is running and added to your Discord server, use the following commands:
- `/create-event [date] [title]`: Create an event for your book club
- `/reminder`: Send a reminder of the book club meeting tagging book club members 
- `/read-list`: Display a list of previously read books
- `/current-read show`: Display information for the selected read for the upcoming book club meeting
- `/current-read set [book-id]`: Set the current read. `book-id` is set by the database and can be seen using the `/recommendation list` command
- `/current-read unset`: Removes the current read as the book currently being read
- `/current-read mark-finished`: Marks the book currently being read as finished
- `/recommendation list`: Show a list of all books that have been recommended
- `/recommendation add [title] [author]`: Add a book to the list of recommendations
- `/recommendation delete [book-id]`:  Delete book from the list of recommendations

## License
This project is licensed under the Apache-2.0 License. See the [LICENSE](https://github.com/epsilonethan/BookClubBot/blob/master/LICENSE) file for details.