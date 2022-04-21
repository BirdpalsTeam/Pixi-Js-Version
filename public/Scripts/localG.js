PlayFab.settings.titleId = '238E6';
PlayFab._internalSettings.sessionTicket = sessionStorage.ticket;
document.getElementById('inputElements').hidden = false;
form = document.getElementById('form');
input = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  sendMessage();
});
/* Not Working
document.getElementById('SendButton').onclick = function () {
  sendMessage();
};
*/
function sendMessage() {
  if (input.value) {
    setLocalMessage(input.value);
    addToChatbox(`${localPlayer.username}: ${input.value}`);
    input.value = '';
  }
}

/*
document.getElementById('bird_color').addEventListener("input", function(c){
	let color = c.target.value.replace('#',"0x");
	localPlayer.filters = [new BirdColorReplacement(color)];
	inventory.big_bird.updateColor();
}, false);
*/

inventory = new Inventory();
document.getElementById('inventory').onclick = function () {
  inventory.open();
};

function addToChatbox(chatboxtext) {
  const p = document.createElement('p'); // Creates a <p> tag
  p.textContent += chatboxtext;
  chatbox.appendChild(p);
  chatbox.scrollTop = chatbox.scrollHeight;
}

const emitter = new SnowParticle();
let elapsed = Date.now();
var update = function () {
  // Update the next frame
  requestAnimationFrame(update);

  const now = Date.now();

  // The emitter requires the elapsed seconds
  emitter.update((now - elapsed) * 0.001);
  elapsed = now;
};
// if(app.ticker.FPS >= 25) update();

// Settings
const settingsDiv = document.getElementById('SettingsDiv');
function toggleSettings() {
  settingsDiv.hidden = !settingsDiv.hidden;
}
/*document.getElementById('SettingsButton').onclick = function () {
  toggleSettings();
};*/

const uncheckedImg = new Image();
uncheckedImg.src = 'Sprites/hud/unchecked.png';
const checkedImg = new Image();
checkedImg.src = 'Sprites/hud/checked.png';

function toggleCheckbox(box) {
  console.log(box);
  return box.src;
}

function toggleChatbox() {
  if (chatbox.hidden == true) {
    chatbox.hidden = false;
    isChatBoxToggle = false;
  } else {
    chatbox.hidden = true;
    isChatBoxToggle = true;
  }
}

/*Not Working
chatBoxCheck = document.getElementById('ChatBoxCheck');
chatBoxCheck.onclick = function () {
  toggleChatbox();
  chatBoxCheck.src = toggleCheckbox(chatBoxCheck);
};
*/
chatbox.hidden = false;
