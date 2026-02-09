import React, { useState } from 'react';
import { TimelineTrack } from './TimelineTrack';
import { TimelineControls } from './TimelineControls';
import { useTheme } from '../contexts/ThemeContext';

export interface TrackData {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'buttons';
  highlightTime: number; // in seconds
  data: {
    time: number;
    value1: number;
    value2: number;
  }[];
  buttons?: {
    time: number;
    label: string;
  }[];
}

interface TimelinePanelProps {
  currentTime: number;
  onTimeChange: (time: number) => void;
  timeRange: [number, number];
  onTimeRangeChange: (range: [number, number]) => void;
}

export function TimelinePanel({
  currentTime,
  onTimeChange,
  timeRange,
  onTimeRangeChange
}: TimelinePanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const totalDuration = 30; // 30 seconds total
  const timelineWidth = 2000; // Extended width for scrolling

  // Mock data for different tracks with more realistic patterns
  const [tracks] = useState<TrackData[]>([
    {
      id: 'track1',
      name: 'Checker Result',
      type: 'bar',
      highlightTime: 8.5,
      data: Array.from({ length: 31 }, (_, i) => ({
        time: i,
        value1: Math.abs(Math.sin(i * 0.3) * 60 + 30 + Math.random() * 10),
        value2: Math.abs(Math.cos(i * 0.4) * 50 + 35 + Math.random() * 8),
      })),
    },
    {
      id: 'track2',
      name: 'GT Speed',
      type: 'line',
      highlightTime: 15.2,
      data: Array.from({ length: 31 }, (_, i) => ({
        time: i,
        value1: 50 + Math.sin(i * 0.5) * 25 + Math.random() * 5,
        value2: 55 + Math.cos(i * 0.4) * 20 + Math.random() * 4,
      })),
    },
    {
      id: 'track3',
      name: 'Control Actions',
      type: 'buttons',
      highlightTime: 12,
      data: [],
      buttons: [
        { time: 3.5, label: 'Start' },
        { time: 8.5, label: 'Check A' },
        { time: 12, label: 'Warning' },
        { time: 18.5, label: 'Check B' },
        { time: 25, label: 'Complete' },
      ],
    },
    {
      id: 'track4',
      name: 'Performance',
      type: 'line',
      highlightTime: 22.8,
      data: Array.from({ length: 31 }, (_, i) => ({
        time: i,
        value1: 40 + Math.sin(i * 0.6) * 15 + Math.random() * 8,
        value2: 45 + Math.cos(i * 0.5) * 18 + Math.random() * 6,
      })),
    },
  ]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    onTimeChange(timeRange[0]);
    setIsPlaying(false);
  };

  // Simulate playback
  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        onTimeChange((prev) => {
          if (prev >= timeRange[1]) {
            setIsPlaying(false);
            return timeRange[1];
          }
          return prev + 0.1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, timeRange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollLeft = e.currentTarget.scrollLeft;
    setScrollLeft(newScrollLeft);
  };

  return (
    <div className={`h-[400px] ${isDark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-white border-gray-300'} border-t flex flex-col`}>
      {/* Timeline header */}
      <div className={`h-9 ${isDark ? 'bg-[#252525] border-gray-700/50' : 'bg-gray-50 border-gray-200'} border-b flex items-center px-3 gap-3 flex-shrink-0`}>
        <div className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
          TIMELINE
        </div>
        <div className="flex-1"></div>
        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          {tracks.length} 轨道
        </div>
      </div>

      {/* Timeline tracks container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {tracks.map((track) => (
          <TimelineTrack
            key={track.id}
            track={track}
            currentTime={currentTime}
            totalDuration={totalDuration}
            scrollLeft={scrollLeft}
            onScroll={handleScroll}
            timelineWidth={timelineWidth}
          />
        ))}
      </div>

      {/* Timeline ruler */}
      <div className={`h-7 ${isDark ? 'bg-[#252525] border-gray-700/50' : 'bg-gray-50 border-gray-200'} border-t relative flex-shrink-0 overflow-hidden`}>
        <div
          className="absolute inset-0 overflow-x-auto overflow-y-hidden scrollbar-thin"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="h-full flex" style={{ width: `${timelineWidth}px` }}>
            {Array.from({ length: totalDuration + 1 }, (_, i) => (
              <div
                key={i}
                className={`border-l ${isDark ? 'border-gray-600/50 text-gray-500' : 'border-gray-300 text-gray-600'} text-[10px] pl-1 relative`}
                style={{ width: `${timelineWidth / (totalDuration + 1)}px` }}
              >
                {i}s
                {i % 5 === 0 && i !== 0 && (
                  <div className={`absolute left-0 top-0 bottom-0 border-l ${isDark ? 'border-gray-500' : 'border-gray-400'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Playhead */}
        <div
          className={`absolute top-0 bottom-0 w-px ${isDark ? 'bg-red-500' : 'bg-red-600'} z-10 pointer-events-none`}
          style={{ left: `${((currentTime / totalDuration) * timelineWidth) - scrollLeft}px` }}
        >
          <div className={`absolute -top-0.5 -left-1 w-2 h-2 ${isDark ? 'bg-red-500' : 'bg-red-600'} rounded-sm`}></div>
        </div>
      </div>

      {/* Timeline Controls at bottom */}
      <TimelineControls
        currentTime={currentTime}
        totalDuration={totalDuration}
        isPlaying={isPlaying}
        timeRange={timeRange}
        onTimeChange={onTimeChange}
        onPlayPause={togglePlayPause}
        onReset={handleReset}
        onTimeRangeChange={onTimeRangeChange}
      />
    </div>
  );
}