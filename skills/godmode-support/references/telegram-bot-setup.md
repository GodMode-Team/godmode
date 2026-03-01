# GodMode Support Bot Setup

This document describes how to set up the Telegram support bot.

## Creating the Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Name: `GodMode Support`
4. Username: `GodModeSupportBot` (or your preferred unique name)
5. Save the bot token (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Bot Welcome Message

Configure this as the bot's `/start` message via BotFather:

```
/setdescription
```

Then set this description:

```
Welcome to GodMode Support!

I'm Atlas, your AI support assistant. I can help with:

- GodMode questions and troubleshooting
- Configuration help
- Feature guidance
- Remote diagnostics (with your approval)

HOW IT WORKS:

1. Just message me your question or issue
2. I'll help you troubleshoot
3. If I need to check your system remotely, I'll ask first
4. You'll get a notification to approve any remote access
5. You can see everything I do

SUPPORT HOURS:

- Chat: 24/7 (I'm always here)
- Remote access: 9 AM - 5 PM Central Time

PRIVACY:

- All conversations are logged for quality
- Remote sessions require your explicit approval
- You can revoke access anytime

Need help? Just send a message describing your issue!
```

## Bot Commands

Configure these commands via BotFather:

```
/setcommands
```

```
help - Show help information
status - Check your GodMode status
hours - Show support hours
privacy - View privacy information
```

## Command Responses

### /help

```
GodMode Support Help

I can assist with:
- Installation issues
- Configuration questions
- Feature explanations
- Troubleshooting errors
- Integration setup

Just describe your issue in plain language and I'll help!

For complex issues, I may need remote access to diagnose. You'll always be asked to approve this first.

Support hours: Chat 24/7, Remote access 9-5 CT
```

### /status

```
Checking your GodMode status...

[Atlas will look up the user's Telegram ID in the registry and report their system status]
```

### /hours

```
GodMode Support Hours

Chat Support: 24/7
I'm always here to answer questions and provide guidance.

Remote Access: 9 AM - 5 PM Central Time
For issues that require me to connect to your system, I can only do so during business hours.

If you have an urgent issue outside these hours, describe it here and I'll log it for first thing tomorrow.
```

### /privacy

```
GodMode Support Privacy

What we log:
- Support conversations (for quality and training)
- Remote session commands and outcomes
- System diagnostic information

What we DON'T access:
- Your personal files (unless specifically troubleshooting)
- Your API keys or credentials (always redacted)
- Other applications on your system

Your rights:
- Approve/deny each remote access request
- Revoke access at any time
- Request conversation history deletion

Questions? Ask me or email support@lifeongodmode.com
```

## Bot Settings

Configure via BotFather:

```
/setprivacy - Set to DISABLE (so bot can see all messages in groups, though we use DMs)
/setjoingroups - Set to DISABLE (we use DMs only)
/setinline - Set to DISABLE (not needed)
```

## Integration with Atlas

The bot token needs to be added to Atlas's configuration:

```json
// ~/.openclaw/config.json
{
  "telegram": {
    "supportBot": {
      "token": "YOUR_BOT_TOKEN_HERE",
      "enabled": true
    }
  }
}
```

Atlas will:

1. Listen for messages to this bot
2. Look up the sender's Telegram ID in the support registry
3. Route to the `godmode-support` skill
4. Log all interactions

## Testing

1. Message the bot from your personal Telegram account
2. Verify Atlas receives and responds to the message
3. Test the `/start`, `/help`, `/status` commands
4. Verify your Telegram user ID shows in the registry lookup

## Telegram User ID Lookup

To find a user's Telegram ID for the registry:

1. Have them message the bot
2. Check Atlas logs for the incoming message
3. The user ID will be in the message metadata

Or use [@userinfobot](https://t.me/userinfobot) - have them forward a message from themselves to get their ID.
