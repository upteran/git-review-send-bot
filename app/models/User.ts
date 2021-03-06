import { escape } from '../helpers/escapeMarkdown';
/**
 * Entity to represent a telegram user.
 */
export default class User {
  id: number;
  username: string;
  status: string;
  reviews: Array<number> | null;

  /**
   * @param  {Number} id - Numeric ID of the user.
   * @param  {String} username - Telegram username, without the @
   * @param  {String} status
   * @return {User}
   */
  constructor(id: number, username: string, status = 'active') {
    if (!id) throw new SyntaxError('No ID provided for user');
    if (!username) throw new SyntaxError('No username provided for user');

    this.id = id;
    this.username = username;
    this.status = status;
    this.reviews = null;
  }

  get name(): string {
    return escape(this.username);
  }
}
