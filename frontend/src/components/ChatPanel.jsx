import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Send, Smile } from 'lucide-react';

const EMOJI_QUICK = ['😊', '❤️', '😂', '🔥', '👋', '😍', '🎉', '💯'];

export const ChatPanel = () => {
  const { messages, addMessage, userProfile, matchStatus } = useStore();
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate partner typing indicator
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.sender === 'me') {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    addMessage({
      id: Date.now(),
      text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: userProfile?.name || 'You',
    });

    setInput('');
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const isConnected = matchStatus === 'matched';

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 tracking-wider">LIVE CHAT</h3>
        <div className="flex items-center gap-2">
          {isConnected && (
            <span className="text-[10px] text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full">Connected</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium">
              {isConnected ? 'Say hello! 👋' : 'Connect to start chatting'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'me'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-md'
                  : 'bg-white/[0.07] text-gray-200 border border-white/5 rounded-bl-md'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-white/50' : 'text-gray-500'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/[0.07] border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="px-4 py-2 border-t border-white/5 flex gap-2 flex-wrap">
          {EMOJI_QUICK.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="text-xl hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1 focus-within:border-rose-500/50 transition-colors">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2 rounded-lg transition-colors ${showEmoji ? 'text-rose-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? 'Type a message...' : 'Connect to chat...'}
            disabled={!isConnected}
            className="flex-1 bg-transparent text-white text-sm py-2 placeholder:text-gray-600 focus:outline-none disabled:opacity-40"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
