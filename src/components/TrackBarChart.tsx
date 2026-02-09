import React from 'react';
import { BarChart, Bar, ResponsiveContainer, YAxis } from 'recharts';
import { TrackData } from './TimelinePanel';

interface TrackBarChartProps {
  track: TrackData;
  totalDuration: number;
}

export function TrackBarChart({ track, totalDuration }: TrackBarChartProps) {
  // Prepare data for recharts
  const chartData = track.data;

  return (
    <div className="h-full w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#888', fontSize: 10 }}
            axisLine={{ stroke: '#444' }}
            tickLine={{ stroke: '#444' }}
            width={30}
          />
          <Bar
            dataKey="value1"
            fill="#f59e0b"
            isAnimationActive={false}
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="value2"
            fill="#ef4444"
            isAnimationActive={false}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="absolute top-2 right-2 flex gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
          <span className="text-gray-400">检查1</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span className="text-gray-400">检查2</span>
        </div>
      </div>
    </div>
  );
}
