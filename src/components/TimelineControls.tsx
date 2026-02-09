import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface TimelineControlsProps {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  timeRange: [number, number];
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  onTimeRangeChange: (range: [number, number]) => void;
}

export function TimelineControls({
  currentTime,
  totalDuration,
  isPlaying,
  timeRange,
  onTimeChange,
  onPlayPause,
  onReset,
  onTimeRangeChange
}: TimelineControlsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isDraggingRangeStart, setIsDraggingRangeStart] = useState(false);
  const [isDraggingRangeEnd, setIsDraggingRangeEnd] = useState(false);

  const getTimeFromPosition = (clientX: number): number => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return percentage * totalDuration;
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'playhead' | 'rangeStart' | 'rangeEnd') => {
    e.stopPropagation();
    if (type === 'playhead') {
      setIsDraggingPlayhead(true);
    } else if (type === 'rangeStart') {
      setIsDraggingRangeStart(true);
    } else if (type === 'rangeEnd') {
      setIsDraggingRangeEnd(true);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    const time = getTimeFromPosition(e.clientX);
    onTimeChange(time);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead) {
        const time = getTimeFromPosition(e.clientX);
        onTimeChange(Math.max(timeRange[0], Math.min(timeRange[1], time)));
      } else if (isDraggingRangeStart) {
        const time = getTimeFromPosition(e.clientX);
        const newStart = Math.max(0, Math.min(timeRange[1] - 1, time));
        onTimeRangeChange([newStart, timeRange[1]]);
      } else if (isDraggingRangeEnd) {
        const time = getTimeFromPosition(e.clientX);
        const newEnd = Math.min(totalDuration, Math.max(timeRange[0] + 1, time));
        onTimeRangeChange([timeRange[0], newEnd]);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
      setIsDraggingRangeStart(false);
      setIsDraggingRangeEnd(false);
    };

    if (isDraggingPlayhead || isDraggingRangeStart || isDraggingRangeEnd) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingPlayhead, isDraggingRangeStart, isDraggingRangeEnd, timeRange, totalDuration]);

  const skipBackward = () => {
    onTimeChange(Math.max(timeRange[0], currentTime - 1));
  };

  const skipForward = () => {
    onTimeChange(Math.min(timeRange[1], currentTime + 1));
  };

  const resetRange = () => {
    onTimeRangeChange([0, totalDuration]);
  };

  const playheadPosition = (currentTime / totalDuration) * 100;
  const rangeStartPosition = (timeRange[0] / totalDuration) * 100;
  const rangeEndPosition = (timeRange[1] / totalDuration) * 100;

  return (
    <div className={`h-20 ${isDark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-white border-gray-300'} border-t flex flex-col`}>
      {/* Control buttons */}
      <div className={`h-10 ${isDark ? 'bg-[#252525] border-gray-700/50' : 'bg-gray-50 border-gray-200'} border-b flex items-center px-3 gap-2`}>
        <Button
          onClick={onReset}
          size="sm"
          variant="ghost"
          className={`h-7 w-7 p-0 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
          title="重置到起始位置"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </Button>

        <Button
          onClick={skipBackward}
          size="sm"
          variant="ghost"
          className={`h-7 px-2 text-xs ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
          title="后退1秒"
        >
          -1s
        </Button>

        <Button
          onClick={onPlayPause}
          size="sm"
          className={`h-7 w-10 p-0 ${
            isPlaying 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </Button>

        <Button
          onClick={skipForward}
          size="sm"
          variant="ghost"
          className={`h-7 px-2 text-xs ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
          title="前进1秒"
        >
          +1s
        </Button>

        <Button
          onClick={() => onTimeChange(timeRange[1])}
          size="sm"
          variant="ghost"
          className={`h-7 w-7 p-0 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
          title="跳到结束位置"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </Button>

        <div className="flex-1"></div>

        <div className={`text-xs font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {currentTime.toFixed(2)}s
        </div>

        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          /
        </div>

        <div className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {totalDuration.toFixed(1)}s
        </div>

        <div className={`h-4 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'} mx-1`}></div>

        <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          Range: {timeRange[0].toFixed(1)}s - {timeRange[1].toFixed(1)}s
        </div>

        <Button
          onClick={resetRange}
          size="sm"
          variant="ghost"
          className={`h-7 px-2 text-[10px] ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
          title="重置范围"
        >
          重置范围
        </Button>
      </div>

      {/* Timeline ruler with draggable elements */}
      <div className={`flex-1 relative ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
        {/* Timeline background with time marks */}
        <div
          ref={timelineRef}
          className="absolute inset-0 cursor-pointer"
          onClick={handleTimelineClick}
        >
          {/* Time marks */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalDuration + 1 }, (_, i) => (
              <div
                key={i}
                className="flex-1 relative"
                style={{ width: `${100 / (totalDuration + 1)}%` }}
              >
                {i % 5 === 0 && (
                  <>
                    <div className={`absolute left-0 top-0 bottom-0 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                    <div className={`absolute left-1 top-1 text-[9px] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                      {i}s
                    </div>
                  </>
                )}
                {i % 5 !== 0 && (
                  <div className={`absolute left-0 top-0 h-2 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Range selection background */}
          <div
            className={`absolute top-0 bottom-0 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-200/40 border-blue-400/50'} border-l border-r pointer-events-none`}
            style={{
              left: `${rangeStartPosition}%`,
              width: `${rangeEndPosition - rangeStartPosition}%`
            }}
          ></div>

          {/* Range start handle */}
          <div
            className={`absolute top-0 bottom-0 w-1 cursor-ew-resize z-20 group ${isDark ? 'bg-blue-500/60 hover:bg-blue-500' : 'bg-blue-500/80 hover:bg-blue-600'}`}
            style={{ left: `${rangeStartPosition}%` }}
            onMouseDown={(e) => handleMouseDown(e, 'rangeStart')}
          >
            <div className={`absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-6 rounded ${isDark ? 'bg-blue-500 group-hover:bg-blue-400' : 'bg-blue-600 group-hover:bg-blue-700'} shadow-lg flex items-center justify-center`}>
              <div className="w-0.5 h-3 bg-white/80 rounded"></div>
            </div>
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-700 text-white'} shadow whitespace-nowrap`}>
              {timeRange[0].toFixed(1)}s
            </div>
          </div>

          {/* Range end handle */}
          <div
            className={`absolute top-0 bottom-0 w-1 cursor-ew-resize z-20 group ${isDark ? 'bg-blue-500/60 hover:bg-blue-500' : 'bg-blue-500/80 hover:bg-blue-600'}`}
            style={{ left: `${rangeEndPosition}%` }}
            onMouseDown={(e) => handleMouseDown(e, 'rangeEnd')}
          >
            <div className={`absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-6 rounded ${isDark ? 'bg-blue-500 group-hover:bg-blue-400' : 'bg-blue-600 group-hover:bg-blue-700'} shadow-lg flex items-center justify-center`}>
              <div className="w-0.5 h-3 bg-white/80 rounded"></div>
            </div>
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-700 text-white'} shadow whitespace-nowrap`}>
              {timeRange[1].toFixed(1)}s
            </div>
          </div>

          {/* Playhead */}
          <div
            className={`absolute top-0 bottom-0 w-0.5 cursor-ew-resize z-30 group ${isDark ? 'bg-red-500' : 'bg-red-600'}`}
            style={{ left: `${playheadPosition}%` }}
            onMouseDown={(e) => handleMouseDown(e, 'playhead')}
          >
            <div className={`absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full ${isDark ? 'bg-red-500 group-hover:bg-red-400' : 'bg-red-600 group-hover:bg-red-700'} shadow-lg border-2 border-white`}></div>
            <div className={`absolute -bottom-1 -left-1.5 w-3.5 h-3.5 rounded-full ${isDark ? 'bg-red-500 group-hover:bg-red-400' : 'bg-red-600 group-hover:bg-red-700'} shadow-lg border-2 border-white`}></div>
          </div>
        </div>
      </div>

      {/* Dragging overlay */}
      {(isDraggingPlayhead || isDraggingRangeStart || isDraggingRangeEnd) && (
        <div className="fixed inset-0 z-50 cursor-ew-resize"></div>
      )}
    </div>
  );
}
