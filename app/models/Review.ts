/**
 * Entity to represent a telegram user.
 */
export default class Review {
  id: string;
  msg: string;
  createDateTime?: Date | null;
  endDateTime?: Date | null;
  authorId: number;
  /**
   * @param  {String} id - ID of the review
   * @param  {String} msg - message/link of review
   * @param  {Number} authorId
   * @return {Review}
   */
  constructor(id: string, msg: string, authorId: number) {
    if (!id) throw new SyntaxError('No ID provided for review');
    if (!msg) throw new SyntaxError('No username provided for user');

    this.id = id;
    this.msg = msg;
    this.createDateTime = null;
    this.endDateTime = null;
    this.authorId = authorId;
  }

  get params(): object {
    return {
      id: this.id,
      msg: this.msg,
      createDateTime: this.createDateTime,
      endDateTime: this.endDateTime,
      authorId: this.authorId
    };
  }
}
