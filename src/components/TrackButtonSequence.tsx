import React from 'react';
import { TrackData } from './TimelinePanel';

interface TrackButtonSequenceProps {
  track: TrackData;
  totalDuration: number;
}

export function TrackButtonSequence({ track, totalDuration }: TrackButtonSequenceProps) {
  const buttons = track.buttons || [];

  return (
    <div className="h-full w-full relative flex items-center px-8">
      {buttons.map((button, index) => {
        const position = (button.time / totalDuration) * 100;
        
        // Different colors for different button types
        const getButtonStyle = () => {
          if (button.label.includes('Start')) return 'bg-green-600 hover:bg-green-500';
          if (button.label.includes('Warning')) return 'bg-orange-600 hover:bg-orange-500';
          if (button.label.includes('Complete') || button.label.includes('End')) return 'bg-blue-600 hover:bg-blue-500';
          return 'bg-purple-600 hover:bg-purple-500';
        };
        
        return (
          <div
            key={index}
            className="absolute"
            style={{ left: `${position}%` }}
          >
            <button className={`px-3 py-1.5 ${getButtonStyle()} text-white text-xs rounded shadow-lg transform -translate-x-1/2 transition-all hover:scale-105`}>
              {button.label}
            </button>
            {/* Vertical line indicator */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-4 bg-gray-500"></div>
          </div>
        );
      })}
      
      {/* Base line */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-600"></div>
    </div>
  );
}