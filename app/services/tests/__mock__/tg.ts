const mockUser = { id: 1, username: 'some' };

export const mockSendTgMsg = (
  user = mockUser,
  chatId = 1,
  msgCb = (msg: any): void => console.log(msg),
  // TODO: move to const and add type
  message = {
    text: '/review msg',
    entities: [{ offset: 0, length: 7, type: 'bot_command' }]
  }
): object => ({
  from: user,
  chat: { id: chatId },
  reply: msgCb,
  message
});