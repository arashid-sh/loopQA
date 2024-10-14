import { Address } from '../types/address';

export class UserAddress {
  async address(): Promise<Address> {
    const address: Address = {
      zip: '10019',
      addressLine1: '300 W 57th St',
    };
    return address;
  }
}
