import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Card } from '../ui/card';
import { ChevronRight, CheckCircle, Settings, Database, Cpu, Zap, FileText } from 'lucide-react';
import { ModelConfig, PipelineData } from '../DrivePanel';
import { useTheme } from '../../contexts/ThemeContext';

interface DriveSetupProps {
  config: ModelConfig;
  onConfigComplete: (config: ModelConfig) => void;
  basePipeline: PipelineData;
  testPipeline: PipelineData;
}

export function DriveSetup({ config, onConfigComplete, basePipeline, testPipeline }: DriveSetupProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [localConfig, setLocalConfig] = useState<ModelConfig>(config);

  const updateConfig = (key: keyof ModelConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    onConfigComplete(localConfig);
  };

  // Get current files based on selection
  const currentPipeline = localConfig.dataSource === 'base' ? basePipeline : testPipeline;
  const currentFiles = currentPipeline[localConfig.pipelineStage];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Setup Header */}
      <div className={`p-4 ${isDark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-gray-50 border-gray-300'} border-b`}>
        <h3 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide mb-1`}>
          DRIVE SIMULATOR SETUP
        </h3>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          Configure model inference parameters and data source
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Model Configuration Section */}
          <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-4`}>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                Model Configuration
              </h4>
            </div>

            <div className="space-y-4">
              {/* Model Type */}
              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Model Type
                </Label>
                <Select 
                  value={localConfig.modelType}
                  onValueChange={(value) => updateConfig('modelType', value)}
                >
                  <SelectTrigger className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autonomous">Autonomous Driving</SelectItem>
                    <SelectItem value="assisted">Assisted Driving</SelectItem>
                    <SelectItem value="custom">Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Inference Mode */}
              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Inference Mode
                </Label>
                <Select 
                  value={localConfig.inferenceMode}
                  onValueChange={(value) => updateConfig('inferenceMode', value)}
                >
                  <SelectTrigger className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="batch">Batch Processing</SelectItem>
                    <SelectItem value="step-by-step">Step-by-step</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Batch Size */}
              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Batch Size
                </Label>
                <Select 
                  value={localConfig.batchSize.toString()}
                  onValueChange={(value) => updateConfig('batchSize', parseInt(value))}
                >
                  <SelectTrigger className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Precision */}
              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Precision
                </Label>
                <Select 
                  value={localConfig.precision}
                  onValueChange={(value) => updateConfig('precision', value)}
                >
                  <SelectTrigger className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fp32">FP32 (Full Precision)</SelectItem>
                    <SelectItem value="fp16">FP16 (Half Precision)</SelectItem>
                    <SelectItem value="int8">INT8 (Quantized)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Data Source Selection Section */}
          <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-4`}>
            <div className="flex items-center gap-2 mb-4">
              <Database className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                Input Data Source
              </h4>
            </div>

            <div className="space-y-4">
              {/* Pipeline Stage */}
              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Pipeline Stage
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['origin', 'refresh'] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => updateConfig('pipelineStage', stage)}
                      className={`h-9 rounded text-xs font-medium transition-all ${
                        localConfig.pipelineStage === stage
                          ? isDark
                            ? 'bg-purple-600 text-white border-2 border-purple-500'
                            : 'bg-purple-600 text-white border-2 border-purple-500'
                          : isDark
                            ? 'bg-[#1e1e1e] text-gray-400 border border-gray-600 hover:border-gray-500'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Pipeline Selection */}
              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Data Pipeline
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateConfig('dataSource', 'base')}
                    className={`h-9 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      localConfig.dataSource === 'base'
                        ? isDark
                          ? 'bg-blue-600 text-white border-2 border-blue-500'
                          : 'bg-blue-600 text-white border-2 border-blue-500'
                        : isDark
                          ? 'bg-[#1e1e1e] text-gray-400 border border-gray-600 hover:border-gray-500'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    Base
                  </button>
                  <button
                    onClick={() => updateConfig('dataSource', 'test')}
                    className={`h-9 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      localConfig.dataSource === 'test'
                        ? isDark
                          ? 'bg-purple-600 text-white border-2 border-purple-500'
                          : 'bg-purple-600 text-white border-2 border-purple-500'
                        : isDark
                          ? 'bg-[#1e1e1e] text-gray-400 border border-gray-600 hover:border-gray-500'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    Test
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className={`p-3 rounded ${isDark ? 'bg-[#1e1e1e] border border-gray-700' : 'bg-gray-50 border border-gray-300'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} uppercase tracking-wide mb-2`}>
                  Selected Data Path
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={localConfig.dataSource === 'base' ? 'text-blue-400' : 'text-purple-400'}>
                    {localConfig.dataSource.toUpperCase()}
                  </span>
                  <ChevronRight className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {localConfig.pipelineStage.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* File List */}
              <div className={`rounded border ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'}`}>
                <div className={`px-3 py-2 border-b ${isDark ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-300 bg-gray-100'}`}>
                  <div className="flex items-center gap-2">
                    <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`text-[10px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>
                      Available Files ({currentFiles.length})
                    </span>
                  </div>
                </div>
                <div className="p-2 space-y-1 max-h-32 overflow-y-auto">
                  {currentFiles.length === 0 ? (
                    <div className={`text-xs text-center py-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      No files available
                    </div>
                  ) : (
                    currentFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between px-2 py-1.5 rounded text-xs ${
                          isDark ? 'bg-[#252525] hover:bg-[#2a2a2a]' : 'bg-white hover:bg-gray-100'
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                            file.type === 'pb' 
                              ? localConfig.dataSource === 'base' ? 'bg-blue-400' : 'bg-purple-400'
                              : 'bg-green-400'
                          }`}></div>
                          <span className={`truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {file.name}
                          </span>
                        </div>
                        <span className={`flex-shrink-0 ml-2 text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {file.size}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Hint */}
          <div className={`p-3 rounded flex items-start gap-2 ${isDark ? 'bg-yellow-600/10 border border-yellow-600/30' : 'bg-yellow-50 border border-yellow-300'}`}>
            <Zap className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div className="flex-1">
              <div className={`text-xs font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'} mb-1`}>
                Performance Tip
              </div>
              <div className={`text-xs ${isDark ? 'text-yellow-300/80' : 'text-yellow-700/80'}`}>
                For real-time inference, use FP16 precision with batch size 1. Refresh stage data provides optimized quality for driving simulation.
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer with Complete Button */}
      <div className={`p-4 ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'} border-t flex-shrink-0`}>
        <Button
          onClick={handleComplete}
          className="w-full h-10 bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Complete Setup & Initialize Drive
        </Button>
      </div>
    </div>
  );
}