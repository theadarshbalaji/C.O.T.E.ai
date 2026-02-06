import React, { useState, useRef } from 'react';
import { X, Target, Zap, Upload, FileText, ArrowRight } from 'lucide-react';
import { Topic } from '../App';
import { toast } from 'sonner';

interface TeacherReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    topics: Topic[];
}

export const TeacherReviewModal: React.FC<TeacherReviewModalProps> = ({
    isOpen,
    onClose,
    topics
}) => {
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [assessmentFocus, setAssessmentFocus] = useState('');
    const [studentGaps, setStudentGaps] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            toast.error('Please select a valid PDF file for review');
        }
    };

    const handleSubmit = async () => {
        if (!selectedTopicId || (!assessmentFocus && !studentGaps && !selectedFile)) {
            toast.error('Please provide some feedback or upload a review document');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('session_id', selectedTopicId);
        formData.append('assessment_focus', assessmentFocus);
        formData.append('student_gaps', studentGaps);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            toast.loading('Updating AI behavior...', { id: 'teacher-review' });
            const response = await fetch('http://localhost:8000/upload_review', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.success('AI has been updated with your review!', { id: 'teacher-review' });
                onClose();
            } else {
                throw new Error('Failed to send review');
            }
        } catch (error) {
            toast.error('Failed to update AI assistant', { id: 'teacher-review' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <header className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black">Send Review to AI</h2>
                        <p className="text-sm text-muted-foreground">Guide how the AI interacts with your students.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </header>

                <div className="space-y-6">
                    {/* Class Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Select Class</label>
                        <select
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium appearance-none"
                        >
                            <option value="">Choose a class...</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Assessment Focus */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Assessment Style & Focus</label>
                        <div className="relative">
                            <Target className="absolute left-4 top-4 text-muted-foreground" size={20} />
                            <textarea
                                placeholder="e.g. Focus on 'Application' level questions..."
                                className="w-full pl-12 pr-5 py-4 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium min-h-[80px] resize-none"
                                value={assessmentFocus}
                                onChange={(e) => setAssessmentFocus(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Student Gaps */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Knowledge Gaps</label>
                        <div className="relative">
                            <Zap className="absolute left-4 top-4 text-muted-foreground" size={20} />
                            <textarea
                                placeholder="e.g. Students are struggling with 'Pointers'..."
                                className="w-full pl-12 pr-5 py-4 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium min-h-[80px] resize-none"
                                value={studentGaps}
                                onChange={(e) => setStudentGaps(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* File Upload Area */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Upload Review Document (Optional)</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${selectedFile
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary hover:bg-primary/5'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileSelect}
                            />
                            <div className="flex items-center justify-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedFile ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {selectedFile ? <FileText size={20} /> : <Upload size={20} />}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">
                                        {selectedFile ? selectedFile.name : 'Click to upload Review PDF'}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                        {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF supported'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="pt-4 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-secondary text-secondary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary/80 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedTopicId || (!assessmentFocus && !studentGaps && !selectedFile)}
                        className="flex-[2] py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? 'Updating AI...' : 'Update AI Assistant'}
                        {!isSubmitting && <ArrowRight size={18} />}
                    </button>
                </footer>
            </div>
        </div>
    );
};
