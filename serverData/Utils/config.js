const path = require('path')

/// /Socket.IO Server////
const { random } = require(path.resolve(__dirname, './random'))

function createIO(httpServer) {
  const io = require('socket.io')(httpServer, {
      cors: {
        origin: 'https://localhost:*',
        methods: ['GET', 'POST'],
      },
      pingInterval: 25000,
      pingTimeout: 60000,
    }),
    session = require('express-session')({
      secret: random(31),
      resave: true,
      saveUninitialized: true,
      cookie: { sameSite: true },
    }),
    sharedSession = require('express-socket.io-session')
  return { io, session, sharedSession }
}
/// ///////////////////

/// /Playfab////
const { PlayFab, PlayFabServer, PlayFabAdmin } = require('playfab-sdk')
const GAME_ID = '238E6'
PlayFab.settings.titleId = GAME_ID
PlayFab.settings.developerSecretKey =
  '1YP575JK5RZOJFRMMSAT5DWWOG9FI6967KNH3YCCIKFQT7SNK7'
/// ///////////

/// /Discord////
const discordBot = require('birdpals/discord')
const discordBotClient = discordBot.client
/// ////////////

module.exports = {
  createIO,

  PlayFab,
  PlayFabServer,
  PlayFabAdmin,

  discordBot,
  discordBotClient,
}
