import React, { useState, useRef, useEffect } from 'react';
import { generateResponse } from '../services/geminiService';
import { ChatMessage, AiMode, AspectRatio, ImageSize } from '../types';
import { Sparkles, Send, Bot, User, Image as ImageIcon, Zap, Brain, Settings2, X } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Saudações, viajante! Sou o Oráculo do ReinadoRPG. Posso ajudar com informações, criar pinturas mágicas ou responder suas dúvidas mais complexas.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings State
  const [mode, setMode] = useState<AiMode>(AiMode.STANDARD);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse({
        prompt: userMsg.text || '',
        mode,
        imageOptions: mode === AiMode.CREATIVE ? { aspectRatio, imageSize } : undefined
      });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        image: response.image
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Houve uma falha na conexão mágica."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-accent text-dark-bg rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-accent-light animate-bounce"
      >
        <Sparkles size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] flex flex-col bg-dark-bg/95 backdrop-blur-xl border border-accent/30 rounded-2xl shadow-2xl overflow-hidden font-cinzel">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-dark to-accent p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Bot className="text-dark-darker" />
            <h3 className="font-bold text-dark-darker">Oráculo AI</h3>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`p-1 rounded hover:bg-black/10 transition-colors ${showSettings ? 'bg-black/20' : ''}`}
            >
                <Settings2 size={20} className="text-dark-darker" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-black/10 transition-colors">
                <X size={20} className="text-dark-darker" />
            </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-black/20 p-4 border-b border-accent/20 space-y-4 animate-fade-in-up">
            <div>
                <label className="text-xs text-accent-light mb-2 block uppercase tracking-wider">Modo de Inteligência</label>
                <div className="grid grid-cols-4 gap-2">
                    <button 
                        onClick={() => setMode(AiMode.STANDARD)}
                        className={`p-2 rounded text-xs flex flex-col items-center gap-1 border ${mode === AiMode.STANDARD ? 'bg-accent text-dark-bg border-accent' : 'border-accent/30 text-medieval-muted hover:border-accent'}`}
                    >
                        <Bot size={16} /> Padrão
                    </button>
                    <button 
                        onClick={() => setMode(AiMode.FAST)}
                        className={`p-2 rounded text-xs flex flex-col items-center gap-1 border ${mode === AiMode.FAST ? 'bg-accent text-dark-bg border-accent' : 'border-accent/30 text-medieval-muted hover:border-accent'}`}
                    >
                        <Zap size={16} /> Rápido
                    </button>
                    <button 
                        onClick={() => setMode(AiMode.THINKING)}
                        className={`p-2 rounded text-xs flex flex-col items-center gap-1 border ${mode === AiMode.THINKING ? 'bg-accent text-dark-bg border-accent' : 'border-accent/30 text-medieval-muted hover:border-accent'}`}
                    >
                        <Brain size={16} /> Pensar
                    </button>
                    <button 
                        onClick={() => setMode(AiMode.CREATIVE)}
                        className={`p-2 rounded text-xs flex flex-col items-center gap-1 border ${mode === AiMode.CREATIVE ? 'bg-accent text-dark-bg border-accent' : 'border-accent/30 text-medieval-muted hover:border-accent'}`}
                    >
                        <ImageIcon size={16} /> Imagem
                    </button>
                </div>
            </div>

            {mode === AiMode.CREATIVE && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-accent-light mb-1 block">Tamanho</label>
                        <select 
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value as ImageSize)}
                            className="w-full bg-dark-darker text-medieval-text text-xs p-2 rounded border border-accent/30 focus:border-accent outline-none"
                        >
                            <option value="1K">1K</option>
                            <option value="2K">2K</option>
                            <option value="4K">4K</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-accent-light mb-1 block">Proporção</label>
                        <select 
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                            className="w-full bg-dark-darker text-medieval-text text-xs p-2 rounded border border-accent/30 focus:border-accent outline-none"
                        >
                            {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-accent/20 border border-accent/30 text-medieval-text rounded-tr-none' : 'bg-black/40 border border-accent/10 text-medieval-muted rounded-tl-none'}`}>
                    {msg.image && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-accent/30">
                            <img src={msg.image} alt="Generated content" className="w-full h-auto" />
                        </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-black/40 p-3 rounded-lg rounded-tl-none border border-accent/10">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                        <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                        <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
                    </div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-black/30 border-t border-accent/20">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={mode === AiMode.CREATIVE ? "Descreva a imagem..." : "Pergunte ao Oráculo..."}
                className="flex-1 bg-dark-darker/50 border border-accent/20 rounded-lg px-3 py-2 text-sm text-medieval-text focus:outline-none focus:border-accent/50 placeholder:text-medieval-muted/50"
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-accent text-dark-bg rounded-lg hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send size={18} />
            </button>
        </div>
        <div className="text-[10px] text-center text-medieval-muted/40 mt-1 uppercase tracking-widest">
            Gemini AI Powered • {mode} Mode
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;