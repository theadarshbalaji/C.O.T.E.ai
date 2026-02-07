import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowLeft, GraduationCap, ChevronRight } from 'lucide-react';
import { MaterialView } from './MaterialView';
import { FlashcardsView } from './FlashcardsView';

interface MaterialsHubProps {
    topic: any;
    onBack: () => void;
    userRole: 'teacher' | 'student';
    onUploadComplete?: (topicId: string, pdfUrl: string) => void;
}

export const MaterialsHub: React.FC<MaterialsHubProps> = ({ topic, onBack, userRole, onUploadComplete }) => {
    const [view, setView] = useState<'hub' | 'material' | 'flashcards'>('hub');

    if (userRole === 'teacher') {
        return (
            <MaterialView
                topic={topic}
                onBack={onBack}
                userRole={userRole}
                onUploadComplete={onUploadComplete}
            />
        );
    }

    if (view === 'material') {
        return (
            <MaterialView
                topic={topic}
                onBack={() => setView('hub')}
                userRole={userRole}
                onUploadComplete={onUploadComplete}
            />
        );
    }

    if (view === 'flashcards') {
        return (
            <FlashcardsView
                sessionId={topic.id}
                onBack={() => setView('hub')}
            />
        );
    }

    return (
        <div className="h-full flex flex-col bg-background animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="px-8 py-8 border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onBack}
                            className="p-3 hover:bg-secondary rounded-2xl transition-all hover:scale-110 active:scale-90"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">{topic.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                                    Classroom ID: {topic.id}
                                </span>
                                <span className="text-muted-foreground text-xs font-bold">•</span>
                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-tighter">{topic.description}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enrolled as</p>
                            <p className="font-bold text-sm">Undergraduate Student</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            S
                        </div>
                    </div>
                </div>
            </div>

            {/* Hub Options */}
            <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
                <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Course Material Button */}
                    <button
                        onClick={() => setView('material')}
                        className="group relative p-10 bg-card border-2 border-border rounded-[2.5rem] hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col items-center text-center space-y-6 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />

                        <div className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:rotate-6">
                            <BookOpen size={48} />
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-3xl font-black tracking-tight">Browse Material</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Access your classroom stream, view announcements, and download PDFs.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm pt-4">
                            Go to Stream <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* AI Flashcards Button */}
                    <button
                        onClick={() => setView('flashcards')}
                        className="group relative p-10 bg-card border-2 border-border rounded-[2.5rem] hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 flex flex-col items-center text-center space-y-6 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />

                        <div className="w-24 h-24 bg-purple-500/10 text-purple-500 rounded-3xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                            <Sparkles size={48} />
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-3xl font-black tracking-tight">AI Revision</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Quick topic-wise summaries for fast recall. Earn **20 XP** per card!
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-purple-500 font-black uppercase tracking-widest text-sm pt-4">
                            Start Flashcards <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom Info Banner */}
            <div className="p-6 text-center text-muted-foreground/60">
                <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <GraduationCap size={16} /> Maximize your potential with AI-assisted learning.
                </div>
            </div>
        </div>
    );
};
