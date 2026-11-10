import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Plus, Trash2, Bot, User as UserIcon, 
  Copy, Check, Code, Lightbulb, BookOpen, AlertCircle, RefreshCw
} from 'lucide-react';
import { aiService, ChatResponse } from '../../services/aiService';
import { AIConversation, AIMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AITutorChatProps {
  initialPrompt?: string;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({ initialPrompt = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Explain neural networks in simple terms.',
    'Teach me Python from the beginning.',
    'Help me understand binary search.',
    'Create a study plan for Machine Learning.',
    'Explain this programming error.',
    'Give me a project idea using React and Node.js.',
  ];

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load existing conversations if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    } else {
      // Unauthenticated demo greeting
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I am ADITYA AI Tutor, powered by Claude. How can I help you master technology concepts today? You can ask me to explain algorithms, review code, suggest study schedules, or break down machine learning math!',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      const res = await aiService.getConversations();
      setConversations(res.conversations);
      if (res.conversations.length > 0 && !activeConversationId) {
        selectConversation(res.conversations[0]);
      } else if (res.conversations.length === 0) {
        startNewConversation();
      }
    } catch (err) {
      console.warn('Could not load conversations:', err);
    }
  };

  const selectConversation = (conv: AIConversation) => {
    setActiveConversationId(conv._id);
    setMessages(conv.messages);
    setErrorNotice(null);
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content: `Welcome to a new learning session! I adapt explanations to your ${skillLevel} level. Select a suggested topic below or type your technical question.`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setErrorNotice(null);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await aiService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeConversationId === id) {
        startNewConversation();
      }
    } catch (err: any) {
      console.error('Delete conversation error:', err);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || loading) return;

    setErrorNotice(null);
    const userMsg: AIMessage = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res: ChatResponse = await aiService.sendMessage({
        message: textToSend,
        conversationId: activeConversationId || undefined,
        skillLevel,
      });

      setMessages((prev) => [...prev, res.message]);
      if (res.conversationId && (!activeConversationId || activeConversationId !== res.conversationId)) {
        setActiveConversationId(res.conversationId);
        if (isAuthenticated) {
          loadConversations();
        }
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'AI service unavailable. Please check backend connection.');
      // Graceful fallback response in UI
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Notice: ${err.message || 'The AI Tutor encountered an error communicating with the Claude service.'}\n\nPlease verify that your server is running and your ANTHROPIC_API_KEY environment variable is configured.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px] h-[calc(100vh-180px)]">
      
      {/* Left Sidebar: Session List & Controls */}
      <div className="lg:col-span-4 xl:col-span-3 border-r border-slate-200 bg-slate-50 flex flex-col justify-between">
        <div className="p-4 space-y-4">
          
          <button
            onClick={startNewConversation}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-700 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>

          {/* Skill Level Selector */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Target Explanation Depth:</span>
              <span className="text-brand-600 font-semibold">{skillLevel}</span>
            </label>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSkillLevel(level)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    skillLevel === level
                      ? 'bg-brand-50 text-brand-700 border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations History */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 mb-2 block">
              Recent Sessions
            </span>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                  No saved conversations yet. Start asking questions!
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv._id === activeConversationId;
                  return (
                    <div
                      key={conv._id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-medium cursor-pointer flex items-center justify-between group transition-all ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 border border-brand-200'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                      }`}
                    >
                      <span className="truncate flex-1 pr-2">{conv.title || 'Untitled Session'}</span>
                      <button
                        onClick={(e) => handleDeleteConversation(e, conv._id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition-opacity"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Disclaimer in Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-500 bg-white">
          <p className="flex items-start gap-1.5 leading-snug">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>AI outputs are for educational assistance. Always test code and verify architectural principles.</span>
          </p>
        </div>
      </div>

      {/* Right Column: Chat Workspace */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between bg-white h-full">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>ADITYA AI Tutor</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Claude Connected
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Context level: <span className="font-semibold text-slate-700">{skillLevel}</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <Code className="w-4 h-4 text-brand-600" />
            <span>Syntax Highlighting Enabled</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3.5 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center shadow-sm ${
                    isUser
                      ? 'bg-slate-900 text-white font-bold text-xs uppercase'
                      : 'bg-gradient-to-tr from-brand-600 to-violet-600 text-white'
                  }`}
                >
                  {isUser ? (user ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />) : <Bot className="w-5 h-5" />}
                </div>

                {/* Content Bubble */}
                <div
                  className={`rounded-3xl p-5 text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none shadow-soft'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-normal">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="flex items-center gap-1 text-slate-500 hover:text-brand-600 font-medium transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 max-w-3xl">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="rounded-3xl rounded-tl-none bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-medium text-slate-500 ml-1">Claude is formulating pedagogical response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Carousel (shown when 1 message or empty) */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 bg-slate-50/70 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Suggested Questions:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {suggestedPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-600 whitespace-nowrap transition-colors shrink-0 shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 rounded-2xl p-2 transition-all"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything: Explain a concept, debug an error, generate exercises..."
              className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-700 hover:to-violet-700 text-white font-semibold shadow-md shadow-brand-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Send prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
