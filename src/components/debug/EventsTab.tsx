import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { ArrowRight, Download, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

type EventLevel = 'error' | 'warn' | 'info' | 'debug';

interface Event {
  time: number;
  level: EventLevel;
  title: string;
  source: string;
  details?: string;
}

export function EventsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedLevels, setSelectedLevels] = useState<Set<EventLevel>>(
    new Set(['error', 'warn', 'info', 'debug'])
  );

  const events: Event[] = [
    {
      time: 8.5,
      level: 'error',
      title: 'Collision Detection',
      source: 'NSV Checker',
      details: 'Potential collision detected with object ID: 0x2F3A'
    },
    {
      time: 12.0,
      level: 'warn',
      title: 'Lane Deviation Detected',
      source: 'Lane Checker',
      details: 'Threshold: 0.5m, Actual: 0.8m'
    },
    {
      time: 15.2,
      level: 'info',
      title: 'Checkpoint Reached',
      source: 'Scenario Manager',
      details: 'Progress: 50%'
    },
    {
      time: 18.5,
      level: 'warn',
      title: 'Speed Limit Exceeded',
      source: 'Speed Monitor',
      details: 'Limit: 80km/h, Current: 95km/h'
    },
    {
      time: 22.8,
      level: 'info',
      title: 'Braking Event Initiated',
      source: 'Control System',
      details: 'Deceleration: -3.2 m/s²'
    },
    {
      time: 25.0,
      level: 'debug',
      title: 'State Update',
      source: 'Planning Module',
      details: 'Trajectory recalculated successfully'
    },
    {
      time: 3.5,
      level: 'info',
      title: 'Simulation Started',
      source: 'System',
      details: 'Initial conditions loaded'
    },
    {
      time: 10.2,
      level: 'debug',
      title: 'Sensor Fusion Update',
      source: 'Perception',
      details: 'Processing cycle: 102ms'
    },
  ];

  const sortedEvents = [...events].sort((a, b) => a.time - b.time);

  const filteredEvents = sortedEvents.filter(event => {
    const matchesLevel = selectedLevels.has(event.level);
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const toggleLevel = (level: EventLevel) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  const levelCounts = {
    error: events.filter(e => e.level === 'error').length,
    warn: events.filter(e => e.level === 'warn').length,
    info: events.filter(e => e.level === 'info').length,
    debug: events.filter(e => e.level === 'debug').length,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 space-y-3">
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">EVENT LOG</h3>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-24 h-8 text-xs bg-[#252525] border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="errors">Errors</SelectItem>
              <SelectItem value="warnings">Warnings</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-8 text-xs bg-[#252525] border-gray-700 placeholder:text-gray-600"
          />
        </div>

        {/* Level toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleLevel('error')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              selectedLevels.has('error')
                ? 'bg-red-600/20 text-red-400 border border-red-600/40'
                : 'bg-[#252525] text-gray-500 border border-gray-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            ERROR
          </button>
          <button
            onClick={() => toggleLevel('warn')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              selectedLevels.has('warn')
                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/40'
                : 'bg-[#252525] text-gray-500 border border-gray-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            WARN
          </button>
          <button
            onClick={() => toggleLevel('info')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              selectedLevels.has('info')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/40'
                : 'bg-[#252525] text-gray-500 border border-gray-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            INFO
          </button>
          <button
            onClick={() => toggleLevel('debug')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              selectedLevels.has('debug')
                ? 'bg-green-600/20 text-green-400 border border-green-600/40'
                : 'bg-[#252525] text-gray-500 border border-gray-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            DEBUG
          </button>
        </div>
      </div>

      {/* Event list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              No events match the current filters
            </div>
          ) : (
            filteredEvents.map((event, idx) => (
              <EventItem key={idx} event={event} />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-[#1e1e1e] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Total: {events.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-red-400">●{levelCounts.error}</span>
            <span className="text-yellow-400">●{levelCounts.warn}</span>
            <span className="text-blue-400">●{levelCounts.info}</span>
            <span className="text-green-400">●{levelCounts.debug}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Log
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

function EventItem({ event }: { event: Event }) {
  const levelConfig = {
    error: { color: 'text-red-400', bg: 'bg-red-600/10', border: 'border-red-600/30', icon: '🔴' },
    warn: { color: 'text-yellow-400', bg: 'bg-yellow-600/10', border: 'border-yellow-600/30', icon: '🟡' },
    info: { color: 'text-blue-400', bg: 'bg-blue-600/10', border: 'border-blue-600/30', icon: '🔵' },
    debug: { color: 'text-green-400', bg: 'bg-green-600/10', border: 'border-green-600/30', icon: '🟢' },
  };

  const config = levelConfig[event.level];

  return (
    <div className={`border-l-2 ${config.border} pl-3 space-y-1`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400 min-w-[40px]">{event.time.toFixed(1)}s</span>
          <span className="text-xs">{config.icon}</span>
          <span className={`text-xs font-semibold uppercase ${config.color}`}>
            {event.level}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-300 font-medium">{event.title}</div>
      <div className="text-xs text-gray-500">{event.source}</div>
      {event.details && (
        <div className="text-xs text-gray-400 font-mono">{event.details}</div>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 mt-1"
      >
        Jump to Time
        <ArrowRight className="w-3 h-3 ml-1" />
      </Button>
      <div className="pt-2 border-b border-gray-800"></div>
    </div>
  );
}
