// @ts-ignore
import { TextMessage, MessageEntity } from 'telegraf/typings/telegram-types';

export const getUserMessage = (message: TextMessage): string => {
  const {
    text,
    entities
  }: { text: string; entities: MessageEntity.CommonMessageEntity } = message;
  if (!text || !entities) return '';

  // @ts-ignore
  const commandEntity = entities.find(
    (entity: { type: string }) => entity.type === 'bot_command'
  );

  return text.slice(commandEntity?.length || 0);
};
