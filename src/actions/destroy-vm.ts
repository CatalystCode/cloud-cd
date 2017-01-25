var pkgcloud = require('pkgcloud');

export interface DestroyVMActionOptions {
  /** should destroy dependencies */
  destroyDependencies: boolean;
  /** should destroy storage account */
  destroyStorage: boolean;
}

export class DestroyVMAction {

  private client: any;

  constructor(clientOptions: any) {
    this.client = pkgcloud.compute.createClient(clientOptions);
  }

  perform(server:any, options: DestroyVMActionOptions, callback: (Error, Object) => void): void {
    this.validateOptions(server, options);

    this.client.destroyServer(server, options, callback);
  }

  validateOptions(server: any, options: DestroyVMActionOptions) {
    if (!server) {
      throw new Error('No server wes sent to destroy');
    }
  }
}