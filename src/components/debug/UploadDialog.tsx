import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Upload } from 'lucide-react';
import { FileInfo } from '../DebugPanel';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: 'origin' | 'refresh' | 'sim';
  onStageChange: (stage: 'origin' | 'refresh' | 'sim') => void;
  onUpload: (files: FileInfo[], stage: 'origin' | 'refresh' | 'sim') => void;
}

export function UploadDialog({ 
  open, 
  onOpenChange, 
  stage, 
  onStageChange, 
  onUpload 
}: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const files: FileInfo[] = Array.from(fileList).map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.name.endsWith('.pb') ? 'pb' : 'json',
    }));
    onUpload(files, stage);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-gray-700 text-gray-300 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-200">Upload to Pipeline</DialogTitle>
          <DialogDescription className="text-gray-400">Upload files to the pipeline for processing.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Stage:</Label>
            <RadioGroup value={stage} onValueChange={(value) => onStageChange(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="origin" id="origin" />
                <Label htmlFor="origin" className="text-sm cursor-pointer">Origin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="refresh" id="refresh" />
                <Label htmlFor="refresh" className="text-sm cursor-pointer">Refresh</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim" className="text-sm cursor-pointer">Sim</Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-[#252525]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-500" />
            <p className="text-sm text-gray-400 mb-2">
              Drag & Drop files here
            </p>
            <p className="text-xs text-gray-500 mb-3">or</p>
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#2a2a2a] border-gray-700 hover:bg-gray-700 text-gray-300"
                onClick={() => document.getElementById('file-upload')?.click()}
                type="button"
              >
                Browse Files
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pb,.json"
              onChange={handleFileInput}
              className="hidden"
            />
            <p className="text-xs text-gray-600 mt-3">
              Supported: .pb, .json
            </p>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}