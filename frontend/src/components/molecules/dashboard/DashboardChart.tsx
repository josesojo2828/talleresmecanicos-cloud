"use client";

interface ChartDataPoint {
    date: string;
    count: number;
}

interface DashboardChartProps {
    data: ChartDataPoint[];
}

export const DashboardChart = ({ data }: DashboardChartProps) => {
    if (!data || data.length === 0) return (
        <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
            Sin datos suficientes para el gráfico
        </div>
    );

    const maxCount = Math.max(...data.map(d => d.count), 5);
    const height = 200;
    const width = 600;
    const padding = 20;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
        const y = height - padding - (d.count / maxCount) * chartHeight;
        return `${x},${y}`;
    }).join(" ");

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return (
        <div className="w-full h-full relative group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-xl overflow-visible">
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Grid Lines (Base) */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f5f9" strokeWidth="2" />
                
                {/* Area Background */}
                <polyline points={areaPoints} fill="url(#chartGradient)" />
                
                {/* The Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-1000 ease-in-out"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
                    const y = height - padding - (d.count / maxCount) * chartHeight;
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="white"
                            stroke="#10b981"
                            strokeWidth="2"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    );
                })}
            </svg>
            <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                <span>{data[0]?.date}</span>
                <span>Hoy</span>
            </div>
        </div>
    );
};
