/**
 * Discord Archivoooor - A tool for archiving Discord channel messages.
 *
 * - This script fetches all messages from a specified Discord channel and saves them to a file in Markdown format.
 * - If 'html' is passed as command-line argument, the output file will be in HTML format.
 * - If a remote repository is provided, files can be pushed to it.
 * 
 * The output file will be saved in the 'output' directory as 'channelName_channel.md' or 'channelName_channel.html'.
 *
 * Usage:
 *      1. Install dependencies by running 'npm install'.
 *      2. Set up your Discord bot token in a '.env' file (see '.env.example' for reference).
 *      3. Run the script by passing the channel ID as an argument: 'node main.js [html]'
 *      4. [OPTIONAL] set up a repo, get a github token and push files.
 *
 * @example
 * // Archive messages in Markdown format
 * node main.js
 *
 * @example
 * // Archive messages in HTML format
 * node main.js html
**/

const { Client, Events, GatewayIntentBits } = require('discord.js');
const fetchAllChannelMessages = require('./utils/fetchAllChannelMessages.js');
const { getThreadMessages, getChannelMessages } = require('./utils/getMessages.js')
const { saveChannelToMarkdown, saveThreadToMarkdown } = require('./utils/saveToMarkdown.js');
const saveToHtml = require('./utils/saveToHtml.js');
const pushToGitHub = require('./utils/pushToGithub.js');
const args = process.argv.slice(2);
const readline = require('readline');
require('dotenv').config();


// Create a new client instance with read-only permissions related to message history
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async c => {
    // Save the first command line argument for the rest of the session
    const fileType = args[0] || 'md';

    console.log('Client is ready. Enter channel ID or press CTRL+C to exit.');
    process.stdout.write('Channel ID > ');

    // Create readline interface for continuous input streaming
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Listen for user input and fetch channel messages
    rl.on('line', async (input) => {
        // @userInput channel ID, channel messages + threads will be fetched and saved
        // @userInput 'push', will clone and push saved channels to remote repository
        userInput = input.trim()
        if (userInput != 'push') {
            try {
                const channel_id = userInput;
                const channel = await client.channels.fetch(channel_id);
                const messages = await fetchAllChannelMessages(channel);

                const fetchedThreads = await channel.threads.fetch()
                const threads = fetchedThreads.threads

                const threadMessagesObject = await getThreadMessages(threads)

                const channelMessagesObject = await getChannelMessages(messages, channel);


                // Save messages in the specified format (Markdown by default, HTML if specified)
                if (fileType == 'html') {
                    saveToHtml(channel, channelMessagesObject);
                } else {
                    await saveChannelToMarkdown(channel, channelMessagesObject);
                    await saveThreadToMarkdown(channel, threads, threadMessagesObject);
                }

            } catch (e) {
                console.log(`--- An error has occurred ---\n${e.stack}`);
            }


        } else {
            console.log(`Pushing contents in output directory to ${process.env.REPO_URL} ...`)
            pushToGitHub(fileType)
        }

    });

    // Close event listener for exiting the program
    rl.on('close', () => {
        console.log('Exiting...');
        client.destroy();
        process.exit(0);
    });
});

client.login(process.env.TOKEN);
