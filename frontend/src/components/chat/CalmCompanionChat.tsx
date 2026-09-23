import React, { useState, useRef, useEffect } from 'react';
import { X, Send, RotateCcw, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../types/wellbeing';
import { ChatService } from '../../services/api';

interface CalmCompanionChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCounsellor?: () => void;
}

const OPENING_GREETING: ChatMessage = {
  id: 'opening_greeting',
  role: 'assistant',
  content: "Hey. I'm here with you.\nYou don't have to figure anything out right now.\n\nWhat's been on your mind?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  safety_state: 'normal',
};

export const CalmCompanionChat: React.FC<CalmCompanionChatProps> = ({
  isOpen,
  onClose,
  onOpenCounsellor,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisState, setCrisisState] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await ChatService.sendChatMessage(trimmed, 'session_companion', messages);
      
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        safety_state: response.safety_state,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.safety_state === 'crisis') {
        setCrisisState(true);
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'assistant',
        content: "I'm still here. It seems like I couldn't respond properly just now. You can tell me what was on your mind again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([OPENING_GREETING]);
    setCrisisState(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="flex flex-col w-full max-w-2xl h-[85vh] max-h-[700px] bg-white dark:bg-[#152420] rounded-2xl shadow-2xl border border-emerald-100 dark:border-[#243d36] overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#203630] bg-[#fafaf8] dark:bg-[#121e1b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-[#1f3831] text-emerald-700 dark:text-[#6ec4b2] flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Calm Companion
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#1c332c] text-emerald-700 dark:text-[#6ec4b2]">
                  <Sparkles className="w-3 h-3" /> Listening
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A private space to talk through what’s on your mind.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              title="Start new conversation"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1d302a] text-xs font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              title="Close Companion"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1d302a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Crisis Alert Banner */}
        {crisisState && (
          <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900/60 flex items-start justify-between gap-3 text-amber-900 dark:text-amber-200 text-xs">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Immediate Human Support Available:</span> Tele-MANAS (14416 / 1800-891-4416) or AASRA (91-9820466726) offer free 24/7 support.
              </div>
            </div>
            {onOpenCounsellor && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCounsellor();
                }}
                className="shrink-0 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] transition-colors"
              >
                Connect to Counsellor
              </button>
            )}
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCrisis = msg.safety_state === 'crisis';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                      : isCrisis
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-800/60 rounded-bl-xs'
                      : 'bg-slate-100 dark:bg-[#1f332d] text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/50 dark:border-[#274039]'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 italic p-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Calm Companion is listening...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-slate-100 dark:border-[#203630] bg-[#fafaf8] dark:bg-[#121e1b]"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what's on your mind..."
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#1b2b27] border border-slate-200 dark:border-[#28453d] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
            Calm Companion is an empathetic listener, not a medical therapist. Nothing is shared without your consent.
          </p>
        </form>
      </div>
    </div>
  );
};
