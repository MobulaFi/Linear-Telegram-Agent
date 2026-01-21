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
git clone https://github.com/Flotapponnier/Linear---Telegram-Agent-.git
cd Linear---Telegram-Agent-
npm install
cp .env.example .env
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Yes | Telegram bot token from @BotFather |
| `TELEGRAM_ALLOWED_USERNAMES` | Yes | Comma-separated allowed usernames |
| `LINEAR_API_KEY` | Yes | Linear API key |
| `LINEAR_TEAM_ID` | Yes | Linear team ID |
| `LINEAR_WORKSPACE_SLUG` | Yes | Linear workspace slug |
| `LINEAR_TICKET_PREFIX` | No | Ticket prefix (default: TEAM) |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `REDIS_URL` | No | Redis URL (default: redis://localhost:6379) |
| `BOT_BRAND_NAME` | No | Bot display name |
| `PORT` | No | Server port (default: 4000) |

### Team Mappings

Edit `src/config/userMappings.ts` to map Telegram usernames to Linear accounts:

```typescript
export const USER_MAPPINGS: UserMapping[] = [
  {
    telegramUsername: 'john_doe',
    linearName: 'john',
    linearEmail: 'john@company.com',
    aliases: ['john', 'johnny'],
  },
];
```

### Linear Webhook (Optional)

1. Go to Linear Settings > API > Webhooks
2. Create webhook pointing to `https://your-domain.com/linear-webhook`
3. Set `LINEAR_SIGNING_SECRETS` in your `.env`

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

## License

MIT
