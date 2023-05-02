# Discord Channel Archiver

A simple script to archive messages from a Discord channel. It overcomes Discord API's 100-message limit by fetching messages in batches. The script generates an output file in Markdown or HTML format, containing all the messages from the specified channel.

## Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Navigate to the `Bot` tab and click `Add Bot`.
3. Copy the token and enable all `Privileged Gateway Intents`.
4. In the `OAuth2` tab, configure the following permissions:
    - Scopes: `bot`
    - Bot Permissions: `Read Messages/View Channels` and `Read Message History`
5. Copy the generated URL and add the bot to your server.
    - `https://discord.com/api/oauth2/authorize?client_id=<BOT_ID>&permissions=66560&scope=bot`
6. Clone this repository and install the required dependencies:
    - `discord.js`
    - `dotenv`
7. Create a `.env` file in the project directory and input your bot token.
8. With the bot added to your server, copy the desired channel ID.

## Usage

To run the script, pass the channel ID as an argument:

```sh
$ node main.js <channel_id> [html]
