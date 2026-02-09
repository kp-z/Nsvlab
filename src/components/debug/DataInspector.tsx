import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronRight, Eye, Database, Activity, Map, FileText } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useTheme } from '../../contexts/ThemeContext';

type Stage = 'origin' | 'refresh' | 'sim';
type TimeMode = 'frame' | 'range';

interface DataInspectorProps {
  selectedStage: Stage;
  currentFrame: number;
  rangeStart: number;
  rangeEnd: number;
  timeMode: TimeMode;
}

export function DataInspector({
  selectedStage,
  currentFrame,
  rangeStart,
  rangeEnd,
  timeMode
}: DataInspectorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [metadataExpanded, setMetadataExpanded] = useState(false);

  // Mock data - would come from actual pipeline data
  const metadata = {
    version: 'v2.1.0',
    created: '2024-02-05 14:23:15',
    author: 'System',
    runtime: 'Node.js v18.0.0',
    memory: '256MB / 2GB',
    totalSize: '15.6 MB',
    totalEvents: 1247,
    timeCoverage: '0s - 30s'
  };

  const displayTime = timeMode === 'frame' 
    ? `${currentFrame.toFixed(2)}s`
    : `${rangeStart.toFixed(2)}s - ${rangeEnd.toFixed(2)}s`;

  return (
    <div className="h-full flex flex-col">
      {/* Context Info */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-300 bg-gray-100'}`}>
        <div className="flex items-center justify-between text-xs">
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
          <Badge variant="secondary" className={`text-[10px] ${isDark ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
            {timeMode === 'frame' ? 'Frame Mode' : 'Range Mode'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Data Comparison - Always Expanded */}
          <DataComparison
            selectedStage={selectedStage}
            currentFrame={currentFrame}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            timeMode={timeMode}
          />

          {/* Metadata (Collapsible) */}
          <div className={`rounded-lg border ${isDark ? 'border-gray-700 bg-[#252525]' : 'border-gray-300 bg-white'}`}>
            <button
              onClick={() => setMetadataExpanded(!metadataExpanded)}
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Map className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                  Metadata
                </span>
                <Badge variant="secondary" className={`text-[10px] ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                  Optional
                </Badge>
              </div>
              {metadataExpanded ? (
                <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              ) : (
                <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </button>

            {metadataExpanded && (
              <div className={`px-3 pb-3 space-y-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                <div className="pt-3 space-y-2">
                  <h4 className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} uppercase`}>System Info</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <MetadataItem label="Version" value={metadata.version} isDark={isDark} />
                    <MetadataItem label="Runtime" value={metadata.runtime} isDark={isDark} />
                    <MetadataItem label="Memory" value={metadata.memory} isDark={isDark} />
                    <MetadataItem label="Created" value={metadata.created} isDark={isDark} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} uppercase`}>Statistics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <MetadataItem label="Total Size" value={metadata.totalSize} isDark={isDark} />
                    <MetadataItem label="Total Events" value={metadata.totalEvents.toString()} isDark={isDark} />
                    <MetadataItem label="Time Coverage" value={metadata.timeCoverage} isDark={isDark} />
                    <MetadataItem label="Author" value={metadata.author} isDark={isDark} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function DataComparison({
  selectedStage,
  currentFrame,
  rangeStart,
  rangeEnd,
  timeMode
}: DataInspectorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedBase, setSelectedBase] = useState<Set<string>>(new Set(['speed', 'events']));
  const [selectedTest, setSelectedTest] = useState<Set<string>>(new Set(['speed', 'events']));
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingData, setViewingData] = useState<any>(null);

  const dataTypes = [
    { id: 'speed', name: 'GT Speed', baseAvailable: true, testAvailable: true },
    { id: 'events', name: 'Events', baseAvailable: true, testAvailable: true },
    { id: 'planner', name: 'NSV Planner', baseAvailable: true, testAvailable: true },
    { id: 'checker', name: 'Checker Result', baseAvailable: true, testAvailable: false }
  ];

  const toggleBase = (id: string) => {
    const newSet = new Set(selectedBase);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedBase(newSet);
  };

  const toggleTest = (id: string) => {
    const newSet = new Set(selectedTest);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedTest(newSet);
  };

  return (
    <div className={`rounded-lg border ${isDark ? 'border-gray-700 bg-[#252525]' : 'border-gray-300 bg-white'} p-3`}>
      <div className="flex items-center gap-2 mb-3">
        <Activity className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        <h3 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
          Data Comparison
        </h3>
      </div>

      <div className="space-y-2">
        {dataTypes.map((type) => (
          <div
            key={type.id}
            className={`rounded border ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'} p-2.5 flex items-center justify-between`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{type.name}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id={`base-${type.id}`}
                    checked={selectedBase.has(type.id)}
                    onCheckedChange={() => toggleBase(type.id)}
                    disabled={!type.baseAvailable}
                    className="h-3.5 w-3.5 border-blue-500 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`base-${type.id}`} className="text-[10px] text-blue-400 cursor-pointer">
                    Base
                  </Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id={`test-${type.id}`}
                    checked={selectedTest.has(type.id)}
                    onCheckedChange={() => toggleTest(type.id)}
                    disabled={!type.testAvailable}
                    className="h-3.5 w-3.5 border-purple-500 data-[state=checked]:bg-purple-600"
                  />
                  <Label htmlFor={`test-${type.id}`} className="text-[10px] text-purple-400 cursor-pointer">
                    Test
                  </Label>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 ${isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
              disabled={!selectedBase.has(type.id) && !selectedTest.has(type.id)}
              onClick={() => {
                setViewingData({ type, baseSelected: selectedBase.has(type.id), testSelected: selectedTest.has(type.id) });
                setViewDialogOpen(true);
              }}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className={`${isDark ? 'bg-[#1e1e1e] border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-900'} max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-gray-200' : 'text-gray-900'}>
              {viewingData?.type.name}
            </DialogTitle>
            <DialogDescription className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Viewing data from {selectedStage} stage • {timeMode === 'frame' ? `Frame: ${currentFrame.toFixed(2)}s` : `Range: ${rangeStart.toFixed(2)}s - ${rangeEnd.toFixed(2)}s`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="py-4">
              {viewingData?.baseSelected && viewingData?.testSelected ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-blue-400 uppercase">Base</h4>
                    <Card className={`${isDark ? 'bg-[#252525] border-blue-500/30' : 'bg-blue-50 border-blue-300'} p-3 text-xs`}>
                      Mock data for Base pipeline
                    </Card>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-purple-400 uppercase">Test</h4>
                    <Card className={`${isDark ? 'bg-[#252525] border-purple-500/30' : 'bg-purple-50 border-purple-300'} p-3 text-xs`}>
                      Mock data for Test pipeline
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-gray-50 border-gray-300'} p-4 text-xs`}>
                  Mock data for {viewingData?.baseSelected ? 'Base' : 'Test'} pipeline
                </Card>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MetadataItemProps {
  label: string;
  value: string;
  isDark: boolean;
}

function MetadataItem({ label, value, isDark }: MetadataItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'} uppercase`}>{label}</span>
      <span className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}