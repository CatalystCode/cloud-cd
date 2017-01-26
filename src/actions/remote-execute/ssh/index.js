
var ssh = require('./uploader');

execute = (config, callback) => {
  ssh.execute(config, callback);
}

check = (config, callback) => {
  return callback();
}

module.exports = {
  execute,
  check
}