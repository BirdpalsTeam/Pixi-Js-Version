// Profanity and etc
const fs = require('fs');
const { profanity, server_utils } = require('birdpals/utils');
const server_discord = require('birdpals/discord');
const AFKTime = 300000; // 5 minutes
const { Polygon } = require('birdpals/utils').collisions;
const decomp = require('poly-decomp');
const {
  PlayFabServer,
  PlayFabAdmin,

  discordBot,
  discordBotClient,
} = require('birdpals/utils').config;
// Scripts
const { Player } = require('./Player');
const movement_messages = require('./movement_messages');
const login = require('./login');
const update_inventory = require('./update_inventory');
const change_bio = require('./change_bio');
const give_item = require('./give_item.js');
const moderation_commands = require('./moderation_commands');
const add_friend = require('./add_friend');
// DDoS prevention
const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({ points: 6, duration: 1 });

exports.connect = (io, session) => {
  const roomsJson = fs.readFileSync('./serverData/Utils/roomsJSON.json');
  const rooms = JSON.parse(roomsJson, server_utils.reviver);
  for (const roomInJson in rooms) {
    const room = rooms[roomInJson];
    const convexPolygons = decomp.quickDecomp(room.colliders);
    room.collision = [];
    convexPolygons.forEach((polygon) => {
      room.collision.push(new Polygon(0, 0, polygon));
    });
  }
  const players = new Map();
  const devTeamJson = fs.readFileSync('./serverData/Utils/devTeam.json');
  const devTeam = JSON.parse(devTeamJson);
  const modTeamJson = fs.readFileSync('./serverData/Utils/modTeam.json');
  const modTeam = JSON.parse(modTeamJson);
  const IPBanned = [];
  server_utils
    .getPlayersInSegment('1B7192766262CE36')
    .then((response) => {
      // push the ip of the banned players to the IPBanned array, please don't log them.
      const bannedList = response.data.PlayerProfiles;
      if (bannedList.length > 0) {
        bannedList.forEach((player) => {
          PlayFabServer.GetUserBans(
            { PlayFabId: player.PlayerId },
            (error, result) => {
              if (result !== null) {
                result.data.BanData.forEach((ban) => {
                  if (ban.Active === true && ban.IPAddress !== undefined) {
                    IPBanned.push(ban.IPAddress);
                  }
                });
              } else if (error !== null) {
                console.log(error);
              }
            }
          );
        });
      }
    })
    .catch(console.log);

  const modDir = fs.readdirSync(`${__dirname}/../../public/Moderation`);
  const modScripts = new Array();
  modDir.filter((fileName) => {
    if (fileName.includes('.js')) {
      modScripts.push(`Moderation/${fileName}`);
    }
  });

  const devDir = fs.readdirSync(`${__dirname}/../../public/Devs`);
  const devScripts = new Array();
  devDir.filter((fileName) => {
    if (fileName.includes('.js')) {
      devScripts.push(`Devs/${fileName}`);
    }
  });

  io.use(session);

  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    /* if(socket.handshake.headers['cf-ray'] == undefined || socket.handshake.headers['cf-connecting-ip'] == undefined ){
		socket.disconnect(true);
	}else{
		socket.ip = socket.handshake.headers['cf-connecting-ip'];
	}uncomment at final build */

    socket.use((packet, next) => {
      const eventName = packet[0];

      if (eventName !== 'playerMovement' || eventName !== 'disconnect') {
        rateLimiter
          .consume(socket.id)
          .then(() => {
            next();
          })
          .catch((error) => {
            console.error(`rateLimiter error with ${socket.id}: ${error}`);
            next(new Error('Request limit exceeded.'));
          });
      }
    });
    socket.on('disconnect', function () {
      console.log('A user disconnected: ' + socket.id);
      if (players.size > 0) {
        const disconnectedPlayer = players.get(socket.playerId);
        const thisPlayerRoom = rooms[socket.gameRoom];
        if (disconnectedPlayer === false || thisPlayerRoom.players === false)
          return;
        const thisPlayer = thisPlayerRoom.players.get(disconnectedPlayer.id);
        if (thisPlayer.isMoving === true) {
          clearInterval(thisPlayer.movePlayerInterval);
          thisPlayer.isMoving = false;
        }
        socket.broadcast
          .to(socket.gameRoom)
          .emit('byePlayer', disconnectedPlayer);
        players.delete(disconnectedPlayer.id);
        thisPlayerRoom.players.delete(thisPlayer.id);
      }
    });

    socket.on('Im Ready', () => {
      if (socket.playerId === undefined) return;
      const thisPlayerRoom = rooms[socket.gameRoom];
      // socket.io can't send running functions, so you need to pause the players movement
      const preventRecursion = thisPlayerRoom.players;
      preventRecursion.forEach((player) => {
        if (player.isMoving === true) {
          clearInterval(player.movePlayerInterval);
          player.isMoving = false;
        }
      });
      socket.emit('loggedIn', preventRecursion); // there is a problem here
      socket.isAFK = setTimeout(() => {
        // AFK cronometer
        socket.disconnect(true);
      }, AFKTime);

      if (socket.isMod !== undefined || socket.isDev !== undefined) {
        socket.emit('M', modScripts); // Send scripts to mods
      }
      if (socket.isDev !== undefined) {
        socket.emit('M', devScripts);
      }
    });

    login.run(
      io,
      socket,
      players,
      Player,
      rooms,
      devTeam,
      modTeam,
      IPBanned,
      PlayFabServer,
      PlayFabAdmin,
      profanity,
      server_utils,
      rateLimiter
    );

    movement_messages.run(
      socket,
      rooms,
      AFKTime,
      discordBotClient,
      server_discord,
      server_utils,
      profanity,
      rateLimiter
    ); // Rooms command is here

    update_inventory.run(
      socket,
      rooms,
      AFKTime,
      PlayFabAdmin,
      PlayFabServer,
      server_utils,
      rateLimiter
    );

    change_bio.run(
      socket,
      rooms,
      AFKTime,
      PlayFabAdmin,
      profanity,
      server_utils,
      rateLimiter
    );

    give_item.run(socket, AFKTime, PlayFabServer, server_utils, rateLimiter);

    moderation_commands.run(
      io,
      socket,
      server_utils,
      AFKTime,
      rooms,
      devTeam,
      IPBanned,
      PlayFabServer,
      discordBotClient,
      server_discord
    );

    add_friend.run(socket, AFKTime, PlayFabServer, server_utils, rateLimiter);
  }); // io connection end

  // Discord
  discordBot.startBot(PlayFabServer, IPBanned, io);
};
