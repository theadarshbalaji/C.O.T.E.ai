import React, { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User
} from 'lucide-react';

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<'english' | 'hindi' | 'telugu' | null>(null);
    const [messages, setMessages] = useState([
        { id: '1', role: 'assistant', content: 'Hi! I\'m your Study Assistant Bot. Please select your preferred language to begin!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleLanguageSelect = (lang: 'english' | 'hindi' | 'telugu') => {
        setLanguage(lang);
        const welcomeMsg = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Great! You've selected **${lang.charAt(0).toUpperCase() + lang.slice(1)}**. I will now help you with your doubts in a mix of ${lang} and English. Ask me anything!`
        };
        setMessages(prev => [...prev, welcomeMsg]);
    };

    const handleSend = async () => {
        if (!input.trim() || !language) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch(`http://localhost:8000/ask?session_id=default&query=${encodeURIComponent(input)}&language=${language}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to get response from assistant');
            }

            const data = await response.json();

            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);

        } catch (error: any) {
            console.error('Chat error:', error);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting to the brain right now. Please make sure the backend is running!"
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsTyping(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <MessageCircle size={28} />
            </button>

            <div
                className={`fixed bottom-6 right-6 w-[400px] h-[600px] bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}
            >
                <header className="px-6 py-4 bg-primary text-primary-foreground flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold leading-tight">Doubt Assistant</h3>
                            <p className="text-[10px] opacity-70 uppercase tracking-widest font-black">Online Now</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-6 bg-transparent">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border'}`}>
                                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-white/10 border border-white/10 rounded-tl-none font-medium' : 'bg-primary text-primary-foreground rounded-tr-none font-semibold'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {!language && (
                        <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Select Language</p>
                            <div className="grid grid-cols-3 gap-2">
                                {(['english', 'hindi', 'telugu'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className="py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 rounded-xl text-xs font-black uppercase tracking-tighter transition-all"
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-transparent">
                    <div className={`flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 px-4 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary ${!language ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="text"
                            value={input}
                            disabled={!language}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={language ? "Ask a doubt..." : "Select language first..."}
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium py-2 disabled:cursor-not-allowed"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || !language}
                            className="p-2 bg-primary text-primary-foreground rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium">Powered by Study Assistant AI</p>
                </div>
            </div>
        </>
    );
};
