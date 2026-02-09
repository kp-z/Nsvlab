import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronRight, FileText, CheckCircle, AlertTriangle, X, Upload, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FileInfo } from '../DebugPanel';
import { MetadataTab } from './MetadataTab';
import { useTheme } from '../../contexts/ThemeContext';

interface PipelineVisualizationProps {
  basePipeline: {
    origin: FileInfo[];
    refresh: FileInfo[];
    sim: FileInfo[];
  };
  testPipeline: {
    origin: FileInfo[];
    refresh: FileInfo[];
    sim: FileInfo[];
  };
  onAddFile: (pipeline: 'base' | 'test', stage: 'origin' | 'refresh' | 'sim') => void;
  onRemoveFile: (pipeline: 'base' | 'test', stage: 'origin' | 'refresh' | 'sim', fileName: string) => void;
}

type Stage = 'origin' | 'refresh' | 'sim';

export function PipelineVisualization({ 
  basePipeline, 
  testPipeline, 
  onAddFile, 
  onRemoveFile 
}: PipelineVisualizationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedStages, setExpandedStages] = useState<Set<Stage>>(new Set());

  const toggleStage = (stage: Stage) => {
    const newSet = new Set(expandedStages);
    if (newSet.has(stage)) {
      newSet.delete(stage);
    } else {
      newSet.add(stage);
    }
    setExpandedStages(newSet);
  };

  const getStatus = (files: FileInfo[]): 'ready' | 'warning' | 'empty' => {
    if (files.length === 0) return 'empty';
    return 'ready';
  };

  const stages: { key: Stage; title: string; label: string }[] = [
    { key: 'origin', title: 'Origin', label: 'Step 1' },
    { key: 'refresh', title: 'Refresh', label: 'Step 2' },
    { key: 'sim', title: 'Sim', label: 'Step 3' },
  ];

  return (
    <div className={`border-b ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'}`}>
      <Tabs defaultValue="pipeline" className="w-full">
        {/* Tabs Header */}
        <div className="flex items-center justify-between px-3 pt-3">
          <h3 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>DATA PIPELINE</h3>
          <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Base</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Test</span>
            </div>
          </div>
        </div>

        {/* Tabs List */}
        <TabsList className={`w-full justify-start rounded-none border-b ${
          isDark ? 'border-gray-700 bg-transparent' : 'border-gray-300 bg-transparent'
        } h-9 px-3 pt-2 pb-0`}>
          <TabsTrigger 
            value="pipeline"
            className={`rounded-t-sm rounded-b-none ${
              isDark 
                ? 'data-[state=active]:bg-[#252525] data-[state=active]:border-blue-500'
                : 'data-[state=active]:bg-white data-[state=active]:border-blue-600'
            } data-[state=active]:border-b-2 text-[10px] h-8 px-3`}
          >
            Pipeline Flow
          </TabsTrigger>
          <TabsTrigger 
            value="metadata"
            className={`rounded-t-sm rounded-b-none ${
              isDark 
                ? 'data-[state=active]:bg-[#252525] data-[state=active]:border-blue-500'
                : 'data-[state=active]:bg-white data-[state=active]:border-blue-600'
            } data-[state=active]:border-b-2 text-[10px] h-8 px-3`}
          >
            Metadata
          </TabsTrigger>
        </TabsList>

        {/* Pipeline Tab Content */}
        <TabsContent value="pipeline" className="m-0 p-3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                  <th className={`text-left text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} font-semibold uppercase tracking-wide pb-2 w-16`}>
                    Type
                  </th>
                  {stages.map((stage, idx) => (
                    <th key={`header-${stage.key}`} className="text-center pb-2 min-w-[120px]" colSpan={idx < stages.length - 1 ? 2 : 1}>
                      <button
                        onClick={() => toggleStage(stage.key)}
                        className={`flex items-center justify-center gap-1.5 mx-auto px-2 py-1 rounded transition-colors ${
                          isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'
                        }`}
                      >
                        {expandedStages.has(stage.key) ? (
                          <ChevronDown className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        ) : (
                          <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        )}
                        <div>
                          <div className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{stage.title}</div>
                          <div className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{stage.label}</div>
                        </div>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Base Pipeline Row */}
                <tr className={`border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-[10px] text-blue-400 font-semibold uppercase">Base</span>
                    </div>
                  </td>
                  {stages.map((stage, idx) => {
                    const cells = [
                      <td key={`base-${stage.key}`} className="py-2 px-2">
                        <StageCell
                          files={basePipeline[stage.key]}
                          color="blue"
                          expanded={expandedStages.has(stage.key)}
                          status={getStatus(basePipeline[stage.key])}
                          onAddFile={() => onAddFile('base', stage.key)}
                          onRemoveFile={(fileName) => onRemoveFile('base', stage.key, fileName)}
                        />
                      </td>
                    ];
                    
                    if (idx < stages.length - 1) {
                      cells.push(
                        <td key={`base-arrow-${stage.key}`} className="py-2">
                          <div className="flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-blue-500/60" />
                          </div>
                        </td>
                      );
                    }
                    
                    return cells;
                  })}
                </tr>

                {/* Test Pipeline Row */}
                <tr>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-[10px] text-purple-400 font-semibold uppercase">Test</span>
                    </div>
                  </td>
                  {stages.map((stage, idx) => {
                    const cells = [
                      <td key={`test-${stage.key}`} className="py-2 px-2">
                        <StageCell
                          files={testPipeline[stage.key]}
                          color="purple"
                          expanded={expandedStages.has(stage.key)}
                          status={getStatus(testPipeline[stage.key])}
                          onAddFile={() => onAddFile('test', stage.key)}
                          onRemoveFile={(fileName) => onRemoveFile('test', stage.key, fileName)}
                        />
                      </td>
                    ];
                    
                    if (idx < stages.length - 1) {
                      cells.push(
                        <td key={`test-arrow-${stage.key}`} className="py-2">
                          <div className="flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-purple-500/60" />
                          </div>
                        </td>
                      );
                    }
                    
                    return cells;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Metadata Tab Content */}
        <TabsContent value="metadata" className="m-0">
          <MetadataTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StageCellProps {
  files: FileInfo[];
  color: 'blue' | 'purple';
  expanded: boolean;
  status: 'ready' | 'warning' | 'empty';
  onAddFile: () => void;
  onRemoveFile: (fileName: string) => void;
}

function StageCell({ files, color, expanded, status, onAddFile, onRemoveFile }: StageCellProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const colorClasses = {
    blue: {
      border: 'border-blue-500/40',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      badge: 'bg-blue-600',
      hover: isDark ? 'hover:border-blue-500/60' : 'hover:border-blue-500/80'
    },
    purple: {
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      badge: 'bg-purple-600',
      hover: isDark ? 'hover:border-purple-500/60' : 'hover:border-purple-500/80'
    }
  };

  const statusIcon = {
    ready: <CheckCircle className="w-3 h-3 text-green-500" />,
    warning: <AlertTriangle className="w-3 h-3 text-yellow-500" />,
    empty: <div className="w-3 h-3 rounded-full border-2 border-gray-600" />
  };

  const classes = colorClasses[color];

  if (!expanded) {
    // Collapsed view - single row
    return (
      <div className={`border ${classes.border} ${classes.bg} rounded p-2 transition-all ${classes.hover}`}>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className={`h-4 px-1.5 text-[9px] ${classes.badge} text-white`}>
            {files.length}
          </Badge>
          {statusIcon[status]}
        </div>
      </div>
    );
  }

  // Expanded view - multiple rows
  return (
    <div className={`border ${classes.border} ${classes.bg} rounded transition-all ${classes.hover}`}>
      <div className={`p-2 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'} flex items-center justify-between`}>
        <Badge variant="secondary" className={`h-4 px-1.5 text-[9px] ${classes.badge} text-white`}>
          {files.length} files
        </Badge>
        {statusIcon[status]}
      </div>
      
      <div className="p-2 space-y-1 max-h-32 overflow-y-auto">
        {files.length > 0 ? (
          files.map((file, idx) => (
            <div
              key={idx}
              className={`rounded px-2 py-1 group transition-colors ${
                isDark 
                  ? 'bg-[#1a1a1a] hover:bg-[#252525]'
                  : 'bg-gray-100 hover:bg-gray-200'
              } flex items-center justify-between`}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <FileText className={`w-3 h-3 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-600'}`} />
                <div className="flex flex-col min-w-0">
                  <span className={`text-[9px] truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{file.name}</span>
                  <span className={`text-[8px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{file.size}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/20 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(file.name);
                }}
              >
                <X className="w-2.5 h-2.5" />
              </Button>
            </div>
          ))
        ) : (
          <div className={`text-center py-2 text-[9px] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            No files
          </div>
        )}
      </div>

      <div className={`p-2 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'}`}>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full h-6 text-[9px] transition-colors ${
            isDark 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
          }`}
          onClick={onAddFile}
        >
          <Upload className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
