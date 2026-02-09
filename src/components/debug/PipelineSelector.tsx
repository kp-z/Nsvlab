import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, X, Plus, ArrowRight } from 'lucide-react';
import { FileInfo } from '../DebugPanel';
import { useTheme } from '../../contexts/ThemeContext';

type Stage = 'origin' | 'refresh' | 'sim';

interface PipelineSelectorProps {
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
  selectedStage: Stage;
  onStageChange: (stage: Stage) => void;
  onAddFile: (pipeline: 'base' | 'test', stage: Stage) => void;
  onRemoveFile: (pipeline: 'base' | 'test', stage: Stage, fileName: string) => void;
}

export function PipelineSelector({
  basePipeline,
  testPipeline,
  selectedStage,
  onStageChange,
  onAddFile,
  onRemoveFile
}: PipelineSelectorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    const newSet = new Set(expandedStages);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setExpandedStages(newSet);
  };

  const stages: { key: Stage; label: string }[] = [
    { key: 'origin', label: 'Origin' },
    { key: 'refresh', label: 'Refresh' },
    { key: 'sim', label: 'Sim' }
  ];

  return (
    <div className={`border-b ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'}`}>
      <div className="px-4 py-3">
        <h3 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide mb-3`}>
          Data Pipeline
        </h3>

        <div className="space-y-3">
          {/* Base Pipeline - Horizontal */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Base Pipeline
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              {stages.map((stage, index) => (
                <div key={`base-${stage.key}`} className="flex items-start gap-3">
                  <div className="w-[160px]">
                    <StageCard
                      pipelineType="base"
                      stage={stage}
                      files={basePipeline[stage.key]}
                      isSelected={selectedStage === stage.key}
                      isExpanded={expandedStages.has(`base-${stage.key}`)}
                      onSelect={() => onStageChange(stage.key)}
                      onToggleExpand={() => toggleExpand(`base-${stage.key}`)}
                      onAddFile={() => onAddFile('base', stage.key)}
                      onRemoveFile={(fileName) => onRemoveFile('base', stage.key, fileName)}
                      isDark={isDark}
                    />
                  </div>
                  {index < stages.length - 1 && (
                    <div className="flex items-center pt-8">
                      <ArrowRight className={`w-5 h-5 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Test Pipeline - Horizontal */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
              <span className={`text-xs font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Test Pipeline
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              {stages.map((stage, index) => (
                <div key={`test-${stage.key}`} className="flex items-start gap-3">
                  <div className="w-[160px]">
                    <StageCard
                      pipelineType="test"
                      stage={stage}
                      files={testPipeline[stage.key]}
                      isSelected={selectedStage === stage.key}
                      isExpanded={expandedStages.has(`test-${stage.key}`)}
                      onSelect={() => onStageChange(stage.key)}
                      onToggleExpand={() => toggleExpand(`test-${stage.key}`)}
                      onAddFile={() => onAddFile('test', stage.key)}
                      onRemoveFile={(fileName) => onRemoveFile('test', stage.key, fileName)}
                      isDark={isDark}
                    />
                  </div>
                  {index < stages.length - 1 && (
                    <div className="flex items-center pt-8">
                      <ArrowRight className={`w-5 h-5 ${isDark ? 'text-purple-500' : 'text-purple-600'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StageCardProps {
  pipelineType: 'base' | 'test';
  stage: { key: Stage; label: string };
  files: FileInfo[];
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  onAddFile: () => void;
  onRemoveFile: (fileName: string) => void;
  isDark: boolean;
}

function StageCard({
  pipelineType,
  stage,
  files,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onAddFile,
  onRemoveFile,
  isDark
}: StageCardProps) {
  const borderColor = pipelineType === 'base' 
    ? isSelected
      ? isDark ? 'border-blue-500' : 'border-blue-600'
      : isDark ? 'border-blue-700/40' : 'border-blue-300'
    : isSelected
      ? isDark ? 'border-purple-500' : 'border-purple-600'
      : isDark ? 'border-purple-700/40' : 'border-purple-300';

  const bgColor = pipelineType === 'base'
    ? isSelected
      ? isDark ? 'bg-blue-600/10' : 'bg-blue-50'
      : isDark ? 'bg-[#252525]' : 'bg-white'
    : isSelected
      ? isDark ? 'bg-purple-600/10' : 'bg-purple-50'
      : isDark ? 'bg-[#252525]' : 'bg-white';

  const textColor = pipelineType === 'base'
    ? isDark ? 'text-blue-400' : 'text-blue-600'
    : isDark ? 'text-purple-400' : 'text-purple-600';

  return (
    <div
      className={`rounded border-2 transition-all ${borderColor} ${bgColor}`}
    >
      {/* Header */}
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={onSelect}
              className={`flex items-center justify-center w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                isSelected
                  ? pipelineType === 'base'
                    ? isDark
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-blue-600 bg-blue-600'
                    : isDark
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-purple-600 bg-purple-600'
                  : pipelineType === 'base'
                    ? isDark
                      ? 'border-blue-600 hover:border-blue-500'
                      : 'border-blue-400 hover:border-blue-600'
                    : isDark
                      ? 'border-purple-600 hover:border-purple-500'
                      : 'border-purple-400 hover:border-purple-600'
              }`}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </button>
            <span className={`text-xs font-medium ${textColor} truncate`}>
              {stage.label}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} flex-shrink-0`}>
              ({files.length})
            </span>
          </div>
          <button
            onClick={onToggleExpand}
            className={`p-0.5 rounded hover:bg-gray-700/50 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* File count when collapsed */}
        {!isExpanded && files.length > 0 && (
          <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} truncate`}>
            {files.slice(0, 1).map(f => f.name).join(', ')}
            {files.length > 1 && ` +${files.length - 1}`}
          </div>
        )}
      </div>

      {/* Expanded File List */}
      {isExpanded && (
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} p-2 space-y-1.5`}>
          {files.length === 0 ? (
            <div className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-500'} italic text-center py-2`}>
              No files
            </div>
          ) : (
            files.map((file) => (
              <FileItem
                key={file.name}
                file={file}
                onRemove={() => onRemoveFile(file.name)}
                isDark={isDark}
              />
            ))
          )}
          <button
            onClick={onAddFile}
            className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-medium transition-colors ${
              pipelineType === 'base'
                ? isDark
                  ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-600/30'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-300'
                : isDark
                  ? 'bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 border border-purple-600/30'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-300'
            }`}
          >
            <Plus className="w-3 h-3" />
            Add File
          </button>
        </div>
      )}
    </div>
  );
}

interface FileItemProps {
  file: FileInfo;
  onRemove: () => void;
  isDark: boolean;
}

function FileItem({ file, onRemove, isDark }: FileItemProps) {
  return (
    <div
      className={`flex items-center justify-between gap-1.5 px-2 py-1.5 rounded text-[10px] group ${
        isDark ? 'bg-[#1e1e1e] hover:bg-[#2a2a2a]' : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {file.type === 'pb' ? '📄' : '📋'}
        </span>
        <span className={`truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{file.name}</span>
        <span className={`text-[9px] flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{file.size}</span>
      </div>
      <button
        onClick={onRemove}
        className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
          isDark 
            ? 'hover:bg-red-600/20 text-gray-500 hover:text-red-400' 
            : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
        }`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}