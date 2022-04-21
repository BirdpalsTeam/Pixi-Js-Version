const path = require('path');

module.exports = {
  config: require(path.resolve(__dirname, './config')),
  server_utils: require(path.resolve(__dirname, './server-utils')),
  profanity: require(path.resolve(__dirname, './profanity_filter')),
  collisions: require(path.resolve(__dirname, './Collisions.min'))
}