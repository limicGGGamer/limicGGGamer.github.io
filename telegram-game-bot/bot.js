const TelegramBot = require('node-telegram-bot-api');
const token = '6990634330:AAEsfuDrFrTjCIlrM88P0CMiBGBwg3XkvkY'; // Replace with your bot's token
const bot = new TelegramBot(token, { polling: true });

const gameShortName = 'tggametesting'; // Replace with your game's short name

// Handle the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to the game! Type /game to play.");
});

// Handle the /game command
bot.onText(/\/game/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendGame(chatId, gameShortName);
});

// Handle callback queries (when users press "Play" button)
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const gameUrl = `https://limicgggamer.github.io/testgame.html`; // Replace with your game's URL

    bot.answerCallbackQuery(callbackQuery.id, {
        url: gameUrl
    });
});

// Handle setting the game score
bot.on('inline_query', (query) => {
    const results = [{
        type: 'game',
        id: query.id,
        game_short_name: gameShortName
    }];

    bot.answerInlineQuery(query.id, results);
});

// Set game score (example for demo purposes)
bot.on('message', (msg) => {
    if (msg.text.startsWith('/setscore')) {
        const params = msg.text.split(' ');
        const userId = msg.from.id;
        const score = parseInt(params[1]);

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
