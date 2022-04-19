var {NoSwearing} = require('noswearing');
const {detectAll} = require('tinyld');
var profanityJson = JSON.parse(require('fs').readFileSync(__dirname + "/profanity_words.json", "utf8"));

function checker(text, language){
	let noSwear = new NoSwearing(profanityJson[language]);
	let result = noSwear.check(text)[0];

	if(result !== undefined){
		return {
		  isBadWord: true,
		  detectedWord: result.original,
		  profanityWordRelated: result.word,
		  badWordLanguage: language
		}
	}
	
	return false;
}

exports.filter = function profanity(sentence){
	sentence = sentence.toLowerCase();
	let language;
	let result;

	detectAll(sentence).forEach( (possibility) => {
		language = possibility.lang;	//Return the language as iso2 format

		if(profanityJson.hasOwnProperty(language)){ //Check if there is a profanity word list for this language
			result = checker(sentence, language) //Check if there is a bad word by spelling
		}
	})

	//Guarantee it's not an english bad word
	return result == false || result == undefined ? checker(sentence, 'en') : result;
}

exports.whitelist = function whitelist(x, language){
	whitelisted.push(x)
	console.log('Whitelist added '+ x)
}
exports.blacklist = function blacklist(x){
	blacklisted.push(x)
	console.log('Blacklist added '+ x)
}
exports.blacklistUndo = function blacklistUndo(){
	console.log(blacklisted.slice(-1)[0]+' was removed from blacklist')
	blacklisted.pop();
	
}
exports.whitelistUndo = function whitelistUndo(){
	console.log(whitelisted.slice(-1)[0]+' was removed from blacklist')
	whitelisted.pop();
	
}
exports.blacklistRemove = function blacklistRemove(w){
	var w = w.toLowerCase();
	console.log(blacklisted.indexOf(w) + ': '+ w +' was removed from blacklist')
	blacklisted.splice(blacklisted.indexOf(w))
}
exports.whitelistRemove = function whitelistRemove(w){
	var w = w.toLowerCase();
	console.log(whitelisted.indexOf(w) + ': '+ w +' was removed from whitelist')
	whitelisted.splice(whitelisted.indexOf(w))
}