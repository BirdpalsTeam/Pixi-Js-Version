PlayFab.settings.titleId = '238E6';
PlayFab._internalSettings.sessionTicket = sessionStorage.ticket;
document.getElementById('inputElements').hidden = false;
form = document.getElementById("form");
input = document.getElementById("input");

form.addEventListener('submit', function(e) {
	e.preventDefault();
		if (input.value) {	
			setLocalMessage(input.value);
			input.value = '';
		}
});

document.getElementById('bird_color').addEventListener("input", function(c){
	let color = c.target.value.replace('#',"0x");
	localPlayer.filters = [new BirdColorReplacement(color)];
	inventory.big_bird.updateColor();
}, false);

document.getElementById('inventory').onclick = function(){
	inventory = new Inventory();
	inventory.open();
}

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
//update(); easter egg