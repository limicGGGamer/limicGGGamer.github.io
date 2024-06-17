
// const TelegramBot = require('node-telegram-bot-api');
const token = '6990634330:AAEsfuDrFrTjCIlrM88P0CMiBGBwg3XkvkY'; // Replace with your bot's token
// const bot = new TelegramBot(token, { polling: true });
const { Telegraf, Markup } = require('telegraf');
const WEB_APP_URL = "https://limicgggamer.github.io/testgame.html";
const express = require('express');
const bodyParser = require('body-parser');

const bot = new Telegraf(token);

const gameShortName = 't4213'; // Replace with your game's short name

const app = express();
app.use(bodyParser.json());

// Handle the /start command
// Start command
// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'Welcome! Click the button below to open the web app.', {
//       reply_markup: {
//         inline_keyboard: [
//           [{ text: 'Open WebApp', web_app: { url: 'https://limicgggamer.github.io/testgame.html' } }]
//         ]
//       }
//     });
    
//   });


// Handle the /start command
bot.command('start', (ctx) => {
    ctx.reply('Welcome! Click the button below to start playing.', Markup.keyboard([
        [Markup.button.webApp('Open WebApp', WEB_APP_URL)]
    ]).oneTime().resize()).catch((err) => console.error(err));
});

// Handle the /keyboard command
bot.command('keyboard', (ctx) => {
    ctx.reply('Launch mini app from keyboard!', Markup.keyboard([
        [Markup.button.webApp('Launch', WEB_APP_URL)]
    ]).resize()).catch((err) => console.error(err));
});


// // Handle the /game command
// bot.onText(/\/game/, (msg) => {
//     console.log(msg);
//     const chatId = msg.chat.id;
//     console.log(`Received /game command from chat ${chatId}`);
//     const options = {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: "Play Game", callback_game: {} }]
//             ]
//         }
//     };
//     bot.sendGame(chatId, gameShortName, options)
//         .then(() => {
//             console.log(`Game sent to chat ${chatId}`);
//         })
//         .catch((error) => {
//             console.error(`Failed to send game to chat ${chatId}:`, error);
//             bot.sendMessage(chatId, "Failed to send game. Please try again later.");
//         });
// });
// // Handle callback queries (when users press "Play Game" button)
// bot.on('callback_query', (callbackQuery) => {
//     console.log(callbackQuery);
//     const callbackQueryId = callbackQuery.id;
//     const chatId = callbackQuery.message.chat.id;
//     console.log(`Received callback query ${callbackQueryId} from chat ${chatId}`);
    
//     // Acknowledge the callback query
//     bot.answerCallbackQuery(callbackQueryId)
//         .then(() => {
//             console.log(`Callback query ${callbackQueryId} acknowledged`);
//             // You can also send a message or perform additional actions here
//         })
//         .catch((error) => {
//             console.error(`Failed to acknowledge callback query ${callbackQueryId}:`, error);
//         });
// });

// Handle inline queries
// bot.on('inline_query', (query) => {
//     console.log(query);
//     const results = [{
//         type: 'game',
//         id: query.id,
//         game_short_name: gameShortName
//     }];

//     bot.answerInlineQuery(query.id, results).catch((error) => {
//         console.log(error);
//     });
// });

// Handle data sent from the web app
// app.post('/webhook', (req, res) => {
//     const { chatId, score } = req.body;
//     bot.telegram.sendMessage(chatId, `Received score: ${score}`).catch((err) => console.error(err));
//     res.sendStatus(200);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.launch().then(() => {
    console.log('Bot is running...');
}).catch((err) => {
    console.error('Error launching bot:', err);
});


const scores = {}; // In-memory storage for scores
// Set game score (example for demo purposes)
bot.on('message', (ctx) => {
    const msg = ctx.message;
    console.log('Received message:', msg);
    if (msg.web_app_data) {

        try {
            const msg = ctx.message;
            console.log('Received message:', msg);
            if (msg.web_app_data) {
                const receivedData = msg.web_app_data.data;
                console.log(`Received web app data: ${receivedData}`);
    
                // Save the score in memory
                const userId = msg.from.id;
                const score = parseInt(receivedData, 10);
                scores[userId] = score;
    
                // Respond back to the user
                ctx.reply(`You sent: ${receivedData}`).catch((err) => console.error(err));
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
        // bot.setGameScore(userId, score, {
        //     chat_id: msg.chat.id,
        //     message_id: msg.message_id
        // }).then((response) => {
        //     console.log('response; ',response);
        //     bot.sendMessage(msg.chat.id, `Score set to ${score}`);
        // }).catch((error) => {
        //     console.log(error);
        // });
    }
});

console.log('Bot is running...');