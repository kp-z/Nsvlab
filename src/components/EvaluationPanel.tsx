import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTheme } from '../contexts/ThemeContext';
import { AIChat } from './evaluation/AIChat';
import { CheckerList } from './evaluation/CheckerList';
import { MetricsPanel } from './evaluation/MetricsPanel';

interface EvaluationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrame?: number;
  rangeStart?: number;
  rangeEnd?: number;
}

export interface Checker {
  id: string;
  name: string;
  description: string;
  code: string;
  inputFields: string[];
  outputMetrics: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  category: string;
}

export interface MetricResult {
  checkerId: string;
  checkerName: string;
  timestamp: number;
  metrics: {
    name: string;
    value: number | string | boolean;
    unit?: string;
    status?: 'pass' | 'warning' | 'fail';
  }[];
}

export function EvaluationPanel({ isOpen, onClose, currentFrame, rangeStart, rangeEnd }: EvaluationPanelProps) {
  const { theme } = useTheme();
  const [checkers, setCheckers] = useState<Checker[]>([
    {
      id: '1',
      name: 'Speed Safety Checker',
      description: '检查车辆速度是否在安全范围内',
      code: `function checkSpeed(gtSpeed: number): MetricResult {
  const maxSafeSpeed = 120;
  const warningSpeed = 100;
  
  return {
    speedValue: gtSpeed,
    status: gtSpeed > maxSafeSpeed ? 'fail' : gtSpeed > warningSpeed ? 'warning' : 'pass',
    message: gtSpeed > maxSafeSpeed ? '超速' : '正常'
  };
}`,
      inputFields: ['gtSpeed'],
      outputMetrics: ['speedValue', 'status', 'message'],
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-08'),
      status: 'published',
      category: 'Safety'
    },
    {
      id: '2',
      name: 'Lane Keeping Checker',
      description: '评估车道保持性能',
      code: `function checkLaneKeeping(lateralOffset: number): MetricResult {
  const threshold = 0.5;
  
  return {
    offset: lateralOffset,
    withinBounds: Math.abs(lateralOffset) < threshold,
    score: Math.max(0, 100 - Math.abs(lateralOffset) * 100)
  };
}`,
      inputFields: ['lateralOffset'],
      outputMetrics: ['offset', 'withinBounds', 'score'],
      createdAt: new Date('2026-02-05'),
      updatedAt: new Date('2026-02-09'),
      status: 'published',
      category: 'Performance'
    }
  ]);

  const [metricResults, setMetricResults] = useState<MetricResult[]>([
    {
      checkerId: '1',
      checkerName: 'Speed Safety Checker',
      timestamp: 10.5,
      metrics: [
        { name: 'speedValue', value: 85, unit: 'km/h', status: 'pass' },
        { name: 'status', value: 'pass', status: 'pass' },
        { name: 'message', value: '正常', status: 'pass' }
      ]
    },
    {
      checkerId: '2',
      checkerName: 'Lane Keeping Checker',
      timestamp: 10.5,
      metrics: [
        { name: 'offset', value: 0.3, unit: 'm' },
        { name: 'withinBounds', value: true, status: 'pass' },
        { name: 'score', value: 70, unit: 'points', status: 'pass' }
      ]
    }
  ]);

  const handleAddChecker = (checker: Omit<Checker, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newChecker: Checker = {
      ...checker,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCheckers([...checkers, newChecker]);
  };

  const handleUpdateChecker = (id: string, updates: Partial<Checker>) => {
    setCheckers(checkers.map(c => 
      c.id === id 
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    ));
  };

  const handleDeleteChecker = (id: string) => {
    setCheckers(checkers.filter(c => c.id !== id));
    setMetricResults(metricResults.filter(m => m.checkerId !== id));
  };

  const handlePublishChecker = (id: string) => {
    handleUpdateChecker(id, { status: 'published' });
  };

  const handleRunChecker = (checkerId: string) => {
    // Mock running a checker and generating results
    const checker = checkers.find(c => c.id === checkerId);
    if (!checker) return;

    // Generate mock metric results
    const mockResult: MetricResult = {
      checkerId,
      checkerName: checker.name,
      timestamp: currentFrame || 10.5,
      metrics: checker.outputMetrics.map(metric => ({
        name: metric,
        value: Math.random() > 0.5 ? Math.round(Math.random() * 100) : true,
        unit: metric.includes('speed') ? 'km/h' : metric.includes('score') ? 'points' : undefined,
        status: Math.random() > 0.7 ? 'warning' : 'pass'
      }))
    };

    setMetricResults([...metricResults, mockResult]);
  };

  if (!isOpen) return null;

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div>
          <h2 className="font-semibold">评测面板</h2>
          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            AI驱动的评测逻辑生成与管理
          </p>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className={`mx-4 mt-3 grid w-auto grid-cols-3 ${
          theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-100'
        }`}>
          <TabsTrigger value="chat">AI 对话</TabsTrigger>
          <TabsTrigger value="checkers">Checker 列表</TabsTrigger>
          <TabsTrigger value="metrics">评测指标</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full mt-0 p-4">
            <AIChat 
              onCheckerGenerated={handleAddChecker}
              currentFrame={currentFrame}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
          </TabsContent>

          <TabsContent value="checkers" className="h-full mt-0 p-4">
            <CheckerList
              checkers={checkers}
              onUpdate={handleUpdateChecker}
              onDelete={handleDeleteChecker}
              onPublish={handlePublishChecker}
              onRun={handleRunChecker}
            />
          </TabsContent>

          <TabsContent value="metrics" className="h-full mt-0 p-4">
            <MetricsPanel
              metricResults={metricResults}
              checkers={checkers}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}