"use strict";

var P = require('./promise');
var ssh2 = require('ssh2');
var PATH = require('path');
var fs = require("fs"); // Use node filesystem

function ssh_connect(client, options) {
    return new P((resolve, reject) => client
        .once('ready', resolve)
        .once('error', reject)
        .connect(options));
}

function ssh_exec(client, command, options) {
    return P.fromCallback(callback => client.exec(command, options, callback))
        .then(stream => new P((resolve, reject) => {
            console.log('ssh_exec: output');
            stream.on('data', data => process.stdout.write(data.toString()))
                .on('error', reject)
                .on('end', () => {
                    console.log('ssh_exec: Done');
                    resolve();
                });
        }));
}

function ssh_upload(client, path, dest) {
    return P.fromCallback(callback => client.sftp(callback))
        .then(sftp => new P((resolve, reject) => {
            var readStream = fs.createReadStream(path);
            var writeStream = sftp.createWriteStream(dest);
            writeStream.on('close', function() {
                console.log("- file transferred succesfully");
                resolve();
            }).on('end', function() {
                console.log("sftp connection closed");
            }).on('error', reject);
            // initiate transfer of file
            readStream.pipe(writeStream);
        }));
}

function execute(config, callback) {
    var ssh_client = new ssh2.Client();
    var vm_ip = config.guest_ip;
    var vm_user = config.guest_user;
    var vm_password = config.guest_password;

    ssh_connect(ssh_client, {
            host: vm_ip,
            username: vm_user,
            password: vm_password
        })
        .then(() => {
            //ssh_upload(ssh_client, PATH.join(__dirname, 'deploy_base.sh'), '/tmp/deploy_base.sh')
            ssh_upload(ssh_client, PATH.join(__dirname, 'deploy_base.sh'), '/tmp/deploy_base.out')
        })
        .then(() => ssh_exec(ssh_client,
            'curl -u tamireran:0436dd1acfaf9cd247b3dd22a37f561f -L http://146.148.16.59:8080/job/mdserver/lastSuccessfulBuild//artifact/*zip*/archive.zip >/tmp/noobaa-NVA-latest.zip;' +
            'sudo yum install unzip;' +
            'fname=$(sudo unzip -o /tmp/noobaa-NVA-latest.zip -d  /tmp/|grep "tar.gz"|awk \'{ print $2 }\');' +
            'cp $fname /tmp/noobaa-NVA.tar.gz', {
                pty: true
            }))
        .then(() => ssh_exec(ssh_client,
            'sudo bash -x /tmp/deploy_base.sh runinstall', {
                pty: true
            }))
        .then(() => ssh_client.end())
        .then(() => {
            console.log('All done.');
            callback();
        })
        .catch(function(err) {
            console.log('Error !', err.stack);
            callback(err);
        });
}

module.exports = {
    execute
}