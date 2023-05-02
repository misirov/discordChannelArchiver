/**
 * Save all messages to a markdown file
 */

const fs = require('fs');
const path = require('path');

module.exports = function saveToMarkdown(channel, listOfMessageObjects) {
    const md = listOfMessageObjects.map(
        messageObject =>
            `${messageObject.Date} **${messageObject.User}:** ${messageObject.Content}`
    ).join('\n\n');

    const outputDir = 'output';
    const fileName = `${channel.name}_channel.md`;
    const filePath = path.join(outputDir, fileName);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    fs.writeFile(filePath, md, err => {
        if (err) {
            throw err;
        }
        console.log(`Finished writing to file: ${filePath}. \n---> Exit with CTRL+C`);
    });
}