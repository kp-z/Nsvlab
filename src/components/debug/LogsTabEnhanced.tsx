import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ArrowRight, Clock, Download, Database, Activity } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useTheme } from '../../contexts/ThemeContext';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';
type Stage = 'origin' | 'refresh' | 'sim';
type TimeMode = 'frame' | 'range';
type Pipeline = 'base' | 'test' | 'both';

interface LogEntry {
  time: number;
  level: LogLevel;
  title: string;
  source: string;
  pipeline: 'base' | 'test';
  stage: Stage;
  details?: string;
}

interface LogsTabEnhancedProps {
  selectedStage: Stage;
  currentFrame: number;
  rangeStart: number;
  rangeEnd: number;
  timeMode: TimeMode;
}

export function LogsTabEnhanced({
  selectedStage,
  currentFrame,
  rangeStart,
  rangeEnd,
  timeMode
}: LogsTabEnhancedProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(
    new Set(['error', 'warn', 'info', 'debug'])
  );
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline>('both');

  // Mock log data with stage and pipeline info
  const logs: LogEntry[] = [
    {
      time: 3.5,
      level: 'info',
      title: 'Simulation Started',
      source: 'System',
      pipeline: 'base',
      stage: 'origin',
      details: 'Initial conditions loaded'
    },
    {
      time: 5.2,
      level: 'info',
      title: 'Data Refresh Initiated',
      source: 'Pipeline',
      pipeline: 'test',
      stage: 'refresh',
      details: 'Starting data refresh process'
    },
    {
      time: 8.5,
      level: 'error',
      title: 'Collision Detection',
      source: 'NSV Checker',
      pipeline: 'base',
      stage: 'origin',
      details: 'Potential collision detected with object ID: 0x2F3A'
    },
    {
      time: 10.2,
      level: 'debug',
      title: 'Sensor Fusion Update',
      source: 'Perception',
      pipeline: 'base',
      stage: 'sim',
      details: 'Processing cycle: 102ms'
    },
    {
      time: 12.0,
      level: 'warn',
      title: 'Lane Deviation Detected',
      source: 'Lane Checker',
      pipeline: 'test',
      stage: 'origin',
      details: 'Threshold: 0.5m, Actual: 0.8m'
    },
    {
      time: 15.2,
      level: 'info',
      title: 'Checkpoint Reached',
      source: 'Scenario Manager',
      pipeline: 'base',
      stage: 'refresh',
      details: 'Progress: 50%'
    },
    {
      time: 18.5,
      level: 'warn',
      title: 'Speed Limit Exceeded',
      source: 'Speed Monitor',
      pipeline: 'test',
      stage: 'sim',
      details: 'Limit: 80km/h, Current: 95km/h'
    },
    {
      time: 22.8,
      level: 'info',
      title: 'Braking Event Initiated',
      source: 'Control System',
      pipeline: 'base',
      stage: 'sim',
      details: 'Deceleration: -3.2 m/s²'
    },
    {
      time: 25.0,
      level: 'debug',
      title: 'State Update',
      source: 'Planning Module',
      pipeline: 'test',
      stage: 'refresh',
      details: 'Trajectory recalculated successfully'
    }
  ];

  // Filter logs based on all criteria
  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        // Stage filter
        if (log.stage !== selectedStage) return false;

        // Time filter
        if (timeMode === 'frame') {
          // Only show logs at or very close to current frame (within 0.1s)
          if (Math.abs(log.time - currentFrame) > 0.1) return false;
        } else {
          // Range mode: show logs within range
          if (log.time < rangeStart || log.time > rangeEnd) return false;
        }

        // Pipeline filter
        if (selectedPipeline !== 'both' && log.pipeline !== selectedPipeline) return false;

        // Level filter
        if (!selectedLevels.has(log.level)) return false;

        // Search filter
        if (searchQuery !== '') {
          const query = searchQuery.toLowerCase();
          return (
            log.title.toLowerCase().includes(query) ||
            log.source.toLowerCase().includes(query) ||
            (log.details && log.details.toLowerCase().includes(query))
          );
        }

        return true;
      })
      .sort((a, b) => a.time - b.time);
  }, [logs, selectedStage, timeMode, currentFrame, rangeStart, rangeEnd, selectedPipeline, selectedLevels, searchQuery]);

  const toggleLevel = (level: LogLevel) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  const levelCounts = {
    error: filteredLogs.filter(e => e.level === 'error').length,
    warn: filteredLogs.filter(e => e.level === 'warn').length,
    info: filteredLogs.filter(e => e.level === 'info').length,
    debug: filteredLogs.filter(e => e.level === 'debug').length,
  };

  const displayTime = timeMode === 'frame' 
    ? `${currentFrame.toFixed(2)}s`
    : `${rangeStart.toFixed(2)}s - ${rangeEnd.toFixed(2)}s`;

  return (
    <div className="h-full flex flex-col">
      {/* Context Info */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-300 bg-gray-100'}`}>
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Database className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Stage:</span>
              <span className={isDark ? 'text-blue-400' : 'text-blue-600'} style={{ fontWeight: 600 }}>
                {selectedStage.charAt(0).toUpperCase() + selectedStage.slice(1)}
              </span>
            </div>
            <div className={`h-4 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="flex items-center gap-2">
              <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Time:</span>
              <span className={`font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>
                {displayTime}
              </span>
            </div>
          </div>
          <Badge variant="secondary" className={`text-[10px] ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            {filteredLogs.length} logs
          </Badge>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          {/* Search and Pipeline Filter */}
          <div className="flex gap-2">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 h-8 text-xs ${isDark ? 'bg-[#252525] border-gray-700 placeholder:text-gray-600' : 'bg-white border-gray-300 placeholder:text-gray-400'}`}
            />
            
            {/* Pipeline Filter */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedPipeline('both')}
                className={`px-2.5 py-1.5 text-[10px] font-medium rounded transition-colors ${
                  selectedPipeline === 'both'
                    ? isDark
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-300 text-gray-900'
                    : isDark
                    ? 'bg-[#252525] text-gray-500 hover:text-gray-300'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                Both
              </button>
              <button
                onClick={() => setSelectedPipeline('base')}
                className={`px-2.5 py-1.5 text-[10px] font-medium rounded transition-colors ${
                  selectedPipeline === 'base'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-[#252525] text-blue-400 hover:text-blue-300'
                    : 'bg-gray-100 text-blue-600 hover:text-blue-700'
                }`}
              >
                Base
              </button>
              <button
                onClick={() => setSelectedPipeline('test')}
                className={`px-2.5 py-1.5 text-[10px] font-medium rounded transition-colors ${
                  selectedPipeline === 'test'
                    ? 'bg-purple-600 text-white'
                    : isDark
                    ? 'bg-[#252525] text-purple-400 hover:text-purple-300'
                    : 'bg-gray-100 text-purple-600 hover:text-purple-700'
                }`}
              >
                Test
              </button>
            </div>
          </div>

          {/* Level toggles */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleLevel('error')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                selectedLevels.has('error')
                  ? isDark
                    ? 'bg-red-600/20 text-red-400 border border-red-600/40'
                    : 'bg-red-100 text-red-700 border border-red-300'
                  : isDark
                  ? 'bg-[#252525] text-gray-500 border border-gray-700'
                  : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              ERROR ({levelCounts.error})
            </button>
            <button
              onClick={() => toggleLevel('warn')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                selectedLevels.has('warn')
                  ? isDark
                    ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/40'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : isDark
                  ? 'bg-[#252525] text-gray-500 border border-gray-700'
                  : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              WARN ({levelCounts.warn})
            </button>
            <button
              onClick={() => toggleLevel('info')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                selectedLevels.has('info')
                  ? isDark
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/40'
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                  : isDark
                  ? 'bg-[#252525] text-gray-500 border border-gray-700'
                  : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              INFO ({levelCounts.info})
            </button>
            <button
              onClick={() => toggleLevel('debug')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                selectedLevels.has('debug')
                  ? isDark
                    ? 'bg-green-600/20 text-green-400 border border-green-600/40'
                    : 'bg-green-100 text-green-700 border border-green-300'
                  : isDark
                  ? 'bg-[#252525] text-gray-500 border border-gray-700'
                  : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              DEBUG ({levelCounts.debug})
            </button>
          </div>
        </div>
      </div>

      {/* Log list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-500'} text-xs`}>
              {timeMode === 'frame' 
                ? 'No logs at current frame'
                : 'No logs match the current filters'
              }
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <LogItem key={idx} log={log} isDark={isDark} />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className={`border-t ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'} p-3`}>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 h-8 text-xs ${isDark ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Logs
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 h-8 text-xs ${isDark ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
            onClick={() => {
              setSearchQuery('');
              setSelectedLevels(new Set(['error', 'warn', 'info', 'debug']));
              setSelectedPipeline('both');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

interface LogItemProps {
  log: LogEntry;
  isDark: boolean;
}

function LogItem({ log, isDark }: LogItemProps) {
  const levelConfig = {
    error: { color: 'text-red-400', bg: 'bg-red-600/10', border: 'border-red-600/30', icon: '🔴' },
    warn: { color: 'text-yellow-400', bg: 'bg-yellow-600/10', border: 'border-yellow-600/30', icon: '🟡' },
    info: { color: 'text-blue-400', bg: 'bg-blue-600/10', border: 'border-blue-600/30', icon: '🔵' },
    debug: { color: 'text-green-400', bg: 'bg-green-600/10', border: 'border-green-600/30', icon: '🟢' },
  };

  const config = levelConfig[log.level];
  const pipelineColor = log.pipeline === 'base' ? 'text-blue-400' : 'text-purple-400';

  return (
    <div className={`border-l-2 ${config.border} pl-3 space-y-1`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'} min-w-[40px]`}>
            {log.time.toFixed(1)}s
          </span>
          <span className="text-xs">{config.icon}</span>
          <span className={`text-xs font-semibold uppercase ${config.color}`}>
            {log.level}
          </span>
          <Badge variant="secondary" className={`text-[10px] ${pipelineColor} ${isDark ? 'bg-transparent border' : 'bg-transparent border'} ${log.pipeline === 'base' ? 'border-blue-500/40' : 'border-purple-500/40'}`}>
            {log.pipeline}
          </Badge>
        </div>
      </div>
      <div className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{log.title}</div>
      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{log.source}</div>
      {log.details && (
        <div className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{log.details}</div>
      )}
      <div className={`pt-2 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}></div>
    </div>
  );
}
