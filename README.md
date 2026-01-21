# Linear Telegram Bot

A Telegram bot for ticket management in Linear. Create, edit, assign, and track issues directly from Telegram using natural language commands powered by OpenAI.

## Features

- Create Linear tickets from Telegram with natural language
- AI-powered command parsing using OpenAI
- Assign tickets to team members by name or alias
- Update ticket status
- Edit ticket title, description, or assignee
- Real-time webhook updates from Linear
- User access control via whitelist
- Redis-based ticket tracking per chat

## Requirements

- Node.js 20+
- Redis
- Telegram Bot Token
- Linear API Key
- OpenAI API Key

## Installation

```bash
git clone https://github.com/Flotapponnier/Linear_Telegram_Agent.git
cd Linear_Telegram_Agent
npm install
cp .env.example .env
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure each variable:

#### Telegram Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Yes | Your bot token. Get it from [@BotFather](https://t.me/BotFather) on Telegram: send `/newbot`, follow the steps, and copy the token. |
| `TELEGRAM_ALLOWED_USERNAMES` | Yes | Comma-separated list of Telegram usernames (without @) allowed to use the bot. Example: `john,alice,bob` |
| `TELEGRAM_ADMIN_USERNAME` | No | Admin username (without @) who receives error notifications when the bot fails to create tickets and cannot DM the user. |
| `TELEGRAM_ADMIN_CHAT_ID` | No | Admin's Telegram chat ID for direct error notifications. To get your chat ID, message [@userinfobot](https://t.me/userinfobot). |

#### Linear Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `LINEAR_API_KEY` | Yes | Your Linear API key. Go to Linear > Settings > API > Personal API keys > Create key. |
| `LINEAR_TEAM_ID` | Yes | Your team ID. Go to your team settings in Linear, the ID is in the URL: `linear.app/settings/teams/TEAM_ID`. |
| `LINEAR_WORKSPACE_SLUG` | Yes | Your workspace slug. This is the part after `linear.app/` in your Linear URL. Example: if your URL is `linear.app/mycompany/...`, the slug is `mycompany`. |
| `LINEAR_TICKET_PREFIX` | No | The prefix used for your tickets (default: TEAM). Example: if your tickets are `ENG-1234`, set this to `ENG`. |
| `LINEAR_SIGNING_SECRETS` | No | Webhook signing secret for verifying Linear webhook requests. Get it when creating a webhook in Linear > Settings > API > Webhooks. |

#### Redis Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `REDIS_URL` | No | Redis connection URL (default: `redis://localhost:6379`). For production, use your Redis instance URL. |

#### OpenAI Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key. Get it from [platform.openai.com/api-keys](https://platform.openai.com/api-keys). The bot uses GPT-4o-mini for command parsing. |

#### Bot Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_BRAND_NAME` | No | Custom name displayed in bot messages (default: Linear Tracker). |
| `PORT` | No | Server port (default: 4000). |

### Example .env

```env
# Telegram
TELEGRAM_BOT_TOKEN=7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_ALLOWED_USERNAMES=john,alice,bob
TELEGRAM_ADMIN_USERNAME=john
TELEGRAM_ADMIN_CHAT_ID=123456789

# Linear
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINEAR_TEAM_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
LINEAR_WORKSPACE_SLUG=mycompany
LINEAR_TICKET_PREFIX=ENG

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Bot
BOT_BRAND_NAME=My Team Bot
PORT=4000
```

### Team Mappings

Edit `src/config/userMappings.ts` to map Telegram usernames to Linear accounts. This enables:
- Automatic assignee resolution from Telegram messages
- AI-powered name matching with aliases
- "assign me" resolution based on message sender

```typescript
export const USER_MAPPINGS: UserMapping[] = [
  {
    telegramUsername: 'john_doe',      // Telegram username without @
    linearName: 'john',                 // Name as it appears in Linear
    linearEmail: 'john@company.com',    // Email used in Linear
    aliases: ['john', 'johnny', 'jd'],  // Alternative names to match
  },
  {
    telegramUsername: 'alice_dev',
    linearName: 'alice',
    linearEmail: 'alice@company.com',
    aliases: ['alice', 'al'],
  },
];
```

### Linear Webhook (Optional)

To receive real-time updates when tickets change in Linear:

1. Go to Linear > Settings > API > Webhooks
2. Click "New webhook"
3. Set URL to `https://your-domain.com/linear-webhook`
4. Select the events you want (Issue updates, Comments, etc.)
5. Copy the signing secret and set it as `LINEAR_SIGNING_SECRETS` in your `.env`

## Usage

### Commands

```
/ticket <title> | <description>  - Create a ticket
/help                            - Show help
```

### Natural Language

Mention the bot to use natural language:

```
@bot create a ticket for John to fix the login bug
@bot assign TEAM-1234 to Alice
@bot set TEAM-567 to In Progress
@bot edit TEAM-890
@bot cancel TEAM-123
```

## Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Docker

```bash
docker build -t linear-telegram-bot .
docker run -d --env-file .env -p 4000:4000 linear-telegram-bot
```

## Project Structure

```
src/
├── config/
│   ├── LinearBotConfig.ts    # Configuration schema
│   └── userMappings.ts       # Team mappings
├── controller/
│   └── LinearWebhookController.ts
├── guard/
│   └── LinearAuthGuard.ts
├── services/
│   ├── AIService.ts          # OpenAI integration
│   └── LinearBotService.ts   # Bot logic
├── redis/
│   └── redisModule.ts
├── AppModule.ts
└── main.ts
```

## Error Handling

When the bot fails to create a ticket or encounters an error:

1. It first attempts to send the error via DM to the user who made the request
2. If DM fails (user hasn't started a conversation with the bot), it sends to the admin configured via `TELEGRAM_ADMIN_USERNAME` / `TELEGRAM_ADMIN_CHAT_ID`
3. If no admin is configured, the error is logged to console

## License

MIT
