function getElementFromArray(element, customIdentifier, array){
	let tempElement;
	array.forEach(arrayElement =>{
		if(arrayElement[customIdentifier] === element[customIdentifier]){
			tempElement = arrayElement;
		}
	})
	return tempElement != undefined ? tempElement : false;
}

function checkIfElementIsInArray(element, customIdentifier, array){
	return getElementFromArray(element, customIdentifier, array) ? true : false;
}

function getElementFromArrayByValue(value, customIdentifier, array){
	let tempElement;
	array.forEach(arrayElement =>{
		if(arrayElement[customIdentifier] == value){
			tempElement = arrayElement;
		}
	});
	return tempElement != undefined ? tempElement : false;
}

function removeElementFromArray(element, array){
	array.splice(array.indexOf(element), 1);
}

function separateStrings(string){
	if(string == undefined) return;
	let separated = string.split(" ");
	return separated;
}

let devCommands = [{command:'/ban', message:'Banning...'}, {command:'/unban', message: 'Unbanning...'}, {command: '/remove', message: 'Removing Player...'}];

function command(command, message){
	let isDevCommand = getElementFromArrayByValue(command, 'command', devCommands);
	if(localPlayer.isDev == true && isDevCommand != false){
		setLocalMessage(isDevCommand.message, true);	//Make the bird say words like Banning...
	}
	socket.emit(command, message);	//Send command to the server
}

function setLocalMessage(thisMessage, isDevCommand){
	let checkCommand = thisMessage.split(" ");
	if(checkCommand[0].includes("/") == true){	//Check if it's a command
		command(checkCommand[0], thisMessage);
	}else{
		localPlayer.message = thisMessage;
		if(localPlayer.messageTimeout != undefined){
			clearTimeout(localPlayer.messageTimeout);
			if(localPlayer.bubble.children[0] !== undefined) localPlayer.bubble.removeChildAt(0);
			localPlayer.drawBubble();
		}else if(localPlayer.messageTimeout == undefined){
			localPlayer.drawBubble();
		}
		if(isDevCommand == false || isDevCommand == undefined){	//Prevents from the moderators or devs saying, for example, Banning... for everyone
			socket.emit('message', thisMessage);
		}
	}
}