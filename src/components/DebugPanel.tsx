import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Upload, Cloud, X } from 'lucide-react';
import { PipelineSelector } from './debug/PipelineSelector';
import { TimelineFilter } from './debug/TimelineFilter';
import { DataInspector } from './debug/DataInspector';
import { LogsTabEnhanced } from './debug/LogsTabEnhanced';
import { TaskBagTab } from './debug/TaskBagTab';
import { UploadDialog } from './debug/UploadDialog';
import { CloudFetchDialog } from './debug/CloudFetchDialog';
import { useTheme } from '../contexts/ThemeContext';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // Timeline sync props (would be passed from parent)
  currentFrame?: number;
  rangeStart?: number;
  rangeEnd?: number;
}

export interface FileInfo {
  name: string;
  size: string;
  type: 'pb' | 'json';
}

export interface PipelineData {
  origin: FileInfo[];
  refresh: FileInfo[];
  sim: FileInfo[];
}

type Stage = 'origin' | 'refresh' | 'sim';
type TimeMode = 'frame' | 'range';

export function DebugPanel({ 
  isOpen, 
  onClose,
  currentFrame = 10.25,
  rangeStart = 5.0,
  rangeEnd = 15.0
}: DebugPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Upload/Cloud dialogs
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [cloudDialogOpen, setCloudDialogOpen] = useState(false);
  const [uploadPipeline, setUploadPipeline] = useState<'base' | 'test'>('base');
  const [uploadStage, setUploadStage] = useState<Stage>('origin');

  // Pipeline data
  const [basePipelineData, setBasePipelineData] = useState<PipelineData>({
    origin: [
      { name: 'NSV_base_001.pb', size: '2.3MB', type: 'pb' },
      { name: 'scenario_highway.json', size: '156KB', type: 'json' },
      { name: 'config_base.json', size: '45KB', type: 'json' },
    ],
    refresh: [
      { name: 'NSV_refresh_001.pb', size: '2.1MB', type: 'pb' },
      { name: 'refresh_meta.json', size: '89KB', type: 'json' },
    ],
    sim: [
      { name: 'NSV_sim_001.pb', size: '2.5MB', type: 'pb' },
    ],
  });

  const [testPipelineData, setTestPipelineData] = useState<PipelineData>({
    origin: [
      { name: 'NSV_test_001.pb', size: '2.4MB', type: 'pb' },
      { name: 'test_scenario.json', size: '142KB', type: 'json' },
    ],
    refresh: [
      { name: 'NSV_test_refresh_001.pb', size: '2.2MB', type: 'pb' },
    ],
    sim: [
      { name: 'NSV_test_sim_001.pb', size: '2.6MB', type: 'pb' },
    ],
  });

  // Filter states
  const [selectedStage, setSelectedStage] = useState<Stage>('origin');
  const [timeMode, setTimeMode] = useState<TimeMode>('range');

  const handleOpenUploadDialog = (pipeline: 'base' | 'test', stage: Stage) => {
    setUploadPipeline(pipeline);
    setUploadStage(stage);
    setUploadDialogOpen(true);
  };

  const handleUpload = (files: FileInfo[], stage: Stage) => {
    if (uploadPipeline === 'base') {
      setBasePipelineData(prev => ({
        ...prev,
        [stage]: [...prev[stage], ...files]
      }));
    } else {
      setTestPipelineData(prev => ({
        ...prev,
        [stage]: [...prev[stage], ...files]
      }));
    }
    setUploadDialogOpen(false);
  };

  const handleRemoveFile = (pipeline: 'base' | 'test', stage: Stage, fileName: string) => {
    if (pipeline === 'base') {
      setBasePipelineData(prev => ({
        ...prev,
        [stage]: prev[stage].filter(f => f.name !== fileName)
      }));
    } else {
      setTestPipelineData(prev => ({
        ...prev,
        [stage]: prev[stage].filter(f => f.name !== fileName)
      }));
    }
  };

  const handleCloudFetch = (files: FileInfo[], stage: Stage) => {
    if (uploadPipeline === 'base') {
      setBasePipelineData(prev => ({
        ...prev,
        [stage]: [...prev[stage], ...files]
      }));
    } else {
      setTestPipelineData(prev => ({
        ...prev,
        [stage]: [...prev[stage], ...files]
      }));
    }
    setCloudDialogOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <div className={`h-14 border-b ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'} px-4 flex flex-row items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🐛</span>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>DEBUG MODE</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-3 text-xs ${
                isDark 
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
              onClick={() => {
                setUploadPipeline('base');
                setUploadDialogOpen(true);
              }}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Local Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-3 text-xs ${
                isDark 
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
              onClick={() => {
                setUploadPipeline('base');
                setCloudDialogOpen(true);
              }}
            >
              <Cloud className="w-3.5 h-3.5 mr-1.5" />
              Cloud Fetch
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                isDark 
                  ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Pipeline Selector - Fixed at top */}
          <PipelineSelector
            basePipeline={basePipelineData}
            testPipeline={testPipelineData}
            selectedStage={selectedStage}
            onStageChange={setSelectedStage}
            onAddFile={handleOpenUploadDialog}
            onRemoveFile={handleRemoveFile}
          />

          {/* Timeline Filter - Shows current time/range and stage */}
          <TimelineFilter
            currentFrame={currentFrame}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            selectedStage={selectedStage}
            timeMode={timeMode}
            onTimeModeChange={setTimeMode}
          />

          {/* Main Content Tabs */}
          <Tabs defaultValue="data" className="flex flex-col flex-1 overflow-hidden">
            <TabsList className={`w-full justify-start rounded-none border-b ${
              isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'
            } h-11 p-0 flex-shrink-0`}>
              <TabsTrigger 
                value="data"
                className={`rounded-none ${
                  isDark 
                    ? 'data-[state=active]:bg-[#252525] data-[state=active]:border-blue-500'
                    : 'data-[state=active]:bg-white data-[state=active]:border-blue-600'
                } data-[state=active]:border-b-2 text-xs h-11 px-4`}
              >
                📊 Data Inspector
              </TabsTrigger>
              <TabsTrigger 
                value="taskbag"
                className={`rounded-none ${
                  isDark 
                    ? 'data-[state=active]:bg-[#252525] data-[state=active]:border-blue-500'
                    : 'data-[state=active]:bg-white data-[state=active]:border-blue-600'
                } data-[state=active]:border-b-2 text-xs h-11 px-4`}
              >
                📋 Task & Bag
              </TabsTrigger>
              <TabsTrigger 
                value="logs"
                className={`rounded-none ${
                  isDark 
                    ? 'data-[state=active]:bg-[#252525] data-[state=active]:border-blue-500'
                    : 'data-[state=active]:bg-white data-[state=active]:border-blue-600'
                } data-[state=active]:border-b-2 text-xs h-11 px-4`}
              >
                📝 Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="flex-1 m-0 overflow-hidden">
              <DataInspector
                selectedStage={selectedStage}
                currentFrame={currentFrame}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                timeMode={timeMode}
              />
            </TabsContent>

            <TabsContent value="taskbag" className="flex-1 m-0 overflow-hidden">
              <TaskBagTab
                selectedStage={selectedStage}
                currentFrame={currentFrame}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                timeMode={timeMode}
              />
            </TabsContent>

            <TabsContent value="logs" className="flex-1 m-0 overflow-hidden">
              <LogsTabEnhanced
                selectedStage={selectedStage}
                currentFrame={currentFrame}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                timeMode={timeMode}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        stage={uploadStage}
        onStageChange={setUploadStage}
        onUpload={handleUpload}
      />

      <CloudFetchDialog
        open={cloudDialogOpen}
        onOpenChange={setCloudDialogOpen}
        onFetch={handleCloudFetch}
      />
    </>
  );
}