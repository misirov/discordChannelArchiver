

const fetchAllChannelMessages = require('./fetchAllChannelMessages.js');
const { saveThreadToMarkdown } = require('./saveToMarkdown.js')


/**
 * 
 * Save Thread messages
 * @param {*} messages 
 * @param {*} channel 
 * @returns 
**/
async function getThreadMessages(channel, threads) {
    list_of_threadObjects = []
    for (const thread of threads.values()) {
        const threadMessages = await fetchAllChannelMessages(thread); // Fetch messages inside each thread
        const listOfThreadObject = threadMessages.map(message => {
            const date = new Date(message.createdTimestamp);
            const formattedDate = date.toLocaleDateString("en-US");
            let attachments = message.attachments; // Declare attachments with let

            return {
                ThreadName: thread.name,
                User: message.author.username,
                Content: message.content,
                Date: formattedDate,
                Attachment: attachments//attachmentsArray // Return attachmentList instead of attachments
            };

        })

        list_of_threadObjects.push(listOfThreadObject)

    }

    return list_of_threadObjects
}



/**
 * 
 * Save Channel's messages
 * @param {*} messages 
 * @param {*} channel 
 * @returns 
**/

async function getChannelMessages(messages, channel) {
    console.log(`\nFetched ${messages.length} messages from ${channel.name}`);
    console.log('\nCreating message object...')

    const listOfMessageObjects = messages.map(message => {
        const date = new Date(message.createdTimestamp);
        const formattedDate = date.toLocaleDateString("en-US");

        return {
            User: message.author.username,
            Content: message.content,
            Date: formattedDate,
            Attachment: message.attachments
        };
    });

    return listOfMessageObjects;
}


module.exports = {
    getThreadMessages,
    getChannelMessages
};
