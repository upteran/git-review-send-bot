# Review send bot

## readme
You can:
- registry in chat
- create users queue
- send and set msg to user from queue

## Bot commands

/reg - registry user in tg chat
/in - enable chat notify to user
/out - release user from chat notify
/review - (must be with msg) send review msg to user from queue
/end_review - close review and
/check_status - check user status
/check_all - check users statuses

## Environment Variables

| Name                                   | Description                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| TELEGRAM_API_KEY                       | API key for the telegram bot, provided by [@BotFather](https://telegram.me/BotFather)                                    |
| BOT_USERNAME                           | Username of the live bot on Telegram. Must be without the @ sign.                                                        |
| FIREBASE_API_KEY                       | Firebase project api key from your project console                                                               |
| FIREBASE_DB_URL                        |                                                                        |
| FIREBASE_STORAGE_BUCKET                |  |