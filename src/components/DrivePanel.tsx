import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { X, Play, Square, RotateCcw, Settings } from 'lucide-react';
import { DriveSetup } from './drive/DriveSetup';
import { DriveControl } from './drive/DriveControl';
import { useTheme } from '../contexts/ThemeContext';

export interface FileInfo {
  name: string;
  size: string;
  type: 'pb' | 'json';
}

export interface PipelineData {
  origin: FileInfo[];
  refresh: FileInfo[];
}

export interface ModelConfig {
  modelType: string;
  inferenceMode: string;
  batchSize: number;
  precision: string;
  pipelineStage: 'origin' | 'refresh';
  dataSource: 'base' | 'test';
}

interface DrivePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DrivePanel({ isOpen, onClose }: DrivePanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [driveState, setDriveState] = useState<'setup' | 'ready' | 'driving'>('setup');
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    modelType: 'autonomous',
    inferenceMode: 'real-time',
    batchSize: 1,
    precision: 'fp16',
    pipelineStage: 'refresh',
    dataSource: 'base'
  });

  // Mock pipeline data
  const [basePipelineData] = useState<PipelineData>({
    origin: [
      { name: 'NSV_base_001.pb', size: '2.3MB', type: 'pb' },
      { name: 'scenario_highway.json', size: '156KB', type: 'json' },
      { name: 'config_base.json', size: '45KB', type: 'json' },
    ],
    refresh: [
      { name: 'NSV_refresh_001.pb', size: '2.1MB', type: 'pb' },
      { name: 'refresh_meta.json', size: '89KB', type: 'json' },
    ],
  });

  const [testPipelineData] = useState<PipelineData>({
    origin: [
      { name: 'NSV_test_001.pb', size: '2.4MB', type: 'pb' },
      { name: 'test_scenario.json', size: '142KB', type: 'json' },
    ],
    refresh: [
      { name: 'NSV_test_refresh_001.pb', size: '2.2MB', type: 'pb' },
    ],
  });

  const handleStartDrive = () => {
    setDriveState('driving');
  };

  const handleStopDrive = () => {
    setDriveState('ready');
  };

  const handleBackToSetup = () => {
    setDriveState('setup');
  };

  const handleConfigComplete = (config: ModelConfig) => {
    setModelConfig(config);
    setDriveState('ready');
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
      {/* Header */}
      <div className={`h-12 ${isDark ? 'bg-[#252525] border-gray-700' : 'bg-gray-50 border-gray-300'} border-b flex items-center justify-between px-4 flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            DRIVE MODE
          </div>
          {driveState !== 'setup' && (
            <div className={`ml-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
              driveState === 'driving'
                ? 'bg-green-600/20 text-green-400 border border-green-600/40'
                : 'bg-blue-600/20 text-blue-400 border border-blue-600/40'
            }`}>
              {driveState === 'driving' ? 'ACTIVE' : 'READY'}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={`h-8 w-8 p-0 ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content based on state */}
      {driveState === 'setup' ? (
        <DriveSetup 
          config={modelConfig}
          onConfigComplete={handleConfigComplete}
          basePipeline={basePipelineData}
          testPipeline={testPipelineData}
        />
      ) : (
        <>
          {/* Control Bar */}
          <div className={`h-14 ${isDark ? 'bg-[#252525] border-gray-700' : 'bg-gray-50 border-gray-300'} border-b flex items-center justify-between px-4 flex-shrink-0`}>
            <div className="flex items-center gap-2">
              {driveState === 'ready' ? (
                <Button
                  onClick={handleStartDrive}
                  className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Drive
                </Button>
              ) : (
                <Button
                  onClick={handleStopDrive}
                  className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop Drive
                </Button>
              )}
              
              <Button
                onClick={handleBackToSetup}
                variant="ghost"
                className={`h-9 px-4 gap-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
              >
                <Settings className="w-4 h-4" />
                Setup
              </Button>
            </div>

            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Model: {modelConfig.modelType} | {modelConfig.inferenceMode}
            </div>
          </div>

          {/* Drive Control Interface */}
          <div className="flex-1 overflow-hidden">
            <DriveControl 
              isActive={driveState === 'driving'}
              config={modelConfig}
            />
          </div>
        </>
      )}
    </div>
  );
}