import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

type InnerWorkMessage = {
  role: "user" | "sage";
  content: string;
  timestamp: number;
  sessionType?: string;
};

type SessionType =
  | "reflection"
  | "meditation"
  | "journaling"
  | "gratitude"
  | "intention-setting"
  | "general";

const send: GatewayRequestHandler = async ({ params, respond }) => {
  const { sessionType, message } = params as {
    sessionType?: SessionType;
    message?: string;
  };

  const validSessionTypes: SessionType[] = [
    "reflection",
    "meditation",
    "journaling",
    "gratitude",
    "intention-setting",
    "general",
  ];

  const type = sessionType && validSessionTypes.includes(sessionType) ? sessionType : "general";

  let responseContent: string;

  if (!message || message.trim() === "") {
    switch (type) {
      case "reflection":
        responseContent =
          "What's on your mind today? Take a moment to notice what thoughts or feelings are present.";
        break;
      case "meditation":
        responseContent =
          "Let's begin. Take three deep breaths and settle into this moment. What do you notice in your body?";
        break;
      case "journaling":
        responseContent =
          "Your journal awaits. What would you like to explore through writing today?";
        break;
      case "gratitude":
        responseContent =
          "Let's cultivate appreciation. What are three things you're grateful for right now?";
        break;
      case "intention-setting":
        responseContent =
          "What intention would you like to set for today? Consider what quality or focus you'd like to bring.";
        break;
      default:
        responseContent = "I'm here to support your inner work. How are you feeling today?";
    }
  } else {
    responseContent = `I hear you. ${message.length > 50 ? "Thank you for sharing that with me. " : ""}Tell me more about that...`;
  }

  const response: InnerWorkMessage = {
    role: "sage",
    content: responseContent,
    timestamp: Date.now(),
    sessionType: type,
  };

  respond(true, {
    response,
    source: "placeholder",
  });
};

const history: GatewayRequestHandler = async ({ params, respond }) => {
  const { sessionType, limit } = params as {
    sessionType?: string;
    limit?: number;
  };

  const maxMessages = Math.min(100, Math.max(1, limit ?? 50));

  respond(true, {
    messages: [] as InnerWorkMessage[],
    sessionType: sessionType ?? null,
    limit: maxMessages,
    source: "placeholder",
  });
};

export const innerWorkHandlers: GatewayRequestHandlers = {
  "innerwork.send": send,
  "innerwork.history": history,
};
