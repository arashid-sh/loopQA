import MailosaurClient from 'mailosaur';

import { EmailMessage } from '../types/emailMessage';
import { MessageListResult } from 'mailosaur/lib/models';

export default class EmailIntegrationService {
  private readonly apiKey = process.env.MAILOSAUR_API_KEY || '';
  private readonly serverID = process.env.MAILOSAUR_SERVER || '';
  private readonly mailosaur = new MailosaurClient(this.apiKey);
  private readonly timeout = process.env.GET_EMAIL_MESSAGE_TIMEOUT || 60000;

  /**
   * Creates an email address and then returns it.
   */
  async createNewEmailAddress(): Promise<string> {
    return this.mailosaur.servers.generateEmailAddress(this.serverID);
  }

  /**
   * Gets the message object from an email address
   * @param emailAddress - the email address of the inbox to search
   */
  async getEmailMessage(emailAddress: string): Promise<EmailMessage> {
    const message = await this.mailosaur.messages.get(
      this.serverID,
      {
        sentTo: emailAddress,
      },
      {
        timeout: parseInt(this.timeout as string) || 60000,
      },
    );

    return {
      id: message.id,
      subject: message.subject,
      body: message.text?.body,
      links: message.html?.links,
      code: message.html?.codes ?? [], //mailosaur automatically extracts code from body into an array.
    };
  }

  /**
   * This function deletes a specific message given its ID. you can retrieve the ID of a message
   * as such const {id} = await emailIntegrationService.getEmailMessage(<<email address>>)
   * @param id the id of the message
   */
  async deleteMessage(id: string): Promise<void> {
    await this.mailosaur.messages.del(id);
  }

  /** This function deletes [all] the messages in the server. */
  async deleteAllMessages(): Promise<void> {
    await this.mailosaur.messages.deleteAll(this.serverID);
  }

  /** This function returns an [object] containing all messages sent to a specific email address
   * @param emailAddress the email address that you want to retrieve the messages for.
   */
  async getAllMessagesFor(emailAddress: string): Promise<MessageListResult> {
    return await this.mailosaur.messages.search(this.serverID, { sentTo: emailAddress });
  }

  /**
   * This functions takes an object of messages and looks for the subject that contains the text "Your verification code".
   * It then extracts the verfication code from the string and returns it.
   * @param allMessages An object that contains a list of email messages.
   */
  async getVerificationCodeFromListOfMessages(allMessages: MessageListResult): Promise<string | null> {
    const messageSubject = allMessages.items?.find((item) => item.subject?.includes('Your verification code'));

    // if subject was found containing the text "Your verification code"
    if (messageSubject) {
      const splitSubject = messageSubject.subject?.split(' ');
      const verificationCode = splitSubject!.pop() ?? '';
      return verificationCode;
    } else {
      console.error('Verification was not found with in: ', allMessages);
      return null;
    }
  }
}
