import { request, APIRequestContext, expect } from '@playwright/test';

export class LoyaltyService {
  private apiContext: APIRequestContext;

  // Initialize the APIRequestContext
  async init() {
    this.apiContext = await request.newContext();
  }

  /**
   * Creates an Order
   * @param email the email associated with the loyalty account
   * @param site: the sales channel of the site: MH: 2, WH: 3, Cosmo: 4, sbz: 5, prevention: 6
   * @param domain: the domain you want to unlink from
   * */
  async unlinkLoyaltyAccount(email: string, site: number, domain: string): Promise<void> {
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
}
