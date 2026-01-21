import { z } from 'zod';

const LinearTrackerBotConfig = z.object({
  // Telegram Configuration
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_ALLOWED_USERNAMES: z.string().default(''), // Comma-separated list of allowed usernames
  TELEGRAM_ADMIN_USERNAME: z.string().default(''),
  TELEGRAM_ADMIN_CHAT_ID: z.string().optional().default(''),
  
  // Linear Configuration
  LINEAR_API_KEY: z.string(),
  LINEAR_TEAM_ID: z.string(),
  LINEAR_WORKSPACE_SLUG: z.string().default(''), // Your Linear workspace slug (e.g., "mycompany" for linear.app/mycompany)
  LINEAR_TICKET_PREFIX: z.string().default('TEAM'), // Ticket prefix (e.g., "MOB" for MOB-1234, "ENG" for ENG-5678)
  LINEAR_WEBHOOK: z.string().optional().default(''),
  LINEAR_SIGNING_SECRETS: z.string().optional().default(''),
  LINEAR_API_URL: z.string().default('https://api.linear.app/graphql'),
  
  // Redis Configuration
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  // OpenAI Configuration (for AI-powered command parsing)
  OPENAI_API_KEY: z.string(),
  
  // Bot Branding (optional)
  BOT_BRAND_NAME: z.string().default('Linear Tracker'),
});

type LinearTrackerBotConfig = z.infer<typeof LinearTrackerBotConfig>;

export default LinearTrackerBotConfig;
