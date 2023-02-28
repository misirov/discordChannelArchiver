# Discord channel archiver

This is a quick dirty hack to retrieve comments from a channel. Discord API limit is 100 so if you want to retrieve more than 100 comments, need to re-run it while specifying the range of messages to retrieve.

### Steps:

1. Create a *new application* in `https://discord.com/developers/applications`
2. Bot > Add bot
3. Copy the Token and mark all `Privileged Gateaway Intents`
- Making the bot public means that anyone with the link can add it to their server. For example, you make a bot and i can add it to my server. Otherwise only you can add it.
4. In OAut2 mark the following perms
- Scopes: `bot`
- Bot Permissions: `Read Messages/View Channels` and `Read Message History`
5. Copy the Generated URL and add the bot to the server.
- `https://discord.com/api/oauth2/authorize?client_id=<BOT_ID>&permissions=66560&scope=bot`
6. Git clone this repo and install these dependencies
- `discord.js`
- `dotenv`
7. Make a `.env` file and input the token 
8. With the bot inside the server, copy the channel ID and pass it as argument to the script
9. Run it. The script generates an HTML file
```javascript
w1zard@w1zard ~/discordArchiveBot (master)
└─ $ node main.js 1024716983767400548
```