import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrackData } from './TimelinePanel';

interface TrackLineChartProps {
  track: TrackData;
  totalDuration: number;
}

export function TrackLineChart({ track, totalDuration }: TrackLineChartProps) {
  // Prepare data for recharts
  const chartData = track.data;

  return (
    <div className="h-full w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#888', fontSize: 10 }}
            axisLine={{ stroke: '#444' }}
            tickLine={{ stroke: '#444' }}
            width={30}
          />
          <Line
            type="monotone"
            dataKey="value1"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="value2"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="absolute top-2 right-2 flex gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span className="text-gray-400">数据1</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-500"></div>
          <span className="text-gray-400">数据2</span>
        </div>
      </div>
    </div>
  );
}
