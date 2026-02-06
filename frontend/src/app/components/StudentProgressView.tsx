import React, { useState } from 'react';
import {
    Users,
    ChevronRight,
    ArrowLeft,
    GraduationCap,
    Clock,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { Topic } from '../App';

interface StudentProgressViewProps {
    onCreateClass: (name: string, batch?: string, grade?: string) => string;
    topics: Topic[];
}

const MOCK_STUDENTS = [
    { id: '1', name: 'Alex Johnson', progress: 85, lastActive: '2 mins ago', status: 'Active', hours: 12.5 },
    { id: '2', name: 'Sarah Williams', progress: 72, lastActive: '15 mins ago', status: 'Active', hours: 8.2 },
    { id: '3', name: 'Michael Chen', progress: 94, lastActive: '1 hour ago', status: 'Idle', hours: 15.6 },
    { id: '4', name: 'Emily Davis', progress: 45, lastActive: '3 hours ago', status: 'Idle', hours: 4.8 },
    { id: '5', name: 'David Miller', progress: 100, lastActive: 'Yesterday', status: 'Completed', hours: 22.1 },
];

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({ onCreateClass, topics }) => {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [createdCode, setCreatedCode] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        subjectName: '',
        batchYear: '',
        grade: ''
    });

    const handleCreateClass = (e: React.FormEvent) => {
        e.preventDefault();
        const code = onCreateClass(formData.subjectName, formData.batchYear, formData.grade);
        setCreatedCode(code);
    };

    const resetForm = () => {
        setIsCreatingClass(false);
        setCreatedCode(null);
        setFormData({ subjectName: '', batchYear: '', grade: '' });
    };

    const selectedClass = selectedClassId ? topics.find(t => t.id === selectedClassId) : null;

    if (isCreatingClass) {
        return (
            <div className="p-6 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="space-y-1">
                    <button
                        onClick={resetForm}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-2"
                    >
                        <ArrowLeft size={16} /> Back to Classes
                    </button>
                    <h2 className="text-3xl font-black">Start New Class</h2>
                    <p className="text-muted-foreground">Fill in the details to create a new learning environment.</p>
                </header>

                <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                    {!createdCode ? (
                        <form onSubmit={handleCreateClass} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Subject Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Advanced Astrophysics"
                                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                                    value={formData.subjectName}
                                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Batch Year</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. 2024-25"
                                        className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                                        value={formData.batchYear}
                                        onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Grade / Level</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Undergraduate"
                                        className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                            >
                                Generate Enrollment Link
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Users size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black">Class Created Successfully!</h3>
                                <p className="text-muted-foreground">Share the enrollment code below with your students.</p>
                            </div>

                            <div className="p-4 bg-secondary/50 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-4">
                                <code className="text-3xl font-black text-primary tracking-[0.2em]">{createdCode}</code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(createdCode || '');
                                        toast.success('Code copied!');
                                    }}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shrink-0"
                                >
                                    Copy Code
                                </button>
                            </div>

                            <button
                                onClick={resetForm}
                                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (selectedClass) {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="flex items-center justify-between">
                    <div className="space-y-1">
                        <button
                            onClick={() => setSelectedClassId(null)}
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-2"
                        >
                            <ArrowLeft size={16} /> Back to Classes
                        </button>
                        <h2 className="text-3xl font-black">{selectedClass.title}</h2>
                        <p className="text-muted-foreground">Detailed student performance and engagement metrics.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold hover:bg-accent transition-all">
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-card border border-border rounded-3xl space-y-2">
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Average Progress</p>
                        <p className="text-4xl font-black text-primary">79.2%</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-3xl space-y-2">
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Active Students</p>
                        <p className="text-4xl font-black text-green-500">5 / 5</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-3xl space-y-2">
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Total Active Time</p>
                        <p className="text-4xl font-black text-orange-500">63.2h</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-3xl space-y-2">
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Status</p>
                        <p className="text-4xl font-black text-blue-500">Active</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Student Name</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Progress</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Active Hours</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Last Active</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {MOCK_STUDENTS.map(student => (
                                <tr key={student.id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black uppercase">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-bold">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1.5 w-40">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground">
                                                <span>Progress</span>
                                                <span>{student.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500"
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-orange-500">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            {student.hours}h
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                        {student.lastActive}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                                student.status === 'Completed' ? 'bg-primary/10 text-primary' :
                                                    'bg-muted text-muted-foreground'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 className="text-3xl font-black">Your Classes</h2>
                <p className="text-muted-foreground">Overview of all active classes and their overall learning progress.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((cls) => (
                    <div
                        key={cls.id}
                        onClick={() => setSelectedClassId(cls.id)}
                        className="group p-6 bg-card border border-border rounded-3xl hover:border-primary transition-all cursor-pointer hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <GraduationCap size={30} />
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1.5 rounded-xl">
                                <Users size={14} /> 0 Students
                            </span>
                        </div>

                        <div className="flex-1 space-y-2 mb-6 text-left">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{cls.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-1"><Clock size={14} /> 0 active today</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Progress</p>
                                    <p className="text-2xl font-black">0%</p>
                                </div>
                                <div className="text-primary group-hover:translate-x-1 transition-transform">
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500 group-hover:bg-blue-500"
                                    style={{ width: `0%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Class Button */}
                <button
                    onClick={() => setIsCreatingClass(true)}
                    className="p-6 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary transition-all group min-h-[300px]"
                >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Users size={32} />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">Start New Class</p>
                        <p className="text-sm opacity-70">Expand your teaching reach</p>
                    </div>
                </button>
            </div>
        </div>
    );
};
