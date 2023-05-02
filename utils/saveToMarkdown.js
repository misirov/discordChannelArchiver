/**
 * Save all messages to a markdown file.
 *
 * @param {Object} channel - The Discord channel object containing the channel's metadata.
 * @param {Array} listOfMessageObjects - An array of message objects containing user, content, date, and attachment properties.
**/


const fs = require('fs');
const path = require('path');

module.exports = function saveToMarkdown(channel, listOfMessageObjects) {

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

            return `${messageObject.Date} **${messageObject.User}:** ${messageObject.Content}\n${attachmentsInfo}`;
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
                throw err;
            }
            process.stdout.write(`Finished writing to file: ${filePath}. \n---> Exit with CTRL+C or enter another channel ID > `);
        });

    })
}
