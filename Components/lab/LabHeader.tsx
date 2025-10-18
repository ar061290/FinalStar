import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FlaskConical, 
  Save, 
  FolderOpen, 
  FilePlus, 
  ZoomIn, 
  ZoomOut, 
  Sparkles,
  Download
} from 'lucide-react';

export default function LabHeader({ 
  onNew, 
  onSave, 
  onOpen, 
  onZoomIn, 
  onZoomOut,
  onToggleTutor,
  tutorActive,
  onExport 
}) {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white border-b border-blue-700 shadow-lg">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Chemistar E-Laboratory</h1>
              <p className="text-xs text-cyan-200 hidden md:block">AI-Powered Virtual Chemistry Lab</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNew}
              className="text-white hover:bg-blue-700 hidden md:flex"
            >
              <FilePlus className="w-4 h-4 mr-2" />
              New
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpen}
              className="text-white hover:bg-blue-700 hidden md:flex"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Open
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className="text-white hover:bg-blue-700"
            >
              <Save className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Save</span>
            </Button>
            <div className="hidden md:flex border-l border-blue-700 h-6 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomOut}
              className="text-white hover:bg-blue-700"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomIn}
              className="text-white hover:bg-blue-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="border-l border-blue-700 h-6 mx-2" />
            <Button
              variant={tutorActive ? "default" : "ghost"}
              size="sm"
              onClick={onToggleTutor}
              className={tutorActive ? "bg-cyan-500 hover:bg-cyan-600" : "text-white hover:bg-blue-700"}
            >
              <Sparkles className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">AI Tutor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="text-white hover:bg-blue-700 hidden md:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}