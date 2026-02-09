import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from '../../contexts/ThemeContext';
import { Checker, MetricResult } from '../EvaluationPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface MetricsPanelProps {
  metricResults: MetricResult[];
  checkers: Checker[];
}

export function MetricsPanel({ metricResults, checkers }: MetricsPanelProps) {
  const { theme } = useTheme();
  const [selectedChecker, setSelectedChecker] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  const filteredResults = selectedChecker === 'all' 
    ? metricResults 
    : metricResults.filter(r => r.checkerId === selectedChecker);

  const getStatusIcon = (status?: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'fail':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return theme === 'dark' ? 'bg-green-900/30 text-green-400 border-green-700' : 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700' : 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'fail':
        return theme === 'dark' ? 'bg-red-900/30 text-red-400 border-red-700' : 'bg-red-50 text-red-700 border-red-200';
      default:
        return theme === 'dark' ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Calculate statistics
  const stats = {
    total: metricResults.length,
    pass: metricResults.filter(r => r.metrics.some(m => m.status === 'pass')).length,
    warning: metricResults.filter(r => r.metrics.some(m => m.status === 'warning')).length,
    fail: metricResults.filter(r => r.metrics.some(m => m.status === 'fail')).length
  };

  // Prepare chart data
  const chartData = metricResults.map(result => ({
    time: result.timestamp.toFixed(1),
    checker: result.checkerName,
    ...result.metrics.reduce((acc, metric) => {
      if (typeof metric.value === 'number') {
        acc[metric.name] = metric.value;
      }
      return acc;
    }, {} as Record<string, number>)
  }));

  const statusDistributionData = [
    { name: '通过', value: stats.pass, color: '#10b981' },
    { name: '警告', value: stats.warning, color: '#f59e0b' },
    { name: '失败', value: stats.fail, color: '#ef4444' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header with filters */}
      <div className="flex items-center gap-2 mb-4">
        <Select value={selectedChecker} onValueChange={setSelectedChecker}>
          <SelectTrigger className={`w-[180px] h-8 text-xs ${
            theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-300'
          }`}>
            <SelectValue placeholder="选择 Checker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有 Checker</SelectItem>
            {checkers.map(checker => (
              <SelectItem key={checker.id} value={checker.id}>
                {checker.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'chart')}>
          <SelectTrigger className={`w-[120px] h-8 text-xs ${
            theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-300'
          }`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">列表视图</SelectItem>
            <SelectItem value="chart">图表视图</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Badge variant="outline" className="h-8 px-3 flex items-center">
          {filteredResults.length} 条结果
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Card className={`p-3 ${theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="text-xs text-gray-500 mb-1">总数</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className={`p-3 ${theme === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`}>
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">通过</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.pass}</div>
        </Card>
        <Card className={`p-3 ${theme === 'dark' ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">警告</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.warning}</div>
        </Card>
        <Card className={`p-3 ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
          <div className="text-xs text-red-600 dark:text-red-400 mb-1">失败</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.fail}</div>
        </Card>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {filteredResults.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">暂无评测结果</p>
            <p className="text-xs mt-1">在 Checker 列表中运行评测以生成结果</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredResults.map((result, idx) => (
              <Card
                key={idx}
                className={`p-4 ${
                  theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{result.checkerName}</h3>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      时间: {result.timestamp.toFixed(2)}s
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {result.metrics.length} 个指标
                  </Badge>
                </div>

                <div className="space-y-2">
                  {result.metrics.map((metric, metricIdx) => (
                    <div
                      key={metricIdx}
                      className={`flex items-center justify-between p-2 rounded border ${
                        getStatusColor(metric.status)
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        <span className="text-xs font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {typeof metric.value === 'boolean' 
                            ? metric.value ? '✓' : '✗'
                            : typeof metric.value === 'number'
                            ? metric.value.toFixed(2)
                            : metric.value
                          }
                        </span>
                        {metric.unit && (
                          <span className="text-xs opacity-70">{metric.unit}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Distribution Pie Chart */}
            <Card className={`p-4 ${theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold text-sm mb-3">状态分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Metrics Trend Line Chart */}
            {chartData.length > 0 && (
              <Card className={`p-4 ${theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="font-semibold text-sm mb-3">指标趋势</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                      stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
                    />
                    <YAxis 
                      tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                      stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px' }}
                      iconType="line"
                    />
                    {Object.keys(chartData[0] || {})
                      .filter(key => key !== 'time' && key !== 'checker' && typeof chartData[0][key] === 'number')
                      .map((key, idx) => (
                        <Line 
                          key={key} 
                          type="monotone" 
                          dataKey={key} 
                          stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx % 5]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      ))
                    }
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Metrics Comparison Bar Chart */}
            <Card className={`p-4 ${theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold text-sm mb-3">指标对比</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                    stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
                  />
                  <YAxis 
                    tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                    stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                  {Object.keys(chartData[0] || {})
                    .filter(key => key !== 'time' && key !== 'checker' && typeof chartData[0][key] === 'number')
                    .map((key, idx) => (
                      <Bar 
                        key={key} 
                        dataKey={key} 
                        fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx % 5]}
                      />
                    ))
                  }
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}