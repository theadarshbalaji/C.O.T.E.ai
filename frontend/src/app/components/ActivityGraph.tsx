import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ActivityGraphProps {
    logs: { day: string; minutes: number }[];
}

export const ActivityGraph: React.FC<ActivityGraphProps> = ({ logs }) => {
    const maxMinutes = Math.max(...logs.map(l => l.minutes), 60);

    return (
        <div className="p-6 bg-card border border-border rounded-3xl space-y-6 shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-black text-lg">Activity Analysis</h4>
                    <p className="text-xs text-muted-foreground font-medium">Your study patterns this week</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <BarChart3 size={20} />
                </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-40">
                {logs.map((log, i) => {
                    const heightPercent = (log.minutes / maxMinutes) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full flex-1 flex flex-col justify-end">
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 whitespace-nowrap">
                                    {log.minutes}m
                                </div>

                                <div
                                    className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all duration-700 ease-out animate-in slide-in-from-bottom"
                                    style={{
                                        height: `${heightPercent}%`,
                                        animationDelay: `${i * 100}ms`
                                    }}
                                />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                                {log.day}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Active Time</p>
                    <p className="text-xl font-black">{Math.round(logs.reduce((acc, log) => acc + log.minutes, 0) / 60)}h {logs.reduce((acc, log) => acc + log.minutes, 0) % 60}m</p>
                </div>
            </div>
        </div>
    );
};
