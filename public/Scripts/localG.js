PlayFab.settings.titleId = '238E6';
PlayFab._internalSettings.sessionTicket = sessionStorage.ticket;
document.getElementById('inputElements').hidden = false;
form = document.getElementById("form");
input = document.getElementById("input");

form.addEventListener('submit', function(e) {
	e.preventDefault();
		if (input.value) {	
			setLocalMessage(input.value);
			addToChatbox(`${localPlayer.username}: ${input.value}`);
			input.value = '';
		}
});

document.getElementById('bird_color').addEventListener("input", function(c){
	let color = c.target.value.replace('#',"0x");
	localPlayer.filters = [new BirdColorReplacement(color)];
	inventory.big_bird.updateColor();
}, false);

inventory = new Inventory();
document.getElementById('inventory').onclick = function(){
	inventory.open();
}

function addToChatbox(chatboxtext){
	let p = document.createElement('p'); //Creates a <p> tag
	p.textContent += chatboxtext;
	chatbox.appendChild(p);
	chatbox.scrollTop = chatbox.scrollHeight;
}

function toggleChatbox(){
	if(chatbox.hidden == true){
		chatbox.hidden = false;
		isChatBoxToggle = false;
	}
	else{
		chatbox.hidden = true;
		isChatBoxToggle = true;
	}
}

document.getElementById('toggleChatbox').onclick = function(){toggleChatbox();};

var emitter = new SnowParticle();
var elapsed = Date.now();
var update = function(){
  
	// Update the next frame
	requestAnimationFrame(update);
	
	var now = Date.now();
	
	// The emitter requires the elapsed seconds
	emitter.update((now - elapsed) * 0.001);
	elapsed = now;
  
};
//if(app.ticker.FPS >= 25) update();