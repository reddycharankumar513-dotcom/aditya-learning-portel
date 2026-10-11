import { Response } from 'express';
import { AIConversation } from '../models/AIConversation.js';
import { claudeService } from '../services/claudeService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const chat = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { message, conversationId, skillLevel = 'Intermediate', topicContext = '' } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ message: 'A prompt message is required.' });
      return;
    }

    let conversation;

    if (conversationId) {
      conversation = await AIConversation.findById(conversationId);
    }

    // Build history array
    const historyMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    if (conversation) {
      conversation.messages.forEach((m) => {
        historyMessages.push({ role: m.role, content: m.content });
      });
    }

    // Add current user message
    historyMessages.push({ role: 'user', content: message.trim() });

    // Call Claude service
    const tutorResult = await claudeService.askTutor({
      messages: historyMessages,
      skillLevel,
      topicContext,
    });

    const now = new Date();
    const userMsgObj = { role: 'user' as const, content: message.trim(), timestamp: now };
    const assistantMsgObj = { role: 'assistant' as const, content: tutorResult.content, timestamp: now };

    if (!conversation) {
      // Create new conversation
      const title = message.trim().slice(0, 40) + (message.length > 40 ? '...' : '');
      conversation = await AIConversation.create({
        user: req.user?._id || undefined,
        title,
        messages: [userMsgObj, assistantMsgObj],
      });
    } else {
      conversation.messages.push(userMsgObj as any);
      conversation.messages.push(assistantMsgObj as any);
      await conversation.save();
    }

    res.json({
      message: assistantMsgObj,
      conversationId: conversation._id,
      source: tutorResult.source,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error processing AI Tutor request.' });
  }
};

export const getConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.json({ conversations: [] });
    return;
  }

  try {
    const conversations = await AIConversation.find({ user: req.user._id })
      .select('title messages updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json({ conversations });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve conversations.' });
  }
};

export const getConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const conversation = await AIConversation.findById(id);

    if (!conversation) {
      res.status(404).json({ message: 'Conversation session not found.' });
      return;
    }

    res.json({ conversation });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to load conversation.' });
  }
};

export const deleteConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await AIConversation.findByIdAndDelete(id);
    res.json({ message: 'Conversation session deleted.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete conversation.' });
  }
};
