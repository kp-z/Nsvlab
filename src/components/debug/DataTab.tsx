import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronRight, Download, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';

interface DataItem {
  name: string;
  items: {
    label: string;
    status?: 'success' | 'warning' | 'error';
    detail?: string;
  }[];
}

export function DataTab() {
  const [dataSource, setDataSource] = useState('NSV_001');
  const [timeRange, setTimeRange] = useState([30]);
  const [viewMode, setViewMode] = useState<'base' | 'test' | 'both'>('both');

  const dataItems: DataItem[] = [
    {
      name: 'NSV Planner',
      items: [
        { label: 'Trajectory', status: 'success' },
        { label: 'Velocity Profile', status: 'success' },
        { label: 'Acceleration', status: 'success' },
      ]
    },
    {
      name: 'Checker Result',
      items: [
        { label: 'Frame: 1250 / 1250' },
        { label: 'Collision Check', status: 'success' },
        { label: 'Lane Deviation', status: 'warning', detail: '(3 warnings)' },
        { label: 'Speed Compliance', status: 'success' },
      ]
    },
    {
      name: 'Map Data',
      items: [
        { label: '🗺 Highway_001.osm' },
        { label: 'Lanes: 3  Length: 2.5km' },
      ]
    },
    {
      name: 'Metadata',
      items: [
        { label: 'Scenario: Highway_Overtake' },
        { label: 'Weather: Sunny  Traffic: Medium' },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-4">DATA COMPARISON</h3>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Data Source:</label>
              <Select value={dataSource} onValueChange={setDataSource}>
                <SelectTrigger className="h-8 text-xs bg-[#252525] border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NSV_001">NSV_001</SelectItem>
                  <SelectItem value="NSV_002">NSV_002</SelectItem>
                  <SelectItem value="NSV_003">NSV_003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-400">Time Range:</label>
                <span className="text-xs text-gray-500">0s - {timeRange[0]}s</span>
              </div>
              <Slider
                value={timeRange}
                onValueChange={setTimeRange}
                max={30}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          {/* Data Items */}
          <div className="space-y-2 mt-6">
            {dataItems.map((item, idx) => (
              <DataItemCard 
                key={idx} 
                item={item} 
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-[#1e1e1e] p-3">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Diff
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset View
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DataItemCardProps {
  item: DataItem;
  viewMode: 'base' | 'test' | 'both';
  onViewModeChange: (mode: 'base' | 'test' | 'both') => void;
}

function DataItemCard({ item, viewMode, onViewModeChange }: DataItemCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="bg-[#252525] border-gray-700">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left hover:text-gray-200 transition-colors">
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span className="text-xs font-medium text-gray-300">{item.name}</span>
          </CollapsibleTrigger>
          
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && onViewModeChange(value as any)}
            className="gap-0"
          >
            <ToggleGroupItem 
              value="base" 
              className="h-6 px-2 text-[10px] rounded-r-none data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              Base
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="test" 
              className="h-6 px-2 text-[10px] rounded-none border-x border-gray-700 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              Test
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="both" 
              className="h-6 px-2 text-[10px] rounded-l-none data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              ⊕
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <CollapsibleContent>
          <div className="p-3 space-y-1.5">
            {item.items.map((subItem, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                {subItem.status === 'success' && (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                )}
                {subItem.status === 'warning' && (
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                )}
                {!subItem.status && (
                  <div className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span className="flex-1">
                  {subItem.label}
                  {subItem.detail && (
                    <span className="text-gray-500 ml-1">{subItem.detail}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
