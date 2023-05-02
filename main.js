/**
 * Discord Archivoooor - A tool for archiving Discord channel messages.
 *
 * This script fetches all messages from a specified Discord channel and saves them to a file in Markdown format.
 * If 'html' is passed as the second command-line argument, the output file will be in HTML format.
 *
 * The output file will be saved in the 'output' directory as 'channelName_channel.md' or 'channelName_channel.html'.
 *
 * Usage:
 * 1. Install dependencies by running 'npm install'.
 * 2. Set up your Discord bot token in a '.env' file (see '.env.example' for reference).
 * 3. Run the script by passing the channel ID as an argument: 'node main.js <channelId> [html]'
 *
 * @example
 * // Archive messages in Markdown format
 * node main.js 123456789012345678
 *
 * @example
 * // Archive messages in HTML format
 * node main.js 123456789012345678 html
 */


const { Client, Events, GatewayIntentBits } = require('discord.js');
const fetchAllChannelMessages = require('./utils/fetchAllChannelMessages.js');
const saveToMarkdown = require('./utils/saveToMarkdown.js');
const saveToHtml = require('./utils/saveToHtml.js');
const args = process.argv.slice(2)
require('dotenv').config()

// Create a new client instance. Read only perms related to message history
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async c => {
    console.log(`Logged in as bot: ${c.user.tag}`);

    // Get command line arguments
    const channel_id = args[0];
    const outputFormat = args[1];
    try {
        const channel = await client.channels.fetch(channel_id);
        const messages = await fetchAllChannelMessages(channel);
        console.log(`Fetched ${messages.length} messages from ${channel.name}`);

        const listOfMessageObjects = messages.map(message => {
            const date = new Date(message.createdTimestamp);
            const formattedDate = date.toLocaleDateString("en-US");

            return {
                User: message.author.username,
                Content: message.content,
                Date: formattedDate,
            };
        });

        if (outputFormat == undefined) {
            saveToMarkdown(channel, listOfMessageObjects)
        } else if (outputFormat == 'html') {
            saveToHtml(channel, listOfMessageObjects)
        }

    } catch (e) {
        console.log(`--- An error has occurred ---\n${e}`);
    }
});

client.login(process.env.TOKEN);
