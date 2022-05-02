const path = require('path');

const { NoSwearing } = require('noswearing');
const { detectAll } = require('tinyld');
const profanityJson = JSON.parse(
  require('fs').readFileSync(
    path.resolve(__dirname, './profanity_words.json'),
    'utf8'
  )
);

function checker(text, language) {
  const noSwear = new NoSwearing(profanityJson[language]);
  const result = noSwear.check(text)[0];

  if (result !== undefined) {
    return {
      isBadWord: true,
      detectedWord: result.original,
      profanityWordRelated: result.word,
      badWordLanguage: language,
    };
  }

  return false;
}

exports.filter = function profanity(sentence) {
  sentence = sentence.toLowerCase();
  let language;
  let result;

  detectAll(sentence).forEach((possibility) => {
    language = possibility.lang; // Return the language as iso2 format

    if (profanityJson[language]) {
      // Check if there is a profanity word list for this language
      result = checker(sentence, language); // Check if there is a bad word by spelling
    }
  });

  // Guarantee it's not an english bad word
  return result === false || result === undefined
    ? checker(sentence, 'en')
    : result;
};

exports.whitelist = function whitelist(x, language) {
  // pass
};
exports.blacklist = function blacklist(x) {
  // pass
};
exports.blacklistUndo = function blacklistUndo() {
  // pass
};
exports.whitelistUndo = function whitelistUndo() {
  // pass
};
exports.blacklistRemove = function blacklistRemove(w) {
  // pass
};
exports.whitelistRemove = function whitelistRemove(w) {
  // pass
};
