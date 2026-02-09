import React, { useState } from 'react';
import { Edit, Trash2, Play, Upload, Save, Code, Calendar, Tag, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from '../../contexts/ThemeContext';
import { Checker } from '../EvaluationPanel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface CheckerListProps {
  checkers: Checker[];
  onUpdate: (id: string, updates: Partial<Checker>) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onRun: (id: string) => void;
}

export function CheckerList({ checkers, onUpdate, onDelete, onPublish, onRun }: CheckerListProps) {
  const { theme } = useTheme();
  const [editingChecker, setEditingChecker] = useState<Checker | null>(null);
  const [viewingChecker, setViewingChecker] = useState<Checker | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const categories = ['Safety', 'Performance', 'General'];

  const filteredCheckers = checkers.filter(checker => {
    if (filterCategory !== 'all' && checker.category !== filterCategory) return false;
    if (filterStatus !== 'all' && checker.status !== filterStatus) return false;
    return true;
  });

  const handleSaveEdit = () => {
    if (!editingChecker) return;
    
    onUpdate(editingChecker.id, {
      name: editingChecker.name,
      description: editingChecker.description,
      code: editingChecker.code,
      inputFields: editingChecker.inputFields,
      outputMetrics: editingChecker.outputMetrics,
      category: editingChecker.category
    });
    
    setEditingChecker(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className={`w-[140px] h-8 text-xs ${
            theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-300'
          }`}>
            <SelectValue placeholder="类别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有类别</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className={`w-[140px] h-8 text-xs ${
            theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-300'
          }`}>
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />
        
        <Badge variant="outline" className="h-8 px-3 flex items-center">
          {filteredCheckers.length} 个 Checker
        </Badge>
      </div>

      {/* Checker List */}
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {filteredCheckers.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">暂无 Checker</p>
              <p className="text-xs mt-1">前往 AI 对话标签页生成新的评测逻辑</p>
            </div>
          ) : (
            filteredCheckers.map((checker) => (
              <Card
                key={checker.id}
                className={`p-4 ${
                  theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{checker.name}</h3>
                      <Badge
                        variant={checker.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {checker.status === 'published' ? '已发布' : '草稿'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {checker.category}
                      </Badge>
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {checker.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      输入: {checker.inputFields.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      输出: {checker.outputMetrics.length} 个指标
                    </span>
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-3 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      更新: {formatDate(checker.updatedAt)}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => setViewingChecker(checker)}
                      title="查看代码"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => onRun(checker.id)}
                      title="运行评测"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => setEditingChecker(checker)}
                      title="编辑"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    {checker.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-green-600 hover:text-green-700"
                        onClick={() => onPublish(checker.id)}
                        title="发布"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-red-600 hover:text-red-700"
                      onClick={() => setDeletingId(checker.id)}
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* View Code Dialog */}
      <Dialog open={!!viewingChecker} onOpenChange={() => setViewingChecker(null)}>
        <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              {viewingChecker?.name}
            </DialogTitle>
            <DialogDescription>{viewingChecker?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs">输入字段</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {viewingChecker?.inputFields.map(field => (
                  <Badge key={field} variant="outline" className="text-xs">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-xs">输出指标</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {viewingChecker?.outputMetrics.map(metric => (
                  <Badge key={metric} variant="outline" className="text-xs">
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-xs">代码</Label>
              <div className={`mt-1 rounded p-3 text-xs font-mono overflow-x-auto max-h-[400px] ${
                theme === 'dark' ? 'bg-[#0d0d0d] border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}>
                <pre className="whitespace-pre-wrap">{viewingChecker?.code}</pre>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingChecker(null)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingChecker} onOpenChange={() => setEditingChecker(null)}>
        <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle>编辑 Checker</DialogTitle>
            <DialogDescription>修改评测逻辑的配置和代码</DialogDescription>
          </DialogHeader>
          
          {editingChecker && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  value={editingChecker.name}
                  onChange={(e) => setEditingChecker({ ...editingChecker, name: e.target.value })}
                  className={theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="description">描述</Label>
                <Input
                  id="description"
                  value={editingChecker.description}
                  onChange={(e) => setEditingChecker({ ...editingChecker, description: e.target.value })}
                  className={theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="category">类别</Label>
                <Select
                  value={editingChecker.category}
                  onValueChange={(value) => setEditingChecker({ ...editingChecker, category: value })}
                >
                  <SelectTrigger className={theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="code">代码</Label>
                <Textarea
                  id="code"
                  value={editingChecker.code}
                  onChange={(e) => setEditingChecker({ ...editingChecker, code: e.target.value })}
                  className={`font-mono text-xs min-h-[200px] ${
                    theme === 'dark' ? 'bg-[#0d0d0d] border-gray-700' : 'bg-gray-50'
                  }`}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingChecker(null)}>
              取消
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className={theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white'}>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。删除后，该 Checker 的所有评测结果也将被清除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
