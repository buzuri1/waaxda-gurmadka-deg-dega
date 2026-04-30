'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, SendHorizonal } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

const suggestions = [
  'Immisa dhacdadood?',
  'Dhacdada ugu weyn?',
  'Degmada ugu badan?',
  'Sababta ugu badan?',
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Khalad ayaa dhacay. Fadlan isku day mar kale.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Khalad ayaa dhacay isku xirka. Fadlan isku day mar kale.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="text-2xl">🤖</div>
        <h1 className="text-lg font-medium text-gray-700">Weydii AI — Xogta Dhacdooyinka</h1>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-3 mb-8 shrink-0">
        {suggestions.map((s) => (
          <button 
            key={s} 
            onClick={() => sendMessage(s)} 
            className="px-4 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-8 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="bg-[#CC0000] text-white px-6 py-4 rounded-md shadow-sm max-w-[80%]">
                <p className="text-[15px]">{msg.content}</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5 max-w-[90%] w-full">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-[#1B4FBE]" />
                  <span className="text-xs font-bold text-[#1B4FBE] tracking-wider uppercase">AI RESPONSE</span>
                </div>
                <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 italic">— AI GURMADKA BANADIR 🔥</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5 max-w-[90%] w-full">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-[#1B4FBE]" />
                  <span className="text-xs font-bold text-[#1B4FBE] tracking-wider uppercase">AI RESPONSE</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Waan ka fiirsanayaa...
                </div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 mt-4 relative">
        <input 
          ref={inputRef} 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Halkan su'aasha ku qor..." 
          className="w-full bg-white rounded-md border border-gray-200 pl-4 pr-32 py-4 text-sm focus:outline-none focus:border-gray-300 shadow-sm" 
          disabled={loading} 
        />
        <button 
          onClick={() => sendMessage(input)} 
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#CC0000] hover:bg-[#B30000] text-white px-5 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
          Dir {'>'}
        </button>
      </div>
      <p className="text-center text-[10px] text-gray-400 tracking-wider uppercase mt-3 shrink-0">
        AI CAN MAKE MISTAKES. VERIFY CRITICAL EMERGENCY INFORMATION.
      </p>
    </div>
  );
}
