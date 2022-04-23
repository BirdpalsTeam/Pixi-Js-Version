// Server
const path = require('path');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const app = express();
const http = require('http').Server(app);
const { createIO } = require('birdpals/utils').config;
const { io, session, sharedSession } = createIO(http);
const { serverSocket } = require('birdpals/game');

app.enable('trust proxy');

// Setups security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'"],
        'connect-src': ["'self'", '*.playfabapi.com'],
        'style-src': ["'self'", 'fonts.googleapis.com'],
      },
    },
  })
);

app.use(session);

// Use compression to reduce files size
app.use(
  compression({
    filter: function (req, res) {
      return true;
    },
  })
);

// Send the public files to the domain
app.get('/', (req, res) => {
  return res.sendFile(
    path.join(__dirname, 'public/index.html'),
    function (err) {
      if (err) {
        res.status(404);
        res.end();
      }
    }
  );
});

app.get('/*', (req, res, next) => {
  /* if(req.get('cf-ray') != undefined && req.headers['x-forwarded-proto'] == 'https'){
 }else{
 return res.status(404).send('Not found');
} uncomment at final build */

  const options = {
    root: path.resolve(__dirname, './public'),
  };
  const split = req.path.split('/');

  let player = null;
  try {
    try {
      player = io.sockets.sockets[req.headers.cookie.split('io=')[1]]; // Get socket player
    } catch (error) {
      console.log(`Error getting player at express: ${error}`);
    }

    function sendFile() {
      return res.sendFile(decodeURI(req.path), options, function (err) {
        if (err) {
          res.sendStatus(404);
          res.end();
          console.error(err);
        }
      });
    }

    function sendFileModDev(fileForMod = false, fileForDev = false) {
      if (player !== null && player.handshake.address === req.ip) {
        // Guarantee that the connection is secure
        if (
          (fileForMod && player.isMod === true) ||
          (fileForMod && player.isDev === true)
        ) {
          sendFile();
        } else if (fileForDev && player.isDev === true) {
          sendFile();
        } else {
          res.sendStatus(404);
          res.end();
        }
      }
    }

    switch (split[1]) {
      case 'Moderation':
        sendFileModDev(true);
        break;

      case 'Devs':
        sendFileModDev(false, true);
        break;

      default:
        sendFile();
    }
  } catch (error) {
    console.log(`Error sending files to client: ${error}`);
    res.sendStatus(404);
    res.end();
  }
});

// Handle errors with express
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.sendStatus(500);
  }
  next();
});

// Websockets communication
serverSocket.connect(io, sharedSession(session));

// Start the server on port 3000
http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
