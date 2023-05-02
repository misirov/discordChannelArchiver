/**
 * Fetch all the messages inside a channel. 
 * Discord API has a limit of 100 request. Loop and save an index to keep fetching all messages.
 * @returns array of messages
**/

module.exports = async function fetchAllChannelMessages(channel) {
    const sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.messages.fetch(options);
        sum_messages.push(...Array.from(messages.values()));
        last_id = messages.last().id;

        if (messages.size != 100) {
            break;
        }
    }

    return sum_messages;
}


