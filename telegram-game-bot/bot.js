const { Telegraf } = require('telegraf');
const bot = new Telegraf('6990634330:AAEsfuDrFrTjCIlrM88P0CMiBGBwg3XkvkY');

bot.start((ctx) => {
    const user = ctx.from;
    const gameUrl = `https://limicgggamer.github.io/testgame.html?userId=${user.id}&firstName=${user.first_name}&lastName=${user.last_name}&username=${user.username}`;
    
    ctx.reply('Welcome! Click "Start Game" to begin playing.', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Start Game', web_app: { url: gameUrl } }
                ]
            ]
        }
    });
    // ctx.reply('Welcome! Click "Start Game" to begin playing.', {
    //     reply_markup: {
    //         inline_keyboard: [
    //             [
    //                 { text: 'Start Game', web_app: { url: 'https://limicgggamer.github.io/testgame.html' } }
    //             ]
    //         ]
    //     }
    // });
});

bot.launch();