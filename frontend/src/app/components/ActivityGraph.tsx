import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ActivityGraphProps {
    logs: { day: string; minutes: number }[];
}

export const ActivityGraph: React.FC<ActivityGraphProps> = ({ logs }) => {
    const maxMinutes = Math.max(...logs.map(l => l.minutes), 60);
    const gridLines = [15, 30, 45, 60];

    return (
        <div className="p-6 bg-card border border-border rounded-[2rem] space-y-8 shadow-xl shadow-primary/5 relative overflow-hidden group/card">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 pointer-events-none group-hover/card:bg-primary/10 transition-colors" />

            <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <h4 className="font-black text-xl tracking-tight">Active Learning Time</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">Weekly Progress Analytics</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                    <BarChart3 size={24} />
                </div>
            </div>

            <div className="relative h-48 mt-4">
                {/* Grid Lines */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none">
                    {gridLines.reverse().map((min) => (
                        <div key={min} className="w-full border-t border-border/50 flex items-center">
                            <span className="text-[8px] font-black text-muted-foreground/40 absolute -left-2 uppercase tracking-tighter">
                                {min}m
                            </span>
                        </div>
                    ))}
                    <div className="w-full border-t-2 border-border" /> {/* Baseline */}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between gap-3 px-2">
                    {logs.map((log, i) => {
                        const heightPercent = Math.min((log.minutes / maxMinutes) * 100, 100);
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full justify-end">
                                <div className="relative w-full flex-1 flex flex-col justify-end">
                                    {/* Enhanced Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-black rounded-xl opacity-0 scale-50 group-hover/bar:opacity-100 group-hover/bar:scale-100 transition-all pointer-events-none z-20 shadow-xl shadow-primary/30 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        {log.minutes} MINS
                                    </div>

                                    {/* The Bar */}
                                    <div
                                        className="w-full bg-yellow-400 rounded-full transition-all duration-700 ease-out animate-in slide-in-from-bottom hover:scale-x-105 hover:brightness-110 shadow-xl shadow-yellow-500/20 group-hover/bar:shadow-yellow-500/40 border border-white/20"
                                        style={{
                                            height: `${Math.max(heightPercent, 8)}%`, // Minimum height of 8% for visibility
                                            animationDelay: `${i * 100}ms`
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground group-hover/bar:text-primary transition-colors uppercase tracking-widest">
                                    {log.day.slice(0, 3)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary rounded-2xl">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Effort</p>
                        <p className="text-2xl font-black text-yellow-500 drop-shadow-sm">
                            {Math.floor(logs.reduce((acc, log) => acc + log.minutes, 0) / 60)}h {logs.reduce((acc, log) => acc + log.minutes, 0) % 60}m
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Consistency</p>
                    <div className="flex gap-1 justify-end">
                        {logs.map((log, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${log.minutes > 0 ? 'bg-primary shadow-sm shadow-primary/50' : 'bg-muted'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
