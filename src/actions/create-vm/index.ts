var pkgcloud = require('pkgcloud-with-arm');

export interface CreateVMActionOptions {
  /** vm name */
  name: string;
  /** User name to login to machine */
  username: string;
  /** Password to login to machine */
  password: string;
  /** VM size */
  flavor: string;
}

export class CreateVMAction {

  private client: any;

  constructor(clientOptions: any) {
    this.client = pkgcloud.compute.createClient(clientOptions);
  }

  perform(options: CreateVMActionOptions, callback: (Error, Object) => void): void {
    this.validateOptions(options);

    this.client.createServer(options, callback);
  }

  validateOptions(options: CreateVMActionOptions) {
    if (!options) {
      throw new Error('No options were sent');
    }

    if (!options.name) {
      throw new Error('No name options was sent');
    }

    if (!options.username || !options.password) {
      throw new Error('No username or password were supplied');
    }

    if (!options.flavor) {
      throw new Error('Please provide a flavor for the created VM');
    }
  }
}