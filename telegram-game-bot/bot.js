const { Telegraf } = require('telegraf');
const crypto = require('crypto');
const bot = new Telegraf('6990634330:AAEsfuDrFrTjCIlrM88P0CMiBGBwg3XkvkY');

bot.start((ctx) => {
    const user = ctx.from;
    const sessionId = crypto.randomBytes(16).toString('hex');
    sessions[sessionId] = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username
    };
    const timestamp = Date.now(); // Use timestamp as a cache buster
    const gameUrl = `https://limicgggamer.github.io/testgame.html?sessionId=${sessionId}&v=${timestamp}`;
    
    ctx.reply('Welcome! Click "Start Game" to begin playing.', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Start Game', web_app: { url: gameUrl } }
                ]
            ]
        }
    });
});

bot.launch();