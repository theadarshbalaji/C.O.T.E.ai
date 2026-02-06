import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    FileText,
    BrainCircuit,
    PenTool,
    ChevronRight,
    CheckCircle2,
    Users,
    MessageSquare,
    MoreVertical,
    Share2,
    Book,
    ClipboardList,
    Clock
} from 'lucide-react';
import { toast } from 'sonner';

import { useActivityTracker } from '../hooks/useActivityTracker';

interface MaterialViewProps {
    topic: any;
    onBack: () => void;
    userRole: 'teacher' | 'student';
    onUploadComplete?: (topicId: string, pdfUrl: string) => void;
}

export const MaterialView: React.FC<MaterialViewProps> = ({ topic, onBack, userRole, onUploadComplete }) => {
    const [view, setView] = useState<'stream' | 'classwork' | 'people' | 'reading' | 'flashcards' | 'assessment'>('stream');
    const { setIsStudying } = useActivityTracker();
    const [isSharing, setIsSharing] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Track time specifically when in a study-related view
        const studyViews = ['reading', 'flashcards', 'assessment'];
        if (studyViews.includes(view)) {
            setIsStudying(true);
        } else {
            setIsStudying(false);
        }

        // Cleanup on unmount
        return () => setIsStudying(false);
    }, [view, setIsStudying]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [assessmentStep, setAssessmentStep] = useState(0);
    const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

    const isTeacher = userRole === 'teacher';

    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev + 1) % topic.flashcards.length);
    };

    const handleAssessmentFinish = () => {
        setAssessmentScore(Math.floor(Math.random() * 40) + 60); // Mock score
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUploadComplete) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('files', file); // Backend expects 'files'
        formData.append('session_id', topic.id); // Backend uses 'session_id'

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // Use absolute URL to ensure it loads correctly from the static server
                const pdfUrl = `http://localhost:8000/uploads/${topic.id}/${data.uploaded_files[0]}`;
                onUploadComplete(topic.id, pdfUrl);
                toast.success('Material uploaded successfully!');
                setIsSharing(false);
            } else {
                toast.error('Upload failed');
            }
        } catch (error) {
            toast.error('Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    const tabs = [
        { id: 'stream', label: 'Stream' },
        { id: 'classwork', label: 'Classwork' },
        { id: 'people', label: 'People' },
        { id: 'grades', label: 'Grades' },
    ];

    return (
        <div className="h-full flex flex-col bg-background overflow-hidden">
            {/* Google Classroom Style Header */}
            <div className="px-6 py-2 border-b border-border flex items-center justify-between bg-card shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold truncate max-w-[200px]">{topic.title}</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{topic.description}</p>
                    </div>
                </div>

                <nav className="flex items-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id as any)}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${view === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-full">
                        <Users size={20} className="text-muted-foreground" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                        {userRole === 'teacher' ? 'T' : 'S'}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-muted/20">
                {view === 'stream' && (
                    <div className="max-w-5xl mx-auto p-6 space-y-6">
                        {/* Banner Section */}
                        <div className="relative h-60 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-blue-600 p-8 flex flex-col justify-end text-white shadow-lg">
                            <div className="absolute top-0 right-0 p-4">
                                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                            <h1 className="text-4xl font-black mb-2">{topic.title}</h1>
                            <p className="text-lg font-medium opacity-90">{topic.description}</p>
                            <div className="mt-4 flex items-center gap-2 text-sm font-bold">
                                <span className="bg-white/20 px-3 py-1 rounded-lg">Class code: {topic.enrollmentCode || 'XXXXX'}</span>
                                <Share2 size={16} className="cursor-pointer hover:scale-110 transition-transform" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Left Sidebar - Upcoming */}
                            <div className="hidden md:block space-y-4">
                                <div className="p-4 bg-card border border-border rounded-xl">
                                    <h3 className="text-xs font-black uppercase tracking-widest mb-4">Upcoming</h3>
                                    <p className="text-xs text-muted-foreground mb-4">No work due soon</p>
                                    <button className="text-xs font-bold text-primary hover:underline">View all</button>
                                </div>
                            </div>

                            {/* Main Feed */}
                            <div className="md:col-span-3 space-y-4">
                                {/* Share something box */}
                                {isTeacher ? (
                                    <div className={`bg-card border border-border rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${isSharing ? 'ring-2 ring-primary/20' : 'hover:shadow-md'}`}>
                                        {!isSharing ? (
                                            <div
                                                onClick={() => setIsSharing(true)}
                                                className="p-4 flex items-center gap-4 cursor-pointer"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                    T
                                                </div>
                                                <span className="text-sm text-muted-foreground font-medium">Share something with your class...</span>
                                            </div>
                                        ) : (
                                            <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <textarea
                                                    autoFocus
                                                    value={shareText}
                                                    onChange={(e) => setShareText(e.target.value)}
                                                    placeholder="Announce something to your class..."
                                                    className="w-full bg-secondary/30 border-none focus:ring-0 text-sm font-medium resize-none min-h-[100px] p-4 rounded-xl placeholder:text-muted-foreground"
                                                />

                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept=".pdf"
                                                    onChange={handleFileUpload}
                                                />

                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            disabled={isUploading}
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                                        >
                                                            <FileText size={16} /> {isUploading ? 'Uploading...' : 'Upload PDF'}
                                                        </button>
                                                        <button
                                                            onClick={() => toast.info('General messages feature coming soon!')}
                                                            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-blue-500/10 hover:text-blue-500 rounded-xl text-xs font-bold transition-all"
                                                        >
                                                            <MessageSquare size={16} /> Message
                                                        </button>
                                                        <button
                                                            onClick={() => toast.info('Assessment builder coming soon!')}
                                                            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-orange-500/10 hover:text-orange-500 rounded-xl text-xs font-bold transition-all"
                                                        >
                                                            <ClipboardList size={16} /> New Assessment
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => { setIsSharing(false); setShareText(''); }}
                                                            className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (shareText.trim()) {
                                                                    toast.success('Announcement posted!');
                                                                    setIsSharing(false);
                                                                    setShareText('');
                                                                } else {
                                                                    toast.error('Please enter a message first');
                                                                }
                                                            }}
                                                            className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                                        >
                                                            Post
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                                            S
                                        </div>
                                        <span className="text-sm text-muted-foreground font-medium">Share something with your class...</span>
                                    </div>
                                )}

                                {/* Material Post */}
                                {topic.pdfUrl && (
                                    <div
                                        onClick={() => setView('reading')}
                                        className="p-5 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                                                    <Book size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold group-hover:text-primary transition-colors">
                                                        Teacher posted a new material: {topic.title}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">Today</p>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-secondary rounded-full">
                                                <MoreVertical size={16} className="text-muted-foreground" />
                                            </button>
                                        </div>
                                        <div className="ml-16 p-4 border border-border rounded-xl bg-secondary/30 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="text-sm font-medium">{topic.title}.pdf</span>
                                            </div>
                                            <span className="text-xs font-bold text-primary">View Resource</span>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                {view === 'classwork' && (
                    <div className="max-w-4xl mx-auto p-12 space-y-12">
                        <div className="border-b-2 border-primary pb-4 flex items-center justify-between">
                            <h2 className="text-3xl font-black text-primary">Classwork</h2>
                            <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
                                <Clock size={16} /> View your work
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Book size={24} className="text-primary" /> Learning Materials
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => setView('reading')}
                                    className="w-full p-6 bg-card border border-border rounded-2xl flex items-center justify-between hover:border-primary transition-all group shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                            <FileText size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold group-hover:text-primary transition-colors">{topic.title} - Textbook PDF</p>
                                            <p className="text-xs text-muted-foreground font-medium">Reference Material</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-muted-foreground" />
                                </button>

                                <button
                                    onClick={() => setView('flashcards')}
                                    className="w-full p-6 bg-card border border-border rounded-2xl flex items-center justify-between hover:border-primary transition-all group shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                            <BrainCircuit size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold group-hover:text-primary transition-colors">Adaptive Flashcards</p>
                                            <p className="text-xs text-muted-foreground font-medium">Rapid Revision</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <ClipboardList size={24} className="text-blue-500" /> Evaluations
                            </h3>
                            <button
                                onClick={() => setView('assessment')}
                                className="w-full p-6 bg-card border border-border rounded-2xl flex items-center justify-between hover:border-blue-500 transition-all group shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <PenTool size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold group-hover:text-blue-500 transition-colors">Daily Progress Assessment</p>
                                        <p className="text-xs text-muted-foreground font-medium">Test your knowledge</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full">New</span>
                                    <ChevronRight size={20} className="text-muted-foreground" />
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'people' && (
                    <div className="max-w-3xl mx-auto p-12 space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-primary border-b-2 border-primary pb-4 flex items-center justify-between">
                                Teachers
                                <button className="p-2 hover:bg-secondary rounded-full">
                                    <Users size={20} />
                                </button>
                            </h2>
                            <div className="flex items-center gap-4 px-4 py-2">
                                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                                    T
                                </div>
                                <span className="font-bold underline decoration-primary decoration-2 underline-offset-4 cursor-pointer">Professor C.O.T.E</span>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-primary border-b-2 border-primary pb-4 flex items-center justify-between">
                                Classmates
                                <span className="text-sm font-bold text-muted-foreground">0 students</span>
                            </h2>
                            <p className="text-center py-12 text-muted-foreground font-medium italic">Your classmates will appear here once they join.</p>
                        </section>
                    </div>
                )}

                {view === 'reading' && (
                    <div className="h-full flex flex-col p-6 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={() => setView('stream')} className="flex items-center gap-2 text-primary font-bold hover:underline">
                                <ArrowLeft size={18} /> Back to Stream
                            </button>
                            <h3 className="text-xl font-black">{topic.title} - Reference Material</h3>
                            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/10">Download PDF</button>
                        </div>
                        <div className="flex-1 max-w-5xl mx-auto w-full bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                            <div className="bg-secondary p-4 flex items-center justify-between border-b border-border">
                                <span className="text-sm font-bold">{topic.title}.pdf</span>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-background rounded-lg text-muted-foreground"><Share2 size={16} /></button>
                                    <button className="p-2 hover:bg-background rounded-lg text-muted-foreground"><MoreVertical size={16} /></button>
                                </div>
                            </div>
                            <div className="flex-1 bg-muted/30 flex items-center justify-center p-12 text-center relative">
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="w-8 h-8 rounded bg-background border border-border" />
                                    <div className="w-8 h-8 rounded bg-background border border-border" />
                                </div>
                                <div className="space-y-4 max-w-xs">
                                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FileText size={40} />
                                    </div>
                                    <h4 className="text-2xl font-black">PDF Interactive Viewer</h4>
                                    <p className="text-muted-foreground font-medium">Ready for study. You can highlight text to ask the AI assistant questions.</p>
                                    <div className="flex gap-3 justify-center mt-6">
                                        <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm">Open in New Tab</button>
                                        <button className="px-6 py-2 border border-border hover:bg-accent rounded-lg font-bold text-sm">Print</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'flashcards' && (
                    <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500">
                        <button onClick={() => setView('classwork')} className="self-start flex items-center gap-2 text-primary font-bold hover:underline">
                            <ArrowLeft size={18} /> Back to Classwork
                        </button>
                        <div
                            className="w-full aspect-video perspective-1000 cursor-pointer group"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                {/* Front */}
                                <div className="absolute inset-0 bg-card border-2 border-primary/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center backface-hidden shadow-2xl group-hover:border-primary transition-colors">
                                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                                        <BrainCircuit size={32} />
                                    </div>
                                    <span className="text-primary text-xs font-black uppercase tracking-widest mb-4">Question</span>
                                    <h3 className="text-2xl font-bold">{topic.flashcards && topic.flashcards.length > 0 ? topic.flashcards[currentCardIndex].question : 'No flashcards available yet'}</h3>
                                    <p className="mt-8 text-muted-foreground text-sm uppercase font-bold tracking-tighter animate-bounce">Click to flip</p>
                                </div>
                                {/* Back */}
                                <div className="absolute inset-0 bg-primary text-primary-foreground rounded-3xl p-12 flex flex-col items-center justify-center text-center rotate-y-180 backface-hidden shadow-2xl shadow-primary/20">
                                    <span className="text-white/60 text-xs font-black uppercase tracking-widest mb-4">Answer</span>
                                    <p className="text-xl font-medium leading-relaxed">{topic.flashcards && topic.flashcards.length > 0 ? topic.flashcards[currentCardIndex].answer : 'Flashcards will be generated once PDF is indexed.'}</p>
                                </div>
                            </div>
                        </div>
                        {topic.flashcards && topic.flashcards.length > 0 && (
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-bold text-muted-foreground">{currentCardIndex + 1} / {topic.flashcards.length}</span>
                                <button
                                    onClick={handleNextCard}
                                    className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Next Card <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {view === 'assessment' && (
                    <div className="max-w-3xl mx-auto py-8 animate-in slide-in-from-right-4 duration-500">
                        <button onClick={() => setView('stream')} className="mb-6 flex items-center gap-2 text-primary font-bold hover:underline">
                            <ArrowLeft size={18} /> Back to Stream
                        </button>
                        {assessmentScore !== null ? (
                            <div className="bg-card border-2 border-border rounded-3xl p-12 text-center space-y-6 shadow-2xl">
                                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${assessmentScore >= 80 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-3xl font-black">Assessment Complete!</h3>
                                <p className="text-6xl font-black text-primary">{assessmentScore}%</p>
                                <p className="text-muted-foreground">Great job! Your performance has been recorded.</p>
                                <button
                                    onClick={() => { setAssessmentScore(null); setAssessmentStep(0); }}
                                    className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold hover:bg-primary/90"
                                >
                                    Retake Assessment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black">Daily Quiz: {topic.title}</h3>
                                    <span className="px-3 py-1 bg-secondary rounded-full text-xs font-bold text-muted-foreground">Question {assessmentStep + 1} of {topic.questions?.length || 0}</span>
                                </div>
                                <div className="p-8 bg-card border border-border rounded-3xl shadow-sm">
                                    <p className="text-xl font-bold mb-8">
                                        {topic.questions && topic.questions.length > 0
                                            ? topic.questions[assessmentStep].question
                                            : "Questions are being generated from your document..."}
                                    </p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {topic.questions && topic.questions[assessmentStep]?.options.map((option: string, i: number) => (
                                            <button
                                                key={i}
                                                className="w-full p-4 text-left bg-secondary hover:bg-primary/10 hover:border-primary border border-transparent rounded-2xl transition-all font-medium flex items-center justify-between group"
                                            >
                                                {option}
                                                <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary"></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {topic.questions && topic.questions.length > 0 && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                if (assessmentStep < topic.questions.length - 1) setAssessmentStep(prev => prev + 1);
                                                else handleAssessmentFinish();
                                            }}
                                            className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all text-lg"
                                        >
                                            {assessmentStep === topic.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
