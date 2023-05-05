/**
 * Save all messages to a markdown file.
 *
 * @param {Object} channel - The Discord channel object containing the channel's metadata.
 * @param {Array} listOfMessageObjects - An array of message objects containing user, content, date, and attachment properties.
**/

const { CommandInteractionOptionResolver } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function saveToMarkdown(channel, listOfMessageObjects) {

    return new Promise((resolve, reject) => {

        const md = listOfMessageObjects.map(messageObject => {

            const attachmentsInfo = messageObject.Attachment.map(attachment => {
                return `Attachment:
                - attachment: ${attachment.attachment}
                - name: ${attachment.name}
                - id: ${attachment.id}
                - url: ${attachment.url}
                - proxyURL: ${attachment.proxyURL}
                - contentType: ${attachment.contentType}
                - description: ${attachment.description}
                - ephemeral: ${attachment.ephemeral}`;
            }).join('\n');

            return `Date: ${messageObject.Date} **Username: ${messageObject.User}:** Content: ${messageObject.Content}\n${attachmentsInfo}`;

        }).join('\n\n');

        const outputDir = 'output';
        const fileName = `${channel.name}_channel.md`;
        const filePath = path.join(outputDir, fileName);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        fs.writeFile(filePath, md, err => {
            console.log('\nsaving as markdown...')
            if (err) {
                reject(err);
            }
            process.stdout.write(`\nFinished writing to file: ${filePath}. \nEnter another channel ID or type 'push' > `);
            resolve();
        });

    })
}




async function saveThreadToMarkdown(channel, thread, listOfMessageObjects) {

    return new Promise((resolve, reject) => {


        const md = listOfMessageObjects.flat().map(messageObject => {
            // Process the message object and generate the desired output format
            const messageText = `Date: ${messageObject.Date}\nThread Name: ${messageObject.ThreadName}\nUsername: **${messageObject.User}:** \nContent: ${messageObject.Content}`;

            let attachmentsInfo = '';

            if (messageObject.Attachment && messageObject.Attachment.size > 0) {
                attachmentsInfo = messageObject.Attachment.map(attachment => {
                    return `Attachment:
                        - attachment: ${attachment.attachment}
                        - name: ${attachment.name}
                        - id: ${attachment.id}
                        - url: ${attachment.url}
                        - proxyURL: ${attachment.proxyURL}
                        - contentType: ${attachment.contentType}
                        - description: ${attachment.description}
                        - ephemeral: ${attachment.ephemeral}`;
                }).join('\n');
            }

            console.log(`${messageText}\n${attachmentsInfo}`);

            var md = `${messageText}\n${attachmentsInfo}`;


            const outputDir = `output/${channel.name}_${messageObject.ThreadName}_thread`;
            const fileName = `${messageObject.ThreadName}_thread.md`;
            const filePath = path.join(outputDir, fileName);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }

            fs.writeFile(filePath, md, err => {
                console.log('\nsaving as markdown...')
                if (err) {
                    reject(err);
                }
                process.stdout.write(`\nFinished writing to file: ${filePath}. \nEnter another channel ID or type 'push' > `);
                resolve();
            });



            // return `${messageText}\n${attachmentsInfo}`;



        }).join('\n\n');






        // @TODO CLEAN UP, THIS CODE CAN BE CHANED

        // const md = listOfMessageObjects.flat().map(messageObject => {
        //     // Process the message object and generate the desired output format
        //     const messageText = `Date: ${messageObject.Date}\nThread Name: ${messageObject.ThreadName}\nUsername: **${messageObject.User}:** \nContent: ${messageObject.Content}`;

        //     let attachmentsInfo = '';

        //     if (messageObject.Attachment && messageObject.Attachment.size > 0) {
        //         attachmentsInfo = messageObject.Attachment.map(attachment => {
        //             return `Attachment:
        //             - attachment: ${attachment.attachment}
        //             - name: ${attachment.name}
        //             - id: ${attachment.id}
        //             - url: ${attachment.url}
        //             - proxyURL: ${attachment.proxyURL}
        //             - contentType: ${attachment.contentType}
        //             - description: ${attachment.description}
        //             - ephemeral: ${attachment.ephemeral}`;
        //         }).join('\n');
        //     }

        //     return `${messageText}\n${attachmentsInfo}`;

        // }).join('\n\n');



        // const outputDir = `output/${channel.name}_threads`;
        // const fileName = `${channel.name}_${thread.name}_thread.md`;
        // const filePath = path.join(outputDir, fileName);

        // if (!fs.existsSync(outputDir)) {
        //     fs.mkdirSync(outputDir);
        // }

        // fs.writeFile(filePath, md, err => {
        //     console.log('\nsaving as markdown...')
        //     if (err) {
        //         reject(err);
        //     }
        //     process.stdout.write(`\nFinished writing to file: ${filePath}. \nEnter another channel ID or type 'push' > `);
        //     resolve();
        // });

    })
}

module.exports = {
    saveToMarkdown,
    saveThreadToMarkdown
}



