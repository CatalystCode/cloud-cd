"use strict";
var P = require('./promise');
var ssh2 = require('ssh2');
var PATH = require('path');
var fs = require("fs"); // Use node filesystem
function ssh_connect(client, options) {
    return new P(function (resolve, reject) {
        return client
            .once('ready', resolve)
            .once('error', reject)
            .connect(options);
    });
}

function ssh_exec(client, command, options) {
    return P.fromCallback(function (callback) {
            return client.exec(command, options, callback);
        })
        .then(function (stream) {
            return new P(function (resolve, reject) {
                console.log('ssh_exec: output');
                stream.on('data', function (data) {
                        return process.stdout.write(data.toString());
                    })
                    .on('error', reject)
                    .on('end', function () {
                        console.log('ssh_exec: Done');
                        resolve();
                    });
            });
        });
}

function ssh_upload(client, path, dest) {
    return P.fromCallback(function (callback) {
            return client.sftp(callback);
        })
        .then(function (sftp) {
            return new P(function (resolve, reject) {
                var readStream = fs.createReadStream(path);
                var writeStream = sftp.createWriteStream(dest);
                writeStream.on('close', function () {
                    console.log("- file transferred succesfully");
                    resolve();
                }).on('end', function () {
                    console.log("sftp connection closed");
                }).on('error', reject);
                // initiate transfer of file
                readStream.pipe(writeStream);
            });
        });
}

function execute(config, os_type) {
    var ssh_client = new ssh2.Client();
    var vm_ip = config.guest_ip;
    var vm_user = config.guest_user;
    var vm_password = config.guest_password;
    var scriptFileName = PATH.basename(config.script);
    var remote_path = 'C:\\Users\\SSHD\\AppData\\Local\\Temp\\' + scriptFileName;
    var script_runner = 'echo "\\n" | powershell -File ' + remote_path + ' ' + (config.args || '');
    var options = {};
    if (os_type === 'Linux') {
        remote_path = '/tmp/' + scriptFileName;
        script_runner = 'sudo bash ' + remote_path + ' ' + (config.args || '');
        options = {
            pty: true
        };
    }
    ssh_connect(ssh_client, {
            host: vm_ip,
            username: vm_user,
            password: vm_password
        })
        .then(function () {
            return ssh_upload(ssh_client, config.script, remote_path);
        })
        .then(function () {
            return ssh_exec(ssh_client, script_runner, options);
        })
        .then(function () {
            return ssh_client.end();
        })
        .then(function () {
            console.log('All done.');
        })
        .catch(function (err) {
            console.log('Error !', err.stack);
        });
}
module.exports = {
    execute: execute
};
//# sourceMappingURL=uploader.js.map