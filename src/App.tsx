import React, { useState, useRef } from 'react';
import { TimelinePanel } from './components/TimelinePanel';
import { DebugPanel } from './components/DebugPanel';
import { DrivePanel } from './components/DrivePanel';
import { AnnotationPanel } from './components/AnnotationPanel';
import { EvaluationPanel } from './components/EvaluationPanel';
import { Button } from './components/ui/button';
import { Bug, ChevronLeft, ChevronRight, Sun, Moon, Gamepad2, Tag, BarChart3 } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [panelMode, setPanelMode] = useState<'debug' | 'drive' | 'annotation' | 'evaluation' | null>(null);
  const [panelWidth, setPanelWidth] = useState(440);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);
  
  // Timeline state - lifted up to share with DebugPanel
  const [currentTime, setCurrentTime] = useState(10);
  const [timeRange, setTimeRange] = useState<[number, number]>([5, 15]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = panelWidth;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const delta = resizeStartX.current - e.clientX;
    const newWidth = Math.max(300, Math.min(800, resizeStartWidth.current + delta));
    setPanelWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div className={`h-screen w-screen ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-50'} flex overflow-hidden`}>
      {/* Main Content Area - will compress when debug panel opens */}
      <div 
        className="flex flex-col transition-all duration-500 ease-in-out"
        style={{ 
          width: panelMode ? `calc(100vw - ${panelWidth}px)` : '100vw'
        }}
      >
        {/* Main visualization area */}
        <div className={`flex-1 ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'} relative overflow-hidden`}>
          {/* Top-right buttons - Vertical layout for mode toggles */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            {/* Mode Toggles - Vertical Stack */}
            <div className="flex flex-col gap-2">
              {/* Debug Mode Toggle Button */}
              <Button
                onClick={() => setPanelMode(panelMode === 'debug' ? null : 'debug')}
                className={`h-9 px-4 text-xs gap-2 transition-all duration-300 ${
                  panelMode === 'debug' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                    : theme === 'dark'
                      ? 'bg-[#1e1e1e] hover:bg-[#252525] text-gray-300 border border-gray-700'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm'
                }`}
              >
                <Bug className="w-4 h-4" />
                <span>Debug</span>
                {panelMode === 'debug' ? (
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 ml-1" />
                )}
              </Button>

              {/* Drive Mode Toggle Button */}
              <Button
                onClick={() => setPanelMode(panelMode === 'drive' ? null : 'drive')}
                className={`h-9 px-4 text-xs gap-2 transition-all duration-300 ${
                  panelMode === 'drive' 
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                    : theme === 'dark'
                      ? 'bg-[#1e1e1e] hover:bg-[#252525] text-gray-300 border border-gray-700'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Drive</span>
                {panelMode === 'drive' ? (
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 ml-1" />
                )}
              </Button>

              {/* Annotation Mode Toggle Button */}
              <Button
                onClick={() => setPanelMode(panelMode === 'annotation' ? null : 'annotation')}
                className={`h-9 px-4 text-xs gap-2 transition-all duration-300 ${
                  panelMode === 'annotation' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                    : theme === 'dark'
                      ? 'bg-[#1e1e1e] hover:bg-[#252525] text-gray-300 border border-gray-700'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Annotation</span>
                {panelMode === 'annotation' ? (
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 ml-1" />
                )}
              </Button>

              {/* Evaluation Mode Toggle Button */}
              <Button
                onClick={() => setPanelMode(panelMode === 'evaluation' ? null : 'evaluation')}
                className={`h-9 px-4 text-xs gap-2 transition-all duration-300 ${
                  panelMode === 'evaluation' 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                    : theme === 'dark'
                      ? 'bg-[#1e1e1e] hover:bg-[#252525] text-gray-300 border border-gray-700'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Evaluation</span>
                {panelMode === 'evaluation' ? (
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 ml-1" />
                )}
              </Button>
            </div>

            {/* Theme Toggle Button - At Bottom */}
            <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-700">
              <Button
                onClick={toggleTheme}
                className={`h-9 w-9 p-0 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#1e1e1e] hover:bg-[#252525] text-yellow-400 border border-gray-700'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm'
                }`}
                title={theme === 'dark' ? '切换到白天模式' : '切换到暗黑模式'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Placeholder for main view */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-lg ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              数据可视化区域
            </div>
          </div>
          
          {/* Grid lines to simulate the reference */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/4 top-0 bottom-0 w-px bg-yellow-600/30"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-500/30"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-px bg-green-500/30"></div>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-orange-500/30"></div>
          </div>
        </div>

        {/* Timeline panel at bottom */}
        <TimelinePanel 
          currentTime={currentTime}
          onTimeChange={setCurrentTime}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>

      {/* Debug Panel - slides in from right with resizable width */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-300'
        } border-l overflow-hidden flex-shrink-0 relative`}
        style={{
          width: panelMode ? `${panelWidth}px` : '0px',
          opacity: panelMode ? 1 : 0,
          transform: panelMode ? 'translateX(0)' : 'translateX(20px)'
        }}
      >
        {/* Resize Handle */}
        {panelMode && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize ${
              isResizing 
                ? 'bg-blue-500' 
                : theme === 'dark'
                  ? 'bg-transparent hover:bg-gray-600'
                  : 'bg-transparent hover:bg-gray-400'
            } transition-colors z-50`}
            onMouseDown={handleMouseDown}
          />
        )}
        {panelMode === 'debug' && (
          <DebugPanel 
            isOpen={panelMode === 'debug'} 
            onClose={() => setPanelMode(null)}
            currentFrame={currentTime}
            rangeStart={timeRange[0]}
            rangeEnd={timeRange[1]}
          />
        )}
        {panelMode === 'drive' && <DrivePanel isOpen={panelMode === 'drive'} onClose={() => setPanelMode(null)} />}
        {panelMode === 'annotation' && (
          <AnnotationPanel 
            isOpen={panelMode === 'annotation'} 
            onClose={() => setPanelMode(null)}
            currentFrame={currentTime}
            rangeStart={timeRange[0]}
            rangeEnd={timeRange[1]}
          />
        )}
        {panelMode === 'evaluation' && (
          <EvaluationPanel 
            isOpen={panelMode === 'evaluation'} 
            onClose={() => setPanelMode(null)}
            currentFrame={currentTime}
            rangeStart={timeRange[0]}
            rangeEnd={timeRange[1]}
          />
        )}
      </div>

      {/* Resizing Overlay */}
      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}