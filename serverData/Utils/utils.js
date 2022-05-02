const path = require('path');

module.exports = {
  config: require(path.resolve(__dirname, './config')),
  server_utils: require(path.resolve(__dirname, './server-utils')),
  collisions: require(path.resolve(__dirname, './Collisions.min'))
}