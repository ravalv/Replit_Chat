import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertUserSchema, insertConversationSchema, insertMessageSchema, updateConversationSchema, updateMessageFeedbackSchema } from "@shared/schema";
import { generateAIResponse, generateConversationTitle, categorizeQuery } from "./mockAI";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const MemoryStore = createMemoryStore(session);
const SALT_ROUNDS = 10;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_THRESHOLD = 25 * 60 * 1000; // 25 minutes

declare module "express-session" {
  interface SessionData {
    userId: string;
    username: string;
    role: string;
    lastActivity: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute per IP
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts
    message: "Too many login attempts, please try again later",
    skipSuccessfulRequests: true,
  });

  app.use("/api", apiLimiter);

  // Validate session secret exists
  if (!process.env.SESSION_SECRET) {
    console.warn("WARNING: SESSION_SECRET not set, using fallback (insecure for production)");
  }

  // Session middleware with secure store
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "bbh-makerchat-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // Clean up expired sessions every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: SESSION_TIMEOUT,
        sameSite: "strict", // CSRF protection
      },
    })
  );

  // Auth middleware - check timeout BEFORE updating lastActivity
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check session timeout BEFORE updating lastActivity
    const now = Date.now();
    const lastActivity = req.session.lastActivity || now;
    const timeSinceActivity = now - lastActivity;

    if (timeSinceActivity > SESSION_TIMEOUT) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Session expired" });
    }

    // Only update lastActivity after passing timeout check
    req.session.lastActivity = now;

    next();
  };

  // Generate correlation ID for logging
  app.use("/api", (req, res, next) => {
    req.headers["x-correlation-id"] = randomUUID();
    next();
  });

  // Auth Routes
  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const { username, password, role } = req.body;

      // Password strength validation
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Validate role
      const validRoles = ["external_client", "operations_team"];
      const userRole = validRoles.includes(role) ? role : "external_client";

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        role: userRole,
      });

      // Create session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;
      req.session.lastActivity = Date.now();

      console.log(`[AUDIT] User registered: ${user.username} (${user.role})`);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;
      req.session.lastActivity = Date.now();

      console.log(`[AUDIT] User logged in: ${user.username} (${user.role})`);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const username = req.session.username;
    console.log(`[AUDIT] User logged out: ${username}`);
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/session", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = Date.now();
    const lastActivity = req.session.lastActivity || 0;
    const timeRemaining = SESSION_TIMEOUT - (now - lastActivity);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      sessionTimeRemaining: Math.max(0, timeRemaining),
      showWarning: timeRemaining <= (SESSION_TIMEOUT - WARNING_THRESHOLD),
    });
  });

  app.post("/api/auth/extend-session", requireAuth, (req, res) => {
    req.session.lastActivity = Date.now();
    res.json({ message: "Session extended", sessionTimeRemaining: SESSION_TIMEOUT });
  });

  // Conversation Routes
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const conversations = await storage.getConversationsByUserId(req.session.userId!);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/conversations", requireAuth, async (req, res) => {
    try {
      // Enforce user ID from session, not request body
      const data = insertConversationSchema.parse({
        title: req.body.title,
        category: req.body.category,
        isBookmarked: req.body.isBookmarked || false,
        userId: req.session.userId!, // Force userId from session
      });

      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/conversations/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateConversationSchema.parse(req.body);

      // Verify ownership
      const conversation = await storage.getConversation(id);
      if (!conversation || conversation.userId !== req.session.userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const updated = await storage.updateConversation(id, updates);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/conversations/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // Verify ownership
      const conversation = await storage.getConversation(id);
      if (!conversation || conversation.userId !== req.session.userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      await storage.deleteConversation(id);
      res.json({ message: "Conversation deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Message Routes
  app.get("/api/conversations/:conversationId/messages", requireAuth, async (req, res) => {
    try {
      const { conversationId } = req.params;

      // Verify ownership
      const conversation = await storage.getConversation(conversationId);
      if (!conversation || conversation.userId !== req.session.userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await storage.getMessagesByConversationId(conversationId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/conversations/:conversationId/messages", requireAuth, async (req, res) => {
    try {
      const { conversationId } = req.params;

      // Verify ownership
      const conversation = await storage.getConversation(conversationId);
      if (!conversation || conversation.userId !== req.session.userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const userMessageData = insertMessageSchema.parse({
        ...req.body,
        conversationId,
      });

      // Create user message
      const userMessage = await storage.createMessage(userMessageData);

      // Generate AI response
      const aiResponse = generateAIResponse(userMessageData.content);

      // Simulate delay for realistic AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiMessageData = insertMessageSchema.parse({
        conversationId,
        role: "assistant",
        content: aiResponse.content,
        hasTable: aiResponse.hasTable,
        hasChart: aiResponse.hasChart,
        data: aiResponse.data,
      });

      const aiMessage = await storage.createMessage(aiMessageData);

      // Update conversation timestamp
      await storage.updateConversation(conversationId, {});

      // Log query for audit
      console.log(`[AUDIT] Query logged: User ${req.session.username} asked "${userMessageData.content.substring(0, 100)}..."`);

      res.json({
        userMessage,
        aiMessage,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/messages/:id/feedback", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const feedbackData = updateMessageFeedbackSchema.parse(req.body);

      // First, get the message to verify it exists
      const message = await storage.getMessage(id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      // Verify ownership by checking if conversation belongs to user
      const conversation = await storage.getConversation(message.conversationId);
      if (!conversation || conversation.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden: You can only provide feedback on your own messages" });
      }

      // Only update after authorization check passes
      const updatedMessage = await storage.updateMessageFeedback(id, feedbackData);

      // Log feedback for audit
      console.log(`[AUDIT] Message feedback: User ${req.session.username} gave ${feedbackData.feedback} feedback on message ${id}`);

      res.json(updatedMessage);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chat endpoint for new conversations
  app.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      // Create new conversation
      const title = generateConversationTitle(message);
      const category = categorizeQuery(message);

      const conversation = await storage.createConversation({
        userId: req.session.userId!,
        title,
        category,
        isBookmarked: false,
      });

      // Create user message
      const userMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: "user",
        content: message,
      });

      // Generate AI response
      const aiResponse = generateAIResponse(message);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: aiResponse.content,
        hasTable: aiResponse.hasTable,
        hasChart: aiResponse.hasChart,
        data: aiResponse.data,
      });

      // Log query for audit
      console.log(`[AUDIT] New conversation: User ${req.session.username} started "${title}"`);
      console.log(`[AUDIT] Query logged: "${message.substring(0, 100)}..."`);

      res.json({
        conversation,
        userMessage,
        aiMessage,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
