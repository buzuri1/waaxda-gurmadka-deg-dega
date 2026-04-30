'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

const suggestions = [
  'Immisa dhacdadood ayaa dhacay?',
  'Kuma dhacdada ugu weyn khasaaraha?',
  'Degmadee ayaa ugu badan dhacdooyinka?',
  'Immisa baabuur dabdamis ah ayaa la adeegsaday?',
  'Maxay ahayd sababta ugu badan dabka?',
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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-4 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-official-blue/10 text-official-blue text-sm font-semibold mb-3">
          <Bot className="w-4 h-4" /> AI Assistant
        </div>
        <h1 className="text-2xl font-bold text-text-dark">🤖 Weydii AI — Xogta Dhacdooyinka</h1>
        <p className="text-sm text-muted mt-1">Waydii su&apos;aalaha ku saabsan dhacdooyinka dabka ee Banadir</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(27,79,190,0.1), rgba(204,0,0,0.1))' }}>
              <Sparkles className="w-10 h-10 text-official-blue" />
            </div>
            <p className="text-muted text-sm mb-6">Halkan su&apos;aal ku qor si aad xog uga hesho dhacdooyinka dabka</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)} className="px-3 py-2 rounded-xl bg-white border border-border text-xs font-medium text-text-dark hover:border-official-blue hover:bg-blue-50/50 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-fire-red' : 'bg-official-blue'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={msg.role === 'user' ? 'chat-bubble-user px-4 py-3' : 'chat-bubble-ai px-4 py-3'}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-official-blue shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble-ai px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="w-4 h-4 animate-spin" /> Waan ka fiirsanayaa...
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (when messages exist) */}
      {messages.length > 0 && !loading && (
        <div className="flex flex-wrap gap-2 px-2 pb-3 shrink-0">
          {suggestions.slice(0, 3).map((s) => (
            <button key={s} onClick={() => sendMessage(s)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-[11px] font-medium text-muted hover:bg-gray-200 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 bg-white rounded-2xl border border-border p-3 flex items-center gap-3">
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Halkan su'aasha ku qor..." className="flex-1 text-sm bg-transparent outline-none placeholder-muted" disabled={loading} />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          style={{ background: 'linear-gradient(135deg, #CC0000, #990000)' }}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
