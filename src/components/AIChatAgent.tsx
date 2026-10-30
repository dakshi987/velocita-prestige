import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export const AIChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'agent'; text: string }[]>([
    { sender: 'agent', text: 'Ayubowan! I am your Velocita AI Assistant. How can I help you choose a vehicle today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'agent', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'agent', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs font-bold hidden sm:inline">Ask AI Assistant</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[450px]">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm">Velocita Concierge AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-slate-400 text-[11px] italic">AI Agent is thinking...</div>}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Ask about cars, rates, chauffeur..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};