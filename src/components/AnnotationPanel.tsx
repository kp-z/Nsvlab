import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  X, 
  Plus, 
  Tag, 
  Clock, 
  Save, 
  Download, 
  Upload,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Bookmark,
  Target
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AnnotationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrame: number;
  rangeStart: number;
  rangeEnd: number;
}

interface Annotation {
  id: string;
  label: string;
  category: string;
  startTime: number;
  endTime: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'flagged';
}

export function AnnotationPanel({ isOpen, onClose, currentFrame, rangeStart, rangeEnd }: AnnotationPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      label: 'Lane Change',
      category: 'driving_behavior',
      startTime: 8.5,
      endTime: 10.2,
      description: 'Vehicle changed from left lane to right lane',
      timestamp: '2024-02-06 10:23:45',
      status: 'verified'
    },
    {
      id: '2',
      label: 'Obstacle Detected',
      category: 'scene_event',
      startTime: 12.0,
      endTime: 13.5,
      description: 'Static obstacle on road',
      timestamp: '2024-02-06 10:24:12',
      status: 'pending'
    },
    {
      id: '3',
      label: 'Speed Anomaly',
      category: 'anomaly',
      startTime: 6.0,
      endTime: 7.5,
      description: 'Unexpected speed increase',
      timestamp: '2024-02-06 10:22:30',
      status: 'flagged'
    }
  ]);

  const [newAnnotation, setNewAnnotation] = useState({
    label: '',
    category: 'driving_behavior',
    startTime: currentFrame,
    endTime: currentFrame + 1,
    description: ''
  });

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = [
    { value: 'driving_behavior', label: 'Driving Behavior', color: 'blue' },
    { value: 'scene_event', label: 'Scene Event', color: 'purple' },
    { value: 'anomaly', label: 'Anomaly', color: 'red' },
    { value: 'traffic_sign', label: 'Traffic Sign', color: 'yellow' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'gray';
  };

  const handleCreateAnnotation = () => {
    if (!newAnnotation.label.trim()) return;

    const annotation: Annotation = {
      id: Date.now().toString(),
      label: newAnnotation.label,
      category: newAnnotation.category,
      startTime: newAnnotation.startTime,
      endTime: newAnnotation.endTime,
      description: newAnnotation.description,
      timestamp: new Date().toLocaleString('zh-CN'),
      status: 'pending'
    };

    setAnnotations([...annotations, annotation]);
    setNewAnnotation({
      label: '',
      category: 'driving_behavior',
      startTime: currentFrame,
      endTime: currentFrame + 1,
      description: ''
    });
    setIsCreating(false);
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  const handleUpdateStatus = (id: string, status: 'pending' | 'verified' | 'flagged') => {
    setAnnotations(annotations.map(a => 
      a.id === id ? { ...a, status } : a
    ));
  };

  const handleSetTimeRange = () => {
    setNewAnnotation({
      ...newAnnotation,
      startTime: rangeStart,
      endTime: rangeEnd
    });
  };

  const handleExportAnnotations = () => {
    const dataStr = JSON.stringify(annotations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
      {/* Header */}
      <div className={`h-12 ${isDark ? 'bg-[#252525] border-gray-700' : 'bg-gray-50 border-gray-300'} border-b flex items-center justify-between px-4 flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            ANNOTATION MODE
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {annotations.length} 标注
          </Badge>
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

      <Tabs defaultValue="create" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className={`flex-shrink-0 mx-4 mt-3 grid w-auto grid-cols-3 ${isDark ? 'bg-[#252525]' : 'bg-gray-100'}`}>
          <TabsTrigger value="create" className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            新建标注
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs">
            <Bookmark className="w-3 h-3 mr-1" />
            标注列表
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            导出
          </TabsTrigger>
        </TabsList>

        {/* Create Annotation Tab */}
        <TabsContent value="create" className="flex-1 overflow-hidden mt-3">
          <ScrollArea className="h-full">
            <div className="px-4 pb-4 space-y-4">
              {/* Current Time Info */}
              <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-blue-50 border-blue-200'} p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    当前时间轴位置
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    当前帧: <span className={`font-mono ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{currentFrame.toFixed(1)}s</span>
                  </div>
                  <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    选择范围: <span className={`font-mono ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{rangeStart.toFixed(1)}s - {rangeEnd.toFixed(1)}s</span>
                  </div>
                </div>
              </Card>

              {/* Create Form */}
              <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-4`}>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                    新建标注
                  </h4>
                </div>

                <div className="space-y-4">
                  {/* Label */}
                  <div className="space-y-2">
                    <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      标签名称 *
                    </Label>
                    <Input
                      value={newAnnotation.label}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, label: e.target.value })}
                      placeholder="例如：车道变更、急刹车..."
                      className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      类别
                    </Label>
                    <Select
                      value={newAnnotation.category}
                      onValueChange={(value) => setNewAnnotation({ ...newAnnotation, category: value })}
                    >
                      <SelectTrigger className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full bg-${cat.color}-500`}></div>
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Range */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        时间范围
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSetTimeRange}
                        className="h-6 px-2 text-[10px]"
                      >
                        使用当前选择范围
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          value={newAnnotation.startTime}
                          onChange={(e) => setNewAnnotation({ ...newAnnotation, startTime: parseFloat(e.target.value) })}
                          step="0.1"
                          className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                        <div className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>开始时间 (s)</div>
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={newAnnotation.endTime}
                          onChange={(e) => setNewAnnotation({ ...newAnnotation, endTime: parseFloat(e.target.value) })}
                          step="0.1"
                          className={`h-9 text-xs ${isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                        <div className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>结束时间 (s)</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      描述（可选）
                    </Label>
                    <textarea
                      value={newAnnotation.description}
                      onChange={(e) => setNewAnnotation({ ...newAnnotation, description: e.target.value })}
                      placeholder="添加详细描述..."
                      rows={3}
                      className={`w-full px-3 py-2 text-xs rounded border resize-none ${
                        isDark 
                          ? 'bg-[#1e1e1e] border-gray-600 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>

                  {/* Create Button */}
                  <Button
                    onClick={handleCreateAnnotation}
                    disabled={!newAnnotation.label.trim()}
                    className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    创建标注
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                    快速标注
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '车道保持', category: 'driving_behavior' },
                    { label: '转向', category: 'driving_behavior' },
                    { label: '加速', category: 'driving_behavior' },
                    { label: '减速', category: 'driving_behavior' },
                  ].map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewAnnotation({
                        ...newAnnotation,
                        label: preset.label,
                        category: preset.category
                      })}
                      className={`h-8 text-xs ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Annotation List Tab */}
        <TabsContent value="list" className="flex-1 overflow-hidden mt-3">
          <ScrollArea className="h-full">
            <div className="px-4 pb-4 space-y-3">
              {annotations.length === 0 ? (
                <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <div className="text-sm">暂无标注</div>
                  <div className="text-xs mt-1">在"新建标注"标签页创建第一个标注</div>
                </div>
              ) : (
                annotations.map((annotation) => (
                  <Card 
                    key={annotation.id} 
                    className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-3`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full bg-${getCategoryColor(annotation.category)}-500`}></div>
                          <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            {annotation.label}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className={`text-[9px] h-4 ${
                              annotation.status === 'verified' 
                                ? 'bg-green-600/20 text-green-400 border-green-600/40'
                                : annotation.status === 'flagged'
                                ? 'bg-red-600/20 text-red-400 border-red-600/40'
                                : 'bg-gray-600/20 text-gray-400 border-gray-600/40'
                            }`}
                          >
                            {annotation.status === 'verified' ? '已验证' : annotation.status === 'flagged' ? '已标记' : '待处理'}
                          </Badge>
                        </div>
                        <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-1`}>
                          {categories.find(c => c.value === annotation.category)?.label}
                        </div>
                      </div>
                    </div>

                    <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {annotation.description || '无描述'}
                    </div>

                    <div className={`flex items-center gap-3 mb-3 text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {annotation.startTime.toFixed(1)}s - {annotation.endTime.toFixed(1)}s
                      </div>
                      <div>
                        时长: {(annotation.endTime - annotation.startTime).toFixed(1)}s
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(annotation.id, 'verified')}
                        className={`h-7 px-2 text-[10px] ${
                          annotation.status === 'verified' 
                            ? 'bg-green-600/20 text-green-400' 
                            : isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        验证
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(annotation.id, 'flagged')}
                        className={`h-7 px-2 text-[10px] ${
                          annotation.status === 'flagged' 
                            ? 'bg-red-600/20 text-red-400' 
                            : isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        标记
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAnnotation(annotation.id)}
                        className={`h-7 w-7 p-0 ml-auto ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="flex-1 overflow-hidden mt-3">
          <ScrollArea className="h-full">
            <div className="px-4 pb-4 space-y-4">
              {/* Statistics */}
              <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-4`}>
                <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide mb-3`}>
                  标注统计
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {annotations.length}
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>总标注数</div>
                  </div>
                  <div className={`p-3 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold text-green-500`}>
                      {annotations.filter(a => a.status === 'verified').length}
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>已验证</div>
                  </div>
                  <div className={`p-3 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold text-yellow-500`}>
                      {annotations.filter(a => a.status === 'pending').length}
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>待处理</div>
                  </div>
                  <div className={`p-3 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold text-red-500`}>
                      {annotations.filter(a => a.status === 'flagged').length}
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>已标记</div>
                  </div>
                </div>
              </Card>

              {/* Category Breakdown */}
              <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-4`}>
                <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide mb-3`}>
                  类别分布
                </h4>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const count = annotations.filter(a => a.category === cat.value).length;
                    const percentage = annotations.length > 0 ? (count / annotations.length) * 100 : 0;
                    return (
                      <div key={cat.value}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-${cat.color}-500`}></div>
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{cat.label}</span>
                          </div>
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{count}</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-full bg-${cat.color}-500 transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Export Actions */}
              <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-4`}>
                <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide mb-3`}>
                  导出与导入
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={handleExportAnnotations}
                    className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <Download className="w-4 h-4" />
                    导出为 JSON
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full h-9 gap-2 ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
                  >
                    <Upload className="w-4 h-4" />
                    导入标注文件
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full h-9 gap-2 ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
                  >
                    <Save className="w-4 h-4" />
                    保存到云端
                  </Button>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
