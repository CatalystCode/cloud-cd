import { spawn } from 'child_process';
import * as util from 'util';
import * as ssh from './ssh';
import { ExecuteRemotePowerShell } from './powershell';
import { GetVMAction } from '../get-vm';

export interface IRemoteExecuteConfig {
  hostname: string,
  username: string,
  password: string,
  platform: string
}

export interface IRemoteExecuteScriptConfig {
  script?: string,
  args?: string,
  scripts?: string[]
}

export class RemoteExecute {

  private getVMClient: GetVMAction;
  private win_client: ExecuteRemotePowerShell;

  constructor(clientOptions: any) {
    this.getVMClient = new GetVMAction(clientOptions)
  }

  perform(config: IRemoteExecuteConfig, scriptConfig: IRemoteExecuteScriptConfig, callback: (Error, Object?) => void): void {

    try {
      this.validateOptions(config, scriptConfig);

      this.getVMClient.perform(config as any, (error, server) => {

        if (error) {
          return callback(error);
        }
        var osType =
          server &&
          server.original &&
          server.original.storageProfile &&
          server.original.storageProfile.osDisk &&
          server.original.storageProfile.osDisk.osType || null;

        ssh.execute({
          guest_ip: server.hostname,
          guest_user: config.username,
          guest_password: config.password,
          script: scriptConfig.script,
          args: scriptConfig.args
        }, osType, callback);;
      });
    } catch (e) {
      return callback(e);
    }
  }

  validateOptions(config: IRemoteExecuteConfig, scriptConfig: IRemoteExecuteScriptConfig) {

    if (!scriptConfig.script) {
      throw new Error('No scripts were supplied in the configuration to execute');
    }

    return true;
  }
}