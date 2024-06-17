const TelegramBot = require('node-telegram-bot-api');
const token = '6990634330:AAEsfuDrFrTjCIlrM88P0CMiBGBwg3XkvkY'; // Replace with your bot's token
const bot = new TelegramBot(token, { polling: true });

const gameShortName = 't4213'; // Replace with your game's short name

// Handle the /start command
// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Guess the Number game! Click the button below to start playing.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Play Guess the Number', web_app: { url: 'https://limicgggamer.github.io/testgame.html' } }]
        ]
      }
    });
  });
  

// Handle the /game command
bot.onText(/\/game/, (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    console.log(`Received /game command from chat ${chatId}`);
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Play Game", callback_game: {} }]
            ]
        }
    };
    bot.sendGame(chatId, gameShortName, options)
        .then(() => {
            console.log(`Game sent to chat ${chatId}`);
        })
        .catch((error) => {
            console.error(`Failed to send game to chat ${chatId}:`, error);
            bot.sendMessage(chatId, "Failed to send game. Please try again later.");
        });
});
// Handle callback queries (when users press "Play Game" button)
bot.on('callback_query', (callbackQuery) => {
    console.log(callbackQuery);
    const callbackQueryId = callbackQuery.id;
    const chatId = callbackQuery.message.chat.id;
    console.log(`Received callback query ${callbackQueryId} from chat ${chatId}`);
    
    // Acknowledge the callback query
    bot.answerCallbackQuery(callbackQueryId)
        .then(() => {
            console.log(`Callback query ${callbackQueryId} acknowledged`);
            // You can also send a message or perform additional actions here
        })
        .catch((error) => {
            console.error(`Failed to acknowledge callback query ${callbackQueryId}:`, error);
        });
});

// Handle inline queries
bot.on('inline_query', (query) => {
    console.log(query);
    const results = [{
        type: 'game',
        id: query.id,
        game_short_name: gameShortName
    }];

    bot.answerInlineQuery(query.id, results).catch((error) => {
        console.log(error);
    });
});

// Set game score (example for demo purposes)
bot.on('message', (msg) => {
    console.log('Received message:', msg);
    if (msg.web_app_data) {
    // if (msg.text.startsWith('/setscore')) {
        // const params = msg.text.split(' ');
        const userId = msg.from.id;
        const score = parseInt(msg.web_app_data.data);

        bot.setGameScore(userId, score, {
            chat_id: msg.chat.id,
            message_id: msg.message_id
        }).then((response) => {
            bot.sendMessage(msg.chat.id, `Score set to ${score}`);
        }).catch((error) => {
            console.log(error);
        });
    }
});

console.log('Bot is running...');