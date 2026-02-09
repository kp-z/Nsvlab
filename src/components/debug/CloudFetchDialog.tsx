import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Cloud } from 'lucide-react';
import { FileInfo } from '../DebugPanel';

interface CloudFetchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFetch: (files: FileInfo[], stage: 'origin' | 'refresh' | 'sim') => void;
}

export function CloudFetchDialog({ open, onOpenChange, onFetch }: CloudFetchDialogProps) {
  const [serverUrl, setServerUrl] = useState('https://nsv-data.company.com');
  const [dataset, setDataset] = useState('Scenario_Highway_001');
  const [stage, setStage] = useState<'origin' | 'refresh' | 'sim'>('origin');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const handleFetch = () => {
    // Simulate fetching data from cloud
    const mockFiles: FileInfo[] = [
      { name: `cloud_${dataset}.pb`, size: '2.8MB', type: 'pb' },
      { name: `cloud_${dataset}_meta.json`, size: '124KB', type: 'json' },
    ];
    onFetch(mockFiles, stage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-gray-700 text-gray-300 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-200 flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Fetch from Cloud
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fetch data from the cloud server to your local environment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Server:</Label>
            <Input
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="bg-[#252525] border-gray-700 text-gray-300 h-9 text-sm"
              placeholder="https://data-server.com"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Dataset:</Label>
            <Select value={dataset} onValueChange={setDataset}>
              <SelectTrigger className="bg-[#252525] border-gray-700 text-gray-300 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scenario_Highway_001">Scenario_Highway_001</SelectItem>
                <SelectItem value="Scenario_Highway_002">Scenario_Highway_002</SelectItem>
                <SelectItem value="Scenario_Urban_001">Scenario_Urban_001</SelectItem>
                <SelectItem value="Scenario_Urban_002">Scenario_Urban_002</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Target Stage:</Label>
            <RadioGroup value={stage} onValueChange={(value) => setStage(value as any)}>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="origin" id="cloud-origin" />
                  <Label htmlFor="cloud-origin" className="text-sm cursor-pointer">Origin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="refresh" id="cloud-refresh" />
                  <Label htmlFor="cloud-refresh" className="text-sm cursor-pointer">Refresh</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="cloud-sim" />
                  <Label htmlFor="cloud-sim" className="text-sm cursor-pointer">Sim</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="auto-refresh" 
              checked={autoRefresh}
              onCheckedChange={(checked) => setAutoRefresh(checked as boolean)}
            />
            <Label
              htmlFor="auto-refresh"
              className="text-sm text-gray-400 cursor-pointer"
            >
              Auto-refresh after fetch
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleFetch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Fetch Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}