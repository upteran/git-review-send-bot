# Review send bot

Project created for realize telegram bot, that can send to users from chat git 
PR links (it can be any string or link) and uses for it ordered queue

## Bot commands

- `/reg` - registry user in tg chat (new user MUST registry in chat and system)
- `/in` - enable chat notify to user
- `/out` - release user from chat notify
- `/review` - (must be with msg) send review msg to user from queue (ex: /review https://google.com)
- `/end_review` - close review and
- `/check_status` - check user status
- `/check_all` - check users statuses
- `/clear_all` - reset state

## workflow

- For save state project uses firebase DB 

- For work with different logic scopes, used different services, where init 
own services api, in theory for create another functional, you can create own service, model, commands and controller where it all will init, 
and pass it to index.ts init file, without change any logic on project

## Environment Variables

| Name                    | Description                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- |
| TELEGRAM_API_KEY        | API key for the telegram bot, provided by [@BotFather](https://telegram.me/BotFather) |
| BOT_USERNAME            | Username of the live bot on Telegram. Must be without the @ sign.                     |
| FIREBASE_API_KEY        | Firebase project api key from your project console                                    |
| FIREBASE_DB_URL         |                                                                                       |
| FIREBASE_STORAGE_BUCKET |                                                                                       |
