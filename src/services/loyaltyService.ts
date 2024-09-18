import { request, APIRequestContext, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class LoyaltyService {
  private apiContext: APIRequestContext;

  // Initialize the APIRequestContext
  async init() {
    this.apiContext = await request.newContext();
  }

  /**
   * Unlinks a loyalty account
   * @param email the email associated with the loyalty account
   * @param site: the sales channel of the site: MH: 2, WH: 3, Cosmo: 4, sbz: 5, prevention: 6
   * @param domain: the domain you want to unlink from
   *
   * @example
   * await loyaltyService.unlinkLoyaltyAccount('test@hearst.com', '5', 'harpersbazaarqa')
   * */
  async unlinkLoyaltyAccount(email: string, site: string, domain: string): Promise<void> {
    const response = await this.apiContext.post(`https://${domain}.myvtex.com/_v/sephora/unlink-account`, {
      data: {
        identifier: email, //user email
        kind: 'email', // on live Sephora environment this will need to be the actual email of the user. In Sephora's staging account its the string 'email'
        site: site, //Sale channel harpers bazaar 5
        email: email, //same email user
      },
    });
    try {
      expect(response.status()).toBe(200);
    } catch (error) {
      console.log(error);
      console.log(await response.json());
    }
  }

  /**
   * This function will register a new account on sephora
   * @param email the email address to register with sephora
   * @param site the sales channel of the site: MH: 2, WH: 3, Cosmo: 4, sbz: 5, prevention: 6
   * @param domain the domain you are registering the Sephora account from.
   *
   * Note: the response from this endpoint will return loyalty_id, kind, identifier, site, verified, and partners[]
   * @example
   * await loyaltyService.registerSephoraAccount(emailAddress, '5', 'harpersbazaarqa');
   */
  async registerSephoraAccount(email: string, site: string, domain: string): Promise<void> {
    const response = await this.apiContext.post(`https://${domain}.myvtex.com/_v/sephora/register`, {
      data: {
        identifier: email, //user email
        kind: 'email', // on live Sephora environment this will need to be the actual email of the user. In Sephora's staging account its the string 'email'
        site: site, //Sale channel harpers bazaar 5
        email: email, //same email user
        dob_day: 31,
        dob_month: 12,
        first_name: faker.person.firstName(),
        last_name: 'test',
      },
      headers: { Authorization: `${process.env.LOYALTY_SERVICE_TOKEN}` },
    });

    try {
      expect(response.status()).toBe(200);
    } catch (error) {
      console.log(error);
      console.log(await response.json());
    }
  }
}
