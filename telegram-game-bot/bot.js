
const TelegramBot = require('node-telegram-bot-api');
const token = '6990634330:AAEsfuDrFrTjCIlrM88P0CMiBGBwg3XkvkY'; // Replace with your bot's token
const WEB_APP_URL = "https://limicgggamer.github.io/telegram-game-bot/public/testgame.html";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Added CORS support

const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// const short_name = 'tggametest';

let groupChatId = null; // Variable to store the group chat ID
let leaderboard = []; // Array to store the leaderboard

// Serve the web app from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'testgame.html'));
});



// Command to store the group chat ID
bot.onText(/\/setgroup/, (msg) => {
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        groupChatId = msg.chat.id;
        bot.sendMessage(groupChatId, 'Group chat ID has been set.');
    } else {
        bot.sendMessage(msg.chat.id, 'This command can only be used in a group chat.');
    }
});

// // Bot command to start the game with a keyboard button in a private chat
// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;

//     if (msg.chat.type === 'private') {
//         const options = {
//             reply_markup: {
//                 keyboard: [
//                     [
//                         {
//                             text: "Play Game",
//                             web_app: { url: WEB_APP_URL }
//                         }
//                     ]
//                 ],
//                 resize_keyboard: true,
//                 one_time_keyboard: true
//             }
//         };

//         bot.sendMessage(chatId, "Click the button below to play the game:", options);
//     } else {
//         bot.sendMessage(chatId, "Please start the game in a private chat.");
//     }
// });

// Bot command to start the game with an inline keyboard button in a private chat
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    if (msg.chat.type === 'private') {
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Play Game",
                            web_app: { url: WEB_APP_URL }
                        }
                    ]
                ]
            }
        };

        bot.sendMessage(chatId, "Click the button below to play the game:", options);
    } else {
        bot.sendMessage(chatId, "Please start the game in a private chat.");
    }
});

// Command to show the leaderboard
bot.onText(/\/leaderboard/, (msg) => {
    const chatId = msg.chat.id;

    if (leaderboard.length === 0) {
        bot.sendMessage(chatId, 'No scores have been recorded yet.');
    } else {
        let leaderboardMessage = 'Leaderboard:\n\n';
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.forEach((entry, index) => {
            leaderboardMessage += `${index + 1}. ${entry.username}: ${entry.score}\n`;
        });
        bot.sendMessage(chatId, leaderboardMessage);
    }
});

// // Handle incoming data from the web app
// bot.on('message', (msg) => {
//     if (msg.web_app_data) {
//         const data = JSON.parse(msg.web_app_data.data);
//         const chatId = msg.chat.id;
//         const userId = msg.from.id;
//         const username = msg.from.username || msg.from.first_name; // Use username or first name

//         console.log("Received data: ", data);
//         console.log("User ID: ", userId);
//         console.log("Chat ID: ", chatId);
//         console.log("Message ID: ", msg.message_id);

//         bot.sendMessage(chatId, `Received score: ${data.score}`);

//         const score = data.score;

//         // Update the leaderboard
//         const existingUser = leaderboard.find(entry => entry.userId === userId);
//         if (existingUser) {
//             existingUser.score = score; // Update the score if the user already exists
//         } else {
//             leaderboard.push({ userId, username, score });
//         }

//         // Forward score to the stored group chat ID
//         if (groupChatId) {
//             bot.sendMessage(groupChatId, `User ${username} achieved a score of ${score}.`);
//         } else {
//             bot.sendMessage(chatId, 'Group chat ID is not set. Use /setgroup command in the group chat to set it.');
//         }
//     }
// });

// Endpoint to receive score submissions
app.post('/submit-score', (req, res) => {
    const { userId, username, score } = req.body;

    console.log("Received data: ", req.body);

    // Update the leaderboard
    const existingUser = leaderboard.find(entry => entry.userId === userId);
    if (existingUser) {
        existingUser.score = score; // Update the score if the user already exists
    } else {
        leaderboard.push({ userId, username, score });
    }

    // Forward score to the stored group chat ID
    if (groupChatId) {
        bot.sendMessage(groupChatId, `User ${username} achieved a score of ${score}.`);
    } else {
        res.status(400).json({ error: 'Group chat ID is not set. Use /setgroup command in the group chat to set it.' });
        return;
    }

    res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log('Bot is running...');