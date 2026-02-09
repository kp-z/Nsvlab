import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useTheme } from '../../contexts/ThemeContext';

type DataType = 'nsv_planner' | 'checker_result' | 'gt_speed' | 'map' | 'metadata';

interface DataItem {
  id: DataType;
  name: string;
  baseAvailable: boolean;
  testAvailable: boolean;
  status?: 'success' | 'warning' | 'error';
  baseData?: any;
  testData?: any;
}

export function DataTabNew() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedBase, setSelectedBase] = useState<Set<DataType>>(new Set());
  const [selectedTest, setSelectedTest] = useState<Set<DataType>>(new Set());
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<DataItem | null>(null);
  const [viewMode, setViewMode] = useState<'base' | 'test' | 'compare'>('base');

  const dataItems: DataItem[] = [
    {
      id: 'nsv_planner',
      name: 'NSV Planner',
      baseAvailable: true,
      testAvailable: true,
      status: 'success',
      baseData: {
        trajectory_points: 1250,
        avg_velocity: '65.2 km/h',
        max_acceleration: '2.8 m/s²',
        planning_cycles: 450
      },
      testData: {
        trajectory_points: 1250,
        avg_velocity: '67.8 km/h',
        max_acceleration: '3.1 m/s²',
        planning_cycles: 450
      }
    },
    {
      id: 'checker_result',
      name: 'Checker Result',
      baseAvailable: true,
      testAvailable: true,
      status: 'warning',
      baseData: {
        total_checks: 1250,
        passed: 1247,
        warnings: 3,
        errors: 0,
        collision_free: true,
        lane_deviations: 3
      },
      testData: {
        total_checks: 1250,
        passed: 1250,
        warnings: 0,
        errors: 0,
        collision_free: true,
        lane_deviations: 0
      }
    },
    {
      id: 'gt_speed',
      name: 'GT Speed',
      baseAvailable: true,
      testAvailable: true,
      status: 'success',
      baseData: {
        avg_speed: '64.5 km/h',
        max_speed: '95.2 km/h',
        min_speed: '0.0 km/h',
        speed_violations: 2
      },
      testData: {
        avg_speed: '65.8 km/h',
        max_speed: '89.5 km/h',
        min_speed: '0.0 km/h',
        speed_violations: 0
      }
    },
    {
      id: 'map',
      name: 'Map Data',
      baseAvailable: true,
      testAvailable: true,
      status: 'success',
      baseData: {
        map_file: 'Highway_001.osm',
        lanes: 3,
        length: '2.5 km',
        junctions: 2
      },
      testData: {
        map_file: 'Highway_001_v2.osm',
        lanes: 3,
        length: '2.5 km',
        junctions: 2
      }
    },
    {
      id: 'metadata',
      name: 'Scenario Metadata',
      baseAvailable: true,
      testAvailable: true,
      status: 'success',
      baseData: {
        scenario: 'Highway_Overtake',
        weather: 'Sunny',
        traffic: 'Medium',
        duration: '30.0s'
      },
      testData: {
        scenario: 'Highway_Overtake',
        weather: 'Sunny',
        traffic: 'Medium',
        duration: '30.0s'
      }
    }
  ];

  const toggleBase = (id: DataType) => {
    const newSet = new Set(selectedBase);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedBase(newSet);
  };

  const toggleTest = (id: DataType) => {
    const newSet = new Set(selectedTest);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedTest(newSet);
  };

  const handleViewData = (item: DataItem) => {
    setViewingItem(item);
    
    const hasBase = selectedBase.has(item.id);
    const hasTest = selectedTest.has(item.id);
    
    if (hasBase && hasTest) {
      setViewMode('compare');
    } else if (hasBase) {
      setViewMode('base');
    } else {
      setViewMode('test');
    }
    
    setViewDialogOpen(true);
  };

  const canViewItem = (item: DataItem) => {
    return selectedBase.has(item.id) || selectedTest.has(item.id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <h3 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide mb-3`}>DATA COMPARISON</h3>
        
        {/* Pipeline Selection Info */}
        <div className="flex items-center gap-2 text-[10px]">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-blue-400">Base Pipeline</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-purple-400">Test Pipeline</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {dataItems.map((item) => (
            <DataItemCard
              key={item.id}
              item={item}
              baseSelected={selectedBase.has(item.id)}
              testSelected={selectedTest.has(item.id)}
              onToggleBase={() => toggleBase(item.id)}
              onToggleTest={() => toggleTest(item.id)}
              onView={() => handleViewData(item)}
              canView={canViewItem(item)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* View Dialog */}
      <DataViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        item={viewingItem}
        mode={viewMode}
      />
    </div>
  );
}

interface DataItemCardProps {
  item: DataItem;
  baseSelected: boolean;
  testSelected: boolean;
  onToggleBase: () => void;
  onToggleTest: () => void;
  onView: () => void;
  canView: boolean;
}

function DataItemCard({ 
  item, 
  baseSelected, 
  testSelected, 
  onToggleBase, 
  onToggleTest, 
  onView,
  canView 
}: DataItemCardProps) {
  const statusIcon = {
    success: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />,
    error: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
  };

  return (
    <Card className="bg-[#252525] border-gray-700">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-300">{item.name}</span>
              {item.status && statusIcon[item.status]}
            </div>
            <div className="flex items-center gap-2">
              {/* Base Checkbox */}
              <div className="flex items-center space-x-1.5">
                <Checkbox
                  id={`base-${item.id}`}
                  checked={baseSelected}
                  onCheckedChange={onToggleBase}
                  disabled={!item.baseAvailable}
                  className="h-3.5 w-3.5 border-blue-500 data-[state=checked]:bg-blue-600"
                />
                <Label
                  htmlFor={`base-${item.id}`}
                  className="text-[10px] text-blue-400 cursor-pointer"
                >
                  Base
                </Label>
              </div>

              {/* Test Checkbox */}
              <div className="flex items-center space-x-1.5">
                <Checkbox
                  id={`test-${item.id}`}
                  checked={testSelected}
                  onCheckedChange={onToggleTest}
                  disabled={!item.testAvailable}
                  className="h-3.5 w-3.5 border-purple-500 data-[state=checked]:bg-purple-600"
                />
                <Label
                  htmlFor={`test-${item.id}`}
                  className="text-[10px] text-purple-400 cursor-pointer"
                >
                  Test
                </Label>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
          onClick={onView}
          disabled={!canView}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

interface DataViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: DataItem | null;
  mode: 'base' | 'test' | 'compare';
}

function DataViewDialog({ open, onOpenChange, item, mode }: DataViewDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-gray-700 text-gray-300 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gray-200 flex items-center gap-2">
            {item.name}
            {mode === 'compare' && (
              <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                Compare Mode
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-xs">
            {mode === 'compare' 
              ? 'Comparing Base and Test pipeline data'
              : `Viewing ${mode === 'base' ? 'Base' : 'Test'} pipeline data`
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {mode === 'compare' ? (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Base</h4>
                <Card className="bg-[#252525] border-blue-500/30 p-3">
                  <DataContent data={item.baseData} />
                </Card>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Test</h4>
                <Card className="bg-[#252525] border-purple-500/30 p-3">
                  <DataContent data={item.testData} />
                </Card>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <Card className="bg-[#252525] border-gray-700 p-4">
                <DataContent data={mode === 'base' ? item.baseData : item.testData} />
              </Card>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function DataContent({ data }: { data: any }) {
  if (!data) return <div className="text-xs text-gray-500">No data available</div>;

  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-start justify-between text-xs">
          <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>
          <span className="text-gray-300 font-mono text-right">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}