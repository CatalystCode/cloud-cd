var ssh = require('./uploader');
execute = function (config, callback) {
    ssh.execute(config, callback);
};
check = function (config, callback) {
    return callback();
};
module.exports = {
    execute: execute,
    check: check
};
//# sourceMappingURL=index.js.map