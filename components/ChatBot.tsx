
import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse, MessageHistory } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init-1', text: 'Bienvenido a SEARMO. Soy Yeiya. Es un honor sincronizar contigo hoy. ¿Con quién tengo el placer de hablar?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    const newUserMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: m.text }]
    }));

    try {
      // Use client-side service directly
      const response = await generateAIResponse(userText, history);

      if (response && response.text) {
        const newBotMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'bot'
        };
        setMessages(prev => [...prev, newBotMsg]);
      } else {
        throw new Error('Sin respuesta del agente');
      }
    } catch (error) {
      console.error('Error in chatbot:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, mi conexión neuronal ha fallado. Por favor, intenta de nuevo.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMsg]);
    }

    setIsTyping(false);
  };

  return (
    <div className="font-mono">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-10 right-10 z-[140]"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group relative w-16 h-16 flex items-center justify-center bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all duration-700 shadow-[0_0_50px_rgba(99,102,241,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-2xl animate-pulse" />
              {/* Indicador de energía minimalista en lugar del robot */}
              <div className="relative z-10 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white] animate-ping" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(20px)' }}
            className="fixed bottom-6 right-6 md:right-12 w-[calc(100vw-3rem)] md:w-[450px] h-[700px] max-h-[85vh] z-[150] flex flex-col"
          >
            <div className="relative w-full h-full bg-[#050505]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col">

              {/* Luxury Header */}
              <div className="h-24 px-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-black/40">
                    <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full shadow-[0_0_10px_#6366f1]" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-syncopate font-bold text-white tracking-[0.2em] uppercase">YEIYA CORE</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                      <p className="text-[7px] text-indigo-400 font-mono tracking-widest uppercase">2.5-FLASH ENGINE</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/5 text-white/20 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Message flow */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative">
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative max-w-[85%] px-5 py-4 rounded-2xl text-[12px] leading-relaxed tracking-wide whitespace-pre-wrap ${msg.sender === 'user'
                      ? 'bg-white/5 text-white border border-white/10 rounded-tr-none shadow-lg'
                      : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-white/90 border border-indigo-500/20 rounded-tl-none shadow-[0_10px_30px_rgba(99,102,241,0.05)]'
                      }`}>
                      {msg.sender === 'bot' ? (
                        <div dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-indigo-400 hover:underline">$1</a>')
                            .replace(/\n/g, '<br/>')
                        }} />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-full flex gap-2 items-center">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Terminal Style Input */}
              <div className="p-6 bg-black/40 border-t border-white/5">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Sincronizar frecuencia..."
                    className="w-full bg-white/[0.03] text-white text-[11px] px-6 py-4 rounded-xl border border-white/10 outline-none focus:border-indigo-500/30 transition-all placeholder:text-white/5 tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-black rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-500 shadow-xl"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <span className="text-[6px] font-syncopate text-white/10 tracking-[0.4em] uppercase">Powered by SEARMO CORE v2.5-FLASH</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 10px; }
      `}} />
    </div>
  );
};
