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
    `)

    var listOfMessageObjects = [];
    var channelObject = {};

    try {
        const channel = await client.channels.fetch(channel_id);
        const messages = await channel.messages.fetch({ limit: 100 });
        console.log(`Fetching ${messages.size} messages from ${channel.name}`)

        messages.forEach(message => {
            let unixTimestamp = message.createdTimestamp;
            let date = new Date(unixTimestamp);
            let formattedDate = date.toLocaleDateString("en-US");

            let messageObject = {
                "User": message.author.username,
                "Content": message.content,
                "Date": formattedDate
            }

            listOfMessageObjects.push(messageObject);
        });

        channelObject = {
            "Channel Name": channel.name,
            "Channel Members": channel.members,
            "Number of Messages": messages.size,
            "Messages": listOfMessageObjects
        }

        // Create HTML table with messages
        let tableHtml = "<table><tr><th>User</th><th>Message</th><th>Date</th></tr>";
        listOfMessageObjects.forEach(message => {
            tableHtml += `<tr><td>${message.User}</td><td>${message.Content}</td><td>${message.Date}</td></tr>`;
        });
        tableHtml += "</table>";

        // Create full HTML file with table
        var html = `<html>
    <head>
        <title> Spearbit Discord channel: ${channel.name} </title>
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                text-align: left;
                padding: 8px;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
        <body>
            <h1>Channel: ${channel.name}</h1>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Content</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${listOfMessageObjects.map(messageObject => `
                    <tr>
                        <td>${messageObject.User}</td>
                        <td>${messageObject.Content}</td>
                        <td>${messageObject.Date}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
    </html>`

        fs.writeFile(`${channel.name}.html`, html, (err) => {
            if (err) {
                throw err;
            }
            console.log('Finished writing to file. Exit with CTRL+C')
        })

    }
    catch (e) {
        console.log(`--- An error has occured ---\n${e}`)
    }

});


// Log in to Discord with your client's token
client.login(process.env.TOKEN);
