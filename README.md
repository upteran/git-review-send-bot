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

## Installation

-   Clone the repository
-   yarn install
-   Create `.env` file with configs (ex: `.env-example`)
-   Run `npm start` or `npm start:dev` to start the service.

## Environment Variables

| Name                    | Description                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- |
| TELEGRAM_API_KEY        | API key for the telegram bot, provided by [@BotFather](https://telegram.me/BotFather) |               |
| FIREBASE_API_KEY        | Firebase project api key from your project console                                    |
| FIREBASE_DB_URL         |                                                                                       |
| FIREBASE_STORAGE_BUCKET |                                                                                       |

- For dev env can user .env file for pass environment vars, ex: `.env-example`