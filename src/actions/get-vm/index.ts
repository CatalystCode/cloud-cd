var pkgcloud = require('pkgcloud');

export interface GetVMActionOptions {
  /** vm name */
  name: string;
  /** User name to login to machine */
  username: string;
  /** Password to login to machine */
  password: string;
  /** VM size */
  flavor: string;
}

export class GetVMAction {

  private client: any;

  constructor(clientOptions: any) {
    this.client = pkgcloud.compute.createClient(clientOptions);
  }

  perform(options: GetVMActionOptions, callback: (Error, Object) => void): void {
    this.validateOptions(options);

    this.client.getServer(options.name, callback);
  }

  validateOptions(options: GetVMActionOptions) {
    if (!options) {
      throw new Error('No options were sent');
    }

    if (!options.name) {
      throw new Error('No name options was sent');
    }
  }
}