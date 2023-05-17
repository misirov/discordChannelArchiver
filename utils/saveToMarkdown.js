/**
 * Save all messages to a markdown file.
 *
 * @param {Object} channel - The Discord channel object containing the channel's metadata.
 * @param {Array} listOfMessageObjects - An array of message objects containing user, content, date, and attachment properties.
**/

const fs = require('fs');
const path = require('path');

async function saveChannelToMarkdown(channel, listOfMessageObjects) {
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






async function saveThreadToMarkdown(channel, listOfMessageObjects) {
    return new Promise((resolve, reject) => {
        // Flatten the listOfMessageObjects one level to create a single list of message objects for easier processing and saving
        const x = listOfMessageObjects.flat().map(messageObject => {
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


        }).join('\n\n');

    })
}



module.exports = {
    saveChannelToMarkdown,
    saveThreadToMarkdown
}
