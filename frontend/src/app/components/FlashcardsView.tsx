import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, BrainCircuit, Sparkles, Loader2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Flashcard {
    topic: string;
    summary: string;
}

interface FlashcardsViewProps {
    sessionId: string;
    onBack: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ sessionId, onBack }) => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/flashcards/${sessionId}`);
                const data = await res.json();
                setFlashcards(data);
            } catch (err) {
                console.error("Failed to fetch flashcards", err);
                toast.error("Failed to load flashcards");
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcards();
    }, [sessionId]);

    const handleNext = async () => {
        if (currentIndex < flashcards.length - 1) {
            // Award 20 XP
            try {
                await fetch('http://localhost:8000/api/add_xp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId, amount: 20 })
                });
                toast.success("+20 XP for learning!", {
                    icon: <Trophy size={16} className="text-yellow-500" />,
                    duration: 2000
                });
            } catch (err) {
                console.error("Failed to add XP", err);
            }

            setCurrentIndex(prev => prev + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-xl font-black animate-pulse">AI is summarizing your class materials...</p>
            </div>
        );
    }

    if (flashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center p-8">
                <BrainCircuit size={64} className="text-muted-foreground opacity-20" />
                <div className="space-y-2">
                    <h3 className="text-2xl font-black">No topics found yet</h3>
                    <p className="text-muted-foreground">Make sure you have uploaded classroom materials first!</p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg"
                >
                    <ArrowLeft size={20} /> Back to Hub
                </button>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-primary font-black hover:underline group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-500/20 text-xs font-black uppercase tracking-widest">
                    <Sparkles size={14} /> AI Summary Revision
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="w-full max-w-2xl bg-card border-2 border-primary/20 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden group hover:border-primary/40 transition-colors"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/10 transition-colors" />

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">Topic {currentIndex + 1} of {flashcards.length}</span>
                                <h2 className="text-4xl font-black tracking-tight">{currentCard.topic}</h2>
                            </div>

                            <div
                                className="prose prose-sm dark:prose-invert max-w-none text-lg leading-relaxed text-foreground/80 font-medium"
                                dangerouslySetInnerHTML={{
                                    __html: currentCard.summary
                                        .replace(/\*\*(.*?)\*\*/g, '<b class="text-primary font-black">$1</b>')
                                        .replace(/\n\s*-\s*/g, '<br/>• ')
                                }}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        {flashcards.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted'}`}
                            />
                        ))}
                    </div>

                    {currentIndex < flashcards.length - 1 && (
                        <button
                            onClick={handleNext}
                            className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 group"
                        >
                            Next Topic <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}

                    {currentIndex === flashcards.length - 1 && (
                        <button
                            onClick={onBack}
                            className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95"
                        >
                            Finish Revision <Trophy size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
