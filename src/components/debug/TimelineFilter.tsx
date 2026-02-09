import React from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';

type Stage = 'origin' | 'refresh' | 'sim';
type TimeMode = 'frame' | 'range';

interface TimelineFilterProps {
  currentFrame: number;
  rangeStart: number;
  rangeEnd: number;
  selectedStage: Stage;
  timeMode: TimeMode;
  onTimeModeChange: (mode: TimeMode) => void;
}

export function TimelineFilter({
  currentFrame,
  rangeStart,
  rangeEnd,
  selectedStage,
  timeMode,
  onTimeModeChange
}: TimelineFilterProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const duration = rangeEnd - rangeStart;
  
  const stageLabels: Record<Stage, string> = {
    origin: 'Origin',
    refresh: 'Refresh',
    sim: 'Sim'
  };

  return (
    <div className={`border-b ${isDark ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-300 bg-gray-100'} px-4 py-3`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left: Time Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
              Timeline Filter
            </span>
          </div>

          <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

          {/* Time Mode Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTimeModeChange('frame')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                timeMode === 'frame'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-[#252525] text-gray-400 hover:text-gray-200'
                  : 'bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              Current Frame
            </button>
            <button
              onClick={() => onTimeModeChange('range')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                timeMode === 'range'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-[#252525] text-gray-400 hover:text-gray-200'
                  : 'bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              Range
            </button>
          </div>
        </div>

        {/* Right: Time Display and Stage */}
        <div className="flex items-center gap-4">
          {/* Time Display */}
          <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {timeMode === 'frame' ? (
              <div className="flex items-center gap-2">
                <PlayCircle className="w-3.5 h-3.5" />
                <span className="font-mono">
                  <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Frame:</span> {currentFrame.toFixed(2)}s
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-mono">
                  <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Range:</span> {rangeStart.toFixed(2)}s → {rangeEnd.toFixed(2)}s
                </span>
                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  (Δ {duration.toFixed(2)}s)
                </span>
              </div>
            )}
          </div>

          <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

          {/* Stage Badge */}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Stage:</span>
            <Badge 
              variant="secondary" 
              className={`text-xs font-medium ${
                isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-600/40' : 'bg-blue-100 text-blue-700 border border-blue-300'
              }`}
            >
              {stageLabels[selectedStage]}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
