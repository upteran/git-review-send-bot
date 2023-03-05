# Review send bot

Telegram bot that used queue to set chat user and random string. Can use for set review link or some other links to user and
save it to firebase DB

## Bot commands

- `/reg` - registry user in tg chat (new user MUST registry in chat and system)
- `/in` - enable chat notify to user
- `/out` - release user from chat notify
- `/review` - (must be with msg) send review msg to user from queue (ex: /review https://google.com)
- `/end_review` - close review
- `/check_status` - check user status
- `/check_all` - check users statuses
- `/clear_all` - reset state

## workflow

- add bot to chat
- every user must registry `/reg`, will create simple models and save to DB and create user queue
- send link (`/review https://some-pull-request-link`)
- bot will check from queue first user and set to him link above
- after user finish work with link, send `end_review`
- bot remove relation between link end user and put him to queue end

## proj struct and api

### controllers `app/controllers`

Keep commands list for diff entities

```js
export const groupCommands = [
  {
    name: 'reg', // bot command
    cb: group.registrationUser // entity method
  },
];
```

### services `app/services`

Services that keeps business logic

```js
// pass api functions to service
export const reviewService = (api: IReviewServiceApi) => {
  // init api
  const serviceApi = api;

  const setReview = async (ctx: TelegrafContext) => {
   
    // code...
    
    // use api inside services
    const reviewQueue = (await serviceApi.getReviewQueue({ chatId })) || [];
    // code ...
```

### api `app/api`

Keeps api for work with Firebase DB requests. It separated from services 
for easier change DB or api slice if it needs

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