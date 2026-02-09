import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { FileText, Database, ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TaskBagTabProps {
  selectedStage: 'origin' | 'refresh' | 'sim';
  currentFrame: number;
  rangeStart: number;
  rangeEnd: number;
  timeMode: 'frame' | 'range';
}

export function TaskBagTab({ selectedStage, currentFrame, rangeStart, rangeEnd, timeMode }: TaskBagTabProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [taskInfoExpanded, setTaskInfoExpanded] = useState(true);
  const [bagInfoExpanded, setBagInfoExpanded] = useState(true);

  // Mock data - would come from actual pipeline data
  const taskData = {
    base: {
      taskId: 'TASK-2024-001',
      event: 'Highway Lane Change',
      scenario: 'Multi-vehicle overtake',
      duration: '45.3s',
      status: 'Completed'
    },
    test: {
      taskId: 'TASK-2024-002',
      event: 'Highway Lane Change',
      scenario: 'Multi-vehicle overtake (modified)',
      duration: '45.5s',
      status: 'Completed'
    }
  };

  const bagData = {
    base: {
      bagName: 'highway_20240115_base.bag',
      size: '2.4GB',
      duration: '120.5s',
      topics: '47',
      startTime: '2024-01-15 14:30:22',
      endTime: '2024-01-15 14:32:23'
    },
    test: {
      bagName: 'highway_20240115_test.bag',
      size: '2.6GB',
      duration: '120.8s',
      topics: '47',
      startTime: '2024-01-15 15:20:11',
      endTime: '2024-01-15 15:22:12'
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-[#252525]' : 'bg-white'}`}>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Task & Event Info - Collapsible */}
          <CollapsibleSection
            title="Task & Event Information"
            icon={<FileText className="w-4 h-4" />}
            isExpanded={taskInfoExpanded}
            onToggle={() => setTaskInfoExpanded(!taskInfoExpanded)}
            isDark={isDark}
          >
            <div className="grid grid-cols-2 gap-3">
              <DataCard
                title="Base"
                color="blue"
                data={taskData.base}
                isDark={isDark}
              />
              <DataCard
                title="Test"
                color="purple"
                data={taskData.test}
                isDark={isDark}
              />
            </div>
          </CollapsibleSection>

          {/* Bag Information - Collapsible */}
          <CollapsibleSection
            title="Bag Information"
            icon={<Database className="w-4 h-4" />}
            isExpanded={bagInfoExpanded}
            onToggle={() => setBagInfoExpanded(!bagInfoExpanded)}
            isDark={isDark}
          >
            <div className="grid grid-cols-2 gap-3">
              <DataCard
                title="Base"
                color="blue"
                data={bagData.base}
                isDark={isDark}
              />
              <DataCard
                title="Test"
                color="purple"
                data={bagData.test}
                isDark={isDark}
              />
            </div>
          </CollapsibleSection>
        </div>
      </ScrollArea>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  isDark,
  children
}: CollapsibleSectionProps) {
  return (
    <div className={`rounded-lg border ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-300 bg-gray-50'}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-opacity-80 transition-colors ${
          isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>
            {icon}
          </span>
          <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        )}
      </button>
      {isExpanded && (
        <div className={`px-4 pb-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="pt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DataCardProps {
  title: string;
  color: 'blue' | 'purple';
  data: Record<string, string>;
  isDark: boolean;
}

function DataCard({ title, color, data, isDark }: DataCardProps) {
  const colorClasses = color === 'blue'
    ? {
        border: isDark ? 'border-blue-500/30' : 'border-blue-300',
        bg: isDark ? 'bg-blue-500/5' : 'bg-blue-50',
        header: isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-100 border-blue-300',
        text: isDark ? 'text-blue-400' : 'text-blue-600'
      }
    : {
        border: isDark ? 'border-purple-500/30' : 'border-purple-300',
        bg: isDark ? 'bg-purple-500/5' : 'bg-purple-50',
        header: isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-100 border-purple-300',
        text: isDark ? 'text-purple-400' : 'text-purple-600'
      };

  return (
    <div className={`rounded-lg border ${colorClasses.border} ${colorClasses.bg} overflow-hidden`}>
      <div className={`px-3 py-2 border-b ${colorClasses.header}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
          <span className={`text-xs font-semibold ${colorClasses.text}`}>
            {title}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className={`text-[10px] font-medium uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className={`text-xs mt-0.5 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}