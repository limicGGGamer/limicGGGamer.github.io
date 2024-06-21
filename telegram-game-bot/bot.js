
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Added CORS support

const token = '6990634330:AAGofMDtUGcs5ByyHIYAMEHHyJt_8VqeL_A'; // Replace with your bot's token
const WEB_APP_URL = "https://staging.d3da4kmprr3s09.amplifyapp.com/";
// const WEB_APP_URL = "https://elfintontest.gggamer.org";
const game_photo_url = 'http://ec2-54-254-221-210.ap-southeast-1.compute.amazonaws.com/public/tg_game.png'; // Ensure this is correct

const bot = new TelegramBot(token, {
    polling: {
      interval: 1000,
      autoStart: true,
      params: {
        timeout: 10
      }
    }
  });

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// const short_name = 'tggametest';

let groupChatId = null;
// let groupChatId = "-4236530154"; // Variable to store the group chat ID
let leaderboard = []; // Array to store the leaderboard

// Serve the web app from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'testgame.html'));
});



// Command to store the group chat ID
bot.onText(/\/setgroup/, (msg) => {
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        groupChatId = msg.chat.id;
        console.log(`groupChatId: ${groupChatId}`);
        bot.sendMessage(groupChatId, 'Group chat ID has been set.');
    } else {
        bot.sendMessage(msg.chat.id, 'This command can only be used in a group chat.');
    }
});

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

// Command to send a game message
bot.onText(/\/game/, (msg) => {
    const chatId = msg.chat.id;
    
    if (msg.chat.type === 'private') {
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Play Game', web_app: { url: WEB_APP_URL }}]
                ]
            }
        };
        bot.sendPhoto(chatId, game_photo_url, { caption: "Play the game!", reply_markup: options.reply_markup })
            .catch(error => {
                console.error('Error sending game photo:', error);
            });
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
            leaderboardMessage += `${index + 1}. ${entry.username}: ${entry.score}, userId: ${entry.userId}\n`;
        });
        bot.sendMessage(chatId, leaderboardMessage);
    }
});

// Endpoint to receive score submissions
app.post('/submit-score', (req, res) => {
    const { userId, username, score } = req.body;

    console.log("Received data: ", req.body);
    const userIdStr = userId.toString();

    // Update the leaderboard
    const existingUser = leaderboard.find(entry => entry.userId === userId);
    if (existingUser) {
        if (score > existingUser.score) {
            existingUser.score = score; // Update the score if the new score is higher
            console.log(`Updated score for ${username} to ${score}`);
        } else {
            console.log(`Score for ${username} is not updated as the new score ${score} is lower than the existing score ${existingUser.score}`);
        }
    } else {
        leaderboard.push({ userId: userIdStr, username, score });
        console.log(`Added new score for ${username}: ${score}`);
    }

    // Forward score to the stored group chat ID
    if (groupChatId) {
        bot.sendMessage(groupChatId, `User ${username} achieved a score of ${score}.`);
    }
    //  else {
    //     res.status(400).json({ error: 'Group chat ID is not set. Use /setgroup command in the group chat to set it.' });
    //     return;
    // }

    res.json({ status: 'success' });
});

// Endpoint to get the highest score for a specific user
app.get('/highest-score', (req, res) => {
    const userId = req.query.userId;
    console.log("userId: ", userId);

    if (!userId) {
        return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    const userIdStr = userId.toString();
    const user = leaderboard.find(entry => entry.userId === userIdStr);
    console.log("user: ", user);

    if (user) {
        res.json({
            status: 'success',
            user: user.username,
            score: user.score
        });
    } else {
        res.json({
            status: 'success',
            user: 'No user',
            score: 0
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code} - ${error.response ? error.response.body.description : ''}`);
});

console.log('Bot is running...');