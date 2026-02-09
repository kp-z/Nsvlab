import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { FileText, X, AlertTriangle, CheckCircle, RefreshCw, Settings } from 'lucide-react';
import { PipelineData, FileInfo } from '../DebugPanel';

interface PipelineTabProps {
  pipelineData: PipelineData;
  onAddFile: (stage: 'origin' | 'refresh' | 'sim') => void;
  onRemoveFile: (stage: 'origin' | 'refresh' | 'sim', fileName: string) => void;
  onClearStage: (stage: 'origin' | 'refresh' | 'sim') => void;
}

interface PipelineStageProps {
  title: string;
  stage: 'origin' | 'refresh' | 'sim';
  files: FileInfo[];
  status: 'ready' | 'warning' | 'error';
  missingFile?: string;
  onAddFile: () => void;
  onRemoveFile: (fileName: string) => void;
  onClear: () => void;
}

function PipelineStage({ 
  title, 
  stage, 
  files, 
  status, 
  missingFile, 
  onAddFile, 
  onRemoveFile,
  onClear 
}: PipelineStageProps) {
  const statusIcon = {
    ready: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    error: <X className="w-4 h-4 text-red-500" />,
  };

  return (
    <div className="space-y-2">
      <Card className="bg-[#252525] border-gray-700">
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-xs font-semibold">{title}</span>
            {statusIcon[status]}
          </div>
        </div>
        <div className="p-3 space-y-2">
          {files.length > 0 ? (
            <div className="space-y-1.5">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#1e1e1e] rounded px-2 py-1.5 group hover:bg-[#2a2a2a] transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-300 truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">{file.size}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/20 hover:text-red-400"
                      onClick={() => onRemoveFile(file.name)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-xs">
              No files loaded
            </div>
          )}
          
          {missingFile && (
            <div className="flex items-center gap-2 text-yellow-500 text-xs bg-yellow-500/10 rounded px-2 py-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Missing: {missingFile}</span>
            </div>
          )}
        </div>
        <div className="p-2 border-t border-gray-700 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            onClick={onAddFile}
          >
            + Add File
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function PipelineTab({ 
  pipelineData, 
  onAddFile, 
  onRemoveFile, 
  onClearStage 
}: PipelineTabProps) {
  const originStatus = pipelineData.origin.length > 0 ? 'ready' : 'warning';
  const refreshStatus = pipelineData.refresh.length > 0 ? 'ready' : 'warning';
  const simStatus = pipelineData.sim.length > 0 && pipelineData.sim.some(f => f.name.includes('config')) 
    ? 'ready' 
    : pipelineData.sim.length > 0 
      ? 'warning' 
      : 'warning';

  const readyCount = [originStatus, refreshStatus, simStatus].filter(s => s === 'ready').length;
  const warningCount = [originStatus, refreshStatus, simStatus].filter(s => s === 'warning').length;

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">DATA PIPELINE</h3>
          </div>

          {/* Stage 1: Origin */}
          <PipelineStage
            title="1. ORIGIN DATA"
            stage="origin"
            files={pipelineData.origin}
            status={originStatus}
            onAddFile={() => onAddFile('origin')}
            onRemoveFile={(fileName) => onRemoveFile('origin', fileName)}
            onClear={() => onClearStage('origin')}
          />

          {/* Arrow */}
          <div className="flex justify-center py-1">
            <div className="text-gray-600 text-sm">↓ ↓ ↓</div>
          </div>

          {/* Stage 2: Refresh */}
          <PipelineStage
            title="2. REFRESH DATA"
            stage="refresh"
            files={pipelineData.refresh}
            status={refreshStatus}
            onAddFile={() => onAddFile('refresh')}
            onRemoveFile={(fileName) => onRemoveFile('refresh', fileName)}
            onClear={() => onClearStage('refresh')}
          />

          {/* Arrow */}
          <div className="flex justify-center py-1">
            <div className="text-gray-600 text-sm">↓ ↓ ↓</div>
          </div>

          {/* Stage 3: Sim */}
          <PipelineStage
            title="3. SIM DATA"
            stage="sim"
            files={pipelineData.sim}
            status={simStatus}
            missingFile={pipelineData.sim.length > 0 && !pipelineData.sim.some(f => f.name.includes('config')) ? 'sim_config.json' : undefined}
            onAddFile={() => onAddFile('sim')}
            onRemoveFile={(fileName) => onRemoveFile('sim', fileName)}
            onClear={() => onClearStage('sim')}
          />
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-[#1e1e1e] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Status:</span>
          <div className="flex items-center gap-3">
            <span className="text-green-500">{readyCount} Ready</span>
            {warningCount > 0 && <span className="text-yellow-500">{warningCount} Warning</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reload All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Configure
          </Button>
        </div>
      </div>
    </div>
  );
}
