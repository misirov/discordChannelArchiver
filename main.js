const { Client, Events, GatewayIntentBits } = require('discord.js');
const args = process.argv.slice(2)
require('dotenv').config()
const fs = require('fs');

// Create a new client instance. Read only perms related to message history
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
var channel_id = args;
client.once(Events.ClientReady, async c => {
    console.log(
        `\nPass a channel id to fetch al messages.:
    --> https://discord.com/channels/<server_id>/<channel_id>

    Logged in as bot: ${c.user.tag}
    Passed channel id: ${channel_id}
    `);

    var listOfMessageObjects = [];
    var channelObject = {};

    try {
        const channel = await client.channels.fetch(channel_id);
        const messages = await channel.messages.fetch({ limit: 100 });
        console.log(`Fetching ${messages.size} messages from ${channel.name}`);

        messages.forEach(message => {
            let unixTimestamp = message.createdTimestamp;
            let date = new Date(unixTimestamp);
            let formattedDate = date.toLocaleDateString("en-US");

            let messageObject = {
                "User": message.author.username,
                "Content": message.content,
                "Date": formattedDate
            };

            listOfMessageObjects.push(messageObject);
        });

        var md = listOfMessageObjects.map(messageObject =>
            `${messageObject.Date} **${messageObject.User}:** ${messageObject.Content}`).join('\n\n');

        fs.writeFile(`${channel.name}.md`, md, (err) => {
            if (err) {
                throw err;
            }
            console.log('Finished writing to file. Exit with CTRL+C');
        });

    }
    catch (e) {
        console.log(`--- An error has occured ---\n${e}`);
    }

});


// Log in to Discord with your client's token
client.login(process.env.TOKEN);
