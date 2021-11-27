//Server
var compression = require('compression');
var express = require('express');
var helmet = require('helmet');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http,{
	cors: {
		origin: "https://localhost:*",
		methods: ["GET", "POST"]
	  },
	  pingInterval: 25000,
	  pingTimeout: 60000
  });

const server_socket = require('./serverData/Game/server_socket');
//Playfab
var PlayFab = require("./node_modules/playfab-sdk/Scripts/PlayFab/PlayFab");

const { PlayFabServer, PlayFabAdmin } = require('playfab-sdk');
const GAME_ID = '238E6';
PlayFab.settings.titleId = GAME_ID;
PlayFab.settings.developerSecretKey = '1YP575JK5RZOJFRMMSAT5DWWOG9FI6967KNH3YCCIKFQT7SNK7';
//Discord
const discordBot = require('./serverData/Discord/server_discord');
app.enable('trust proxy');
//Setups security headers
app.use(helmet({contentSecurityPolicy:{
	useDefaults: true,
    directives: {
	  "script-src": ["'self'"],
      "connect-src": ["'self'", "*.playfabapi.com"],
	  "style-src": ["'self'", "fonts.googleapis.com"]
    },}
}));

app.use((req, res, next) => {
	//if(req.get('cf-ray') != undefined && req.headers['x-forwarded-proto'] == 'https'){
		res.setHeader(
			"Permissions-Policy",
			'fullscreen=(self), geolocation=(self), camera=(), microphone=(), payment=(), autoplay=(self), document-domain=()'
		);
		next();
	//}else{
	//	return	res.status(404).send('Not found');
	//} uncomment at final build
	
});

//Use compression to reduce files size
app.use(compression({filter: function (req, res) {
    return true;
}}));

//Send the public files to the domain
app.use(express.static('public', {dotfiles: 'allow'}));

//Websockets communication
server_socket.connect(io, PlayFabServer, PlayFabAdmin, discordBot.client);

//Start the server on port 3000
http.listen(process.env.PORT || 3000, () => {
	console.log('listening on *:3000');
});
//Discord
discordBot.startBot(PlayFabServer);