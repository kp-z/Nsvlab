import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TrackData } from './TimelinePanel';
import { TrackLineChart } from './TrackLineChart';
import { TrackBarChart } from './TrackBarChart';
import { TrackButtonSequence } from './TrackButtonSequence';
import { useTheme } from '../contexts/ThemeContext';

interface TimelineTrackProps {
  track: TrackData;
  currentTime: number;
  totalDuration: number;
  scrollLeft: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  timelineWidth: number;
}

export function TimelineTrack({ track, currentTime, totalDuration, scrollLeft, onScroll, timelineWidth }: TimelineTrackProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<'feature1' | 'feature2'>('feature1');

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate highlight position percentage
  const highlightPosition = (track.highlightTime / totalDuration) * timelineWidth;

  // Sync scroll position
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollLeft]);

  // Render the appropriate visualization based on track type
  const renderExpandedContent = () => {
    switch (track.type) {
      case 'line':
        return <TrackLineChart track={track} totalDuration={totalDuration} />;
      case 'bar':
        return <TrackBarChart track={track} totalDuration={totalDuration} />;
      case 'buttons':
        return <TrackButtonSequence track={track} totalDuration={totalDuration} />;
      default:
        return null;
    }
  };

  return (
    <div className={`border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
      {/* Track header */}
      <div className={`h-10 ${isDark ? 'bg-[#252525]' : 'bg-gray-50'} flex items-center gap-3 px-3`}>
        {/* Expand button */}
        <button
          onClick={toggleExpand}
          className={`w-5 h-5 flex items-center justify-center ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors flex-shrink-0`}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Track name */}
        <div className={`w-32 ${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm flex-shrink-0 truncate`}>
          {track.name}
        </div>

        {/* Feature selector */}
        <select
          value={selectedFeature}
          onChange={(e) => setSelectedFeature(e.target.value as 'feature1' | 'feature2')}
          className={`w-24 h-6 ${isDark ? 'bg-[#1e1e1e] border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} border text-xs rounded px-2 focus:outline-none focus:border-blue-500 flex-shrink-0`}
        >
          <option value="feature1">feature1</option>
          <option value="feature2">feature2</option>
        </select>

        {/* Timeline visualization area */}
        <div 
          ref={scrollRef}
          onScroll={onScroll}
          className={`flex-1 h-6 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-100'} rounded relative overflow-x-auto overflow-y-hidden min-w-0 scrollbar-thin`}
          style={{ scrollbarWidth: 'thin' }}
        >
          <div 
            className="h-full relative"
            style={{ width: `${timelineWidth}px` }}
          >
            {!isExpanded && (
              <div className="absolute inset-0">
                <div className={`absolute top-1/2 left-0 right-0 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                {/* Highlight marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-blue-400 transition-all"
                  style={{ left: `${highlightPosition}px` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full border border-blue-300 shadow-sm shadow-blue-500/50"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Time display */}
        <div className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-xs font-mono w-12 text-right flex-shrink-0`}>
          {track.highlightTime}s
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className={`h-40 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'} relative`}>
          <div className="absolute inset-0 px-4 py-2">
            <div className={`h-full ${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-200'} rounded relative overflow-hidden border`}>
              {/* Highlight marker in expanded view */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20"
                style={{ left: `${(track.highlightTime / totalDuration) * 100}%` }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
              </div>
              
              {/* Render visualization */}
              <div className="h-full w-full">
                {renderExpandedContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}