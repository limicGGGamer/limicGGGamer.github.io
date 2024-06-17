
const TelegramBot = require('node-telegram-bot-api');
const token = '6990634330:AAEsfuDrFrTjCIlrM88P0CMiBGBwg3XkvkY'; // Replace with your bot's token
const WEB_APP_URL = "https://limicgggamer.github.io/testgame.html";

const express = require('express');
const path = require('path');

const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const short_name = 'tggametest';

// Serve the web app from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'webapp.html'));
});

// Bot command to start the game
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const gameShortName = short_name; // Replace with your game short name

    bot.sendGame(chatId, gameShortName);
});

// Handling callback query when the game is launched
bot.on('callback_query', (query) => {
    const gameUrl = WEB_APP_URL; // Replace with your web app URL

    bot.answerCallbackQuery({
        callback_query_id: query.id,
        url: gameUrl
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//-----------------------------------------
// const { Telegraf, Markup } = require('telegraf');

// const bot = new Telegraf(token);

// // Handle the /start command
// bot.command('start', (ctx) => {
//     ctx.reply('Welcome! Click the button below to start playing.', Markup.keyboard([
//         [Markup.button.webApp('Open WebApp', WEB_APP_URL)]
//     ]).oneTime().resize()).catch((err) => console.error(err));
// });

// // Handle the /keyboard command
// bot.command('keyboard', (ctx) => {
//     ctx.reply('Launch mini app from keyboard!', Markup.keyboard([
//         [Markup.button.webApp('Launch', WEB_APP_URL)]
//     ]).resize()).catch((err) => console.error(err));
// });

// bot.launch().then(() => {
//     console.log('Bot is running...');
// }).catch((err) => {
//     console.error('Error launching bot:', err);
// });


// bot.on('message', (ctx) => {
//     const msg = ctx.message;
//     // console.log('Received message:', msg);
//     if (msg.web_app_data) {

//         try {
//             if (msg.web_app_data) {
//                 const receivedData = msg.web_app_data.data;
//                 console.log(`Received web app data: ${receivedData}`);
    
//             }
//         } catch (error) {
//             console.error('Error handling message:', error);
//         }
//     }
// });

console.log('Bot is running...');