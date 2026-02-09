import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Download, FileJson, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';

export function MetadataTab() {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">SCENARIO METADATA</h3>
          </div>

          {/* Task Information */}
          <Card className="bg-[#252525] border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-xs font-semibold text-gray-300">Task Information</h4>
            </div>
            <div className="p-3 space-y-2">
              <InfoRow label="Task ID" value="TSK_20260201_001" />
              <InfoRow label="Scenario" value="Highway_Overtake" />
              <InfoRow label="Set ID" value="Scenario_Set_001" />
              <InfoRow 
                label="Status" 
                value={
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-yellow-400">Completed w/ Warns</span>
                  </div>
                }
              />
              <InfoRow label="Duration" value="30.0s" />
              <InfoRow label="Timestamp" value="2026-02-01 14:23:11" />
            </div>
          </Card>

          {/* Environment */}
          <Card className="bg-[#252525] border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-xs font-semibold text-gray-300">Environment</h4>
            </div>
            <div className="p-3 space-y-2">
              <InfoRow label="Weather" value="☀️ Sunny" />
              <InfoRow label="Time" value="🌅 14:00 (Afternoon)" />
              <InfoRow label="Traffic" value="🚗 Medium Density" />
              <InfoRow label="Road Type" value="🛣 Highway (3 lanes)" />
            </div>
          </Card>

          {/* Bag Files */}
          <Card className="bg-[#252525] border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-xs font-semibold text-gray-300">Bag Files</h4>
            </div>
            <div className="p-3 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  <span className="text-xs font-medium text-gray-300">recording_001.bag</span>
                </div>
                <div className="pl-6 space-y-1">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Size: 2.3 GB</span>
                    <span>•</span>
                    <span>Duration: 30.0s</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Topics: 12</span>
                    <span>•</span>
                    <span>Messages: 45,230</span>
                  </div>
                </div>
              </div>

              <div className="pl-6 border-l-2 border-gray-700 space-y-1">
                <TopicRow topic="/camera/front" count="15,000 msgs" />
                <TopicRow topic="/lidar/points" count="3,000 msgs" />
                <TopicRow topic="/gps/fix" count="300 msgs" />
                <TopicRow topic="/vehicle/state" count="3,000 msgs" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                >
                  ... (+8 more)
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              >
                View All Topics
              </Button>
            </div>
          </Card>

          {/* Test Parameters */}
          <Card className="bg-[#252525] border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-xs font-semibold text-gray-300">Test Parameters</h4>
            </div>
            <div className="p-3 space-y-2">
              <InfoRow label="Ego Speed" value="80 km/h" />
              <InfoRow label="Target Speed" value="75 km/h" />
              <InfoRow label="Initial Gap" value="50 m" />
              <InfoRow label="Test Mode" value="Automated" />
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="bg-[#252525] border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-xs font-semibold text-gray-300">Additional Info</h4>
            </div>
            <div className="p-3 space-y-2">
              <InfoRow label="Map Version" value="v2.3.1" />
              <InfoRow label="Planner Version" value="NSV_v4.5.2" />
              <InfoRow label="Checker Version" value="v3.2.0" />
              <InfoRow label="Platform" value="Linux x86_64" />
            </div>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-[#1e1e1e] p-3">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Metadata
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs text-gray-300 hover:text-gray-100 hover:bg-gray-700"
          >
            <FileJson className="w-3.5 h-3.5 mr-1.5" />
            View Raw JSON
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-gray-400 min-w-[100px]">{label}:</span>
      <span className="text-gray-300 text-right flex-1 font-mono">
        {value}
      </span>
    </div>
  );
}

function TopicRow({ topic, count }: { topic: string; count: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-400 font-mono">{topic}</span>
      <span className="text-gray-500">{count}</span>
    </div>
  );
}
