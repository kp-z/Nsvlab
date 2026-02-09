import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  generatedChecker?: {
    name: string;
    description: string;
    code: string;
    inputFields: string[];
    outputMetrics: string[];
    category: string;
  };
  timestamp: Date;
}

interface AIChatProps {
  onCheckerGenerated: (checker: {
    name: string;
    description: string;
    code: string;
    inputFields: string[];
    outputMetrics: string[];
    status: 'draft' | 'published';
    category: string;
  }) => void;
  currentFrame?: number;
  rangeStart?: number;
  rangeEnd?: number;
}

export function AIChat({ onCheckerGenerated, currentFrame, rangeStart, rangeEnd }: AIChatProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是评测AI助手。我可以帮你生成评测逻辑（Checker）。请描述你想要检测什么指标，例如："检查车辆速度是否超过限制"或"评估横向偏移是否在安全范围内"。',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateChecker = (userRequest: string): Message['generatedChecker'] => {
    // Mock AI logic generation based on keywords
    const lowerRequest = userRequest.toLowerCase();
    
    if (lowerRequest.includes('速度') || lowerRequest.includes('speed')) {
      return {
        name: 'Custom Speed Checker',
        description: '根据用户需求生成的速度检查器',
        code: `function checkSpeed(gtSpeed: number, maxSpeed: number = 120): CheckResult {
  const warningThreshold = maxSpeed * 0.8;
  
  if (gtSpeed > maxSpeed) {
    return {
      status: 'fail',
      value: gtSpeed,
      message: \`速度\${gtSpeed}km/h超过限制\${maxSpeed}km/h\`,
      severity: 'high'
    };
  } else if (gtSpeed > warningThreshold) {
    return {
      status: 'warning',
      value: gtSpeed,
      message: '速度接近限制',
      severity: 'medium'
    };
  }
  
  return {
    status: 'pass',
    value: gtSpeed,
    message: '速度正常',
    severity: 'low'
  };
}`,
        inputFields: ['gtSpeed', 'maxSpeed'],
        outputMetrics: ['status', 'value', 'message', 'severity'],
        category: 'Safety'
      };
    } else if (lowerRequest.includes('车道') || lowerRequest.includes('lane') || lowerRequest.includes('横向')) {
      return {
        name: 'Lane Deviation Checker',
        description: '检测车道偏离情况',
        code: `function checkLaneDeviation(lateralOffset: number, laneWidth: number = 3.5): CheckResult {
  const maxDeviation = laneWidth / 2;
  const warningDeviation = maxDeviation * 0.7;
  const absOffset = Math.abs(lateralOffset);
  
  if (absOffset > maxDeviation) {
    return {
      status: 'fail',
      offset: lateralOffset,
      deviationRatio: absOffset / maxDeviation,
      message: '车道偏离超出范围'
    };
  } else if (absOffset > warningDeviation) {
    return {
      status: 'warning',
      offset: lateralOffset,
      deviationRatio: absOffset / maxDeviation,
      message: '车道偏离警告'
    };
  }
  
  return {
    status: 'pass',
    offset: lateralOffset,
    deviationRatio: absOffset / maxDeviation,
    message: '车道保持良好'
  };
}`,
        inputFields: ['lateralOffset', 'laneWidth'],
        outputMetrics: ['status', 'offset', 'deviationRatio', 'message'],
        category: 'Performance'
      };
    } else if (lowerRequest.includes('距离') || lowerRequest.includes('distance') || lowerRequest.includes('跟车')) {
      return {
        name: 'Following Distance Checker',
        description: '检查跟车距离安全性',
        code: `function checkFollowingDistance(distance: number, speed: number): CheckResult {
  const minSafeDistance = speed * 0.5; // 简化模型：速度的一半作为最小安全距离
  const warningDistance = minSafeDistance * 1.5;
  
  if (distance < minSafeDistance) {
    return {
      status: 'fail',
      distance: distance,
      minRequired: minSafeDistance,
      riskLevel: 'high',
      message: '跟车距离过近'
    };
  } else if (distance < warningDistance) {
    return {
      status: 'warning',
      distance: distance,
      minRequired: minSafeDistance,
      riskLevel: 'medium',
      message: '建议增加跟车距离'
    };
  }
  
  return {
    status: 'pass',
    distance: distance,
    minRequired: minSafeDistance,
    riskLevel: 'low',
    message: '跟车距离安全'
  };
}`,
        inputFields: ['distance', 'speed'],
        outputMetrics: ['status', 'distance', 'minRequired', 'riskLevel', 'message'],
        category: 'Safety'
      };
    } else {
      // Default generic checker
      return {
        name: 'Generic Data Checker',
        description: '通用数据检查器',
        code: `function checkData(value: number, threshold: number = 100): CheckResult {
  return {
    status: value > threshold ? 'fail' : 'pass',
    value: value,
    threshold: threshold,
    withinRange: value <= threshold,
    message: value > threshold ? '数值超出阈值' : '数值正常'
  };
}`,
        inputFields: ['value', 'threshold'],
        outputMetrics: ['status', 'value', 'threshold', 'withinRange', 'message'],
        category: 'General'
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const generatedChecker = generateChecker(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `我已经根据你的需求生成了一个评测逻辑。这个Checker将会：\n\n• 输入字段：${generatedChecker.inputFields.join(', ')}\n• 输出指标：${generatedChecker.outputMetrics.join(', ')}\n• 类别：${generatedChecker.category}\n\n你可以点击下方的"保存为草稿"按钮保存这个Checker，或者继续修改需求。`,
        generatedChecker,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveChecker = (checker: Message['generatedChecker']) => {
    if (!checker) return;
    
    onCheckerGenerated({
      ...checker,
      status: 'draft'
    });

    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✓ Checker "${checker.name}" 已保存为草稿。你可以在"Checker 列表"标签页中查看和管理它。`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      AI 助手
                    </span>
                  </div>
                )}
                
                <Card className={`p-3 ${
                  message.role === 'user'
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-500 text-white border-blue-500'
                    : theme === 'dark'
                      ? 'bg-[#2a2a2a] border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Generated Checker Display */}
                  {message.generatedChecker && (
                    <div className={`mt-3 pt-3 border-t ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          <span className="font-semibold text-sm">{message.generatedChecker.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {message.generatedChecker.category}
                        </Badge>
                      </div>
                      
                      <p className="text-xs mb-2 opacity-80">
                        {message.generatedChecker.description}
                      </p>
                      
                      <div className={`rounded p-2 text-xs font-mono overflow-x-auto ${
                        theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
                      }`}>
                        <pre className="whitespace-pre-wrap">{message.generatedChecker.code}</pre>
                      </div>
                      
                      <Button
                        onClick={() => handleSaveChecker(message.generatedChecker)}
                        size="sm"
                        className="mt-2 w-full"
                        variant="outline"
                      >
                        保存为草稿
                      </Button>
                    </div>
                  )}
                </Card>
                
                {message.role === 'user' && (
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      你
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="max-w-[85%]">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    AI 助手正在生成...
                  </span>
                </div>
                <Card className={`p-3 ${
                  theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`rounded-lg p-2 ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-50'}`}>
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className={`w-4 h-4 mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              提示：描述你想要的评测逻辑，例如"检查速度是否超过120"、"评估车道保持性能"等
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="描述你的评测需求..."
            className={`flex-1 min-h-[60px] max-h-[120px] resize-none ${
              theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-300'
            }`}
            disabled={isGenerating}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}