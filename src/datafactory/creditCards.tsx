import { CreditCard } from '../types/creditCard';

export class CreditCards {
  async createCreditCard(): Promise<CreditCard> {
    const creditCards = [
      {
        type: 'Visa',
        number: '4242424242424242',
        expMo: '12',
        expYr: '27',
        securityCode: '350',
      },
      {
        type: 'MC',
        number: '5555555555554444',
        expMo: '04',
        expYr: '29',
        securityCode: '428',
      },
      {
        type: 'MC prepaid',
        number: '5105105105105100',
        expMo: '10',
        expYr: '27',
        securityCode: '648',
      },
      {
        type: 'AMEX',
        number: '378282246310005',
        expMo: '11',
        expYr: '26',
        securityCode: '9382',
      },
      {
        type: 'Discover',
        number: '6011111111111117',
        expMo: '03',
        expYr: '31',
        securityCode: '747',
      },
      {
        type: 'Visa debit',
        number: '4000056655665556',
        expMo: '06',
        expYr: '26',
        securityCode: '787',
      },
    ];

    const randomIndex = Math.floor(Math.random() * creditCards.length);
    return creditCards[randomIndex];
  }
}
