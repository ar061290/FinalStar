
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import ApparatusItem from './ApparatusItem';
import ReactionDisplay from './ReactionDisplay';
import { motion } from 'framer-motion';

export default function WorkspaceBench({ 
  apparatus, 
  onUpdateApparatus,
  onRemoveApparatus,
  zoomLevel,
  onReaction,
  reactionResult,
  activeTool,
  onMeasureApparatus,
  measurementPopup 
}) {
  // `selectedApparatus` state is removed as per the outline.
  const [draggedApparatus, setDraggedApparatus] = useState(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTarget, setTransferTarget] = useState(null);

  const handleDragStart = (e, app) => {
    if (activeTool) { // Prevent dragging if a tool is active
      e.preventDefault();
      return;
    }
    setDraggedApparatus(app);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, app) => {
    e.preventDefault();
    if (draggedApparatus && draggedApparatus.id !== app.id) {
      e.currentTarget.style.border = '3px dashed #06b6d4';
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.border = '';
  };

  const handleDrop = (e, targetApp) => {
    e.preventDefault();
    e.currentTarget.style.border = '';
    
    if (draggedApparatus && draggedApparatus.id !== targetApp.id && draggedApparatus.chemicals.length > 0) {
      setTransferTarget(targetApp);
      setShowTransferDialog(true);
    }
  };

  const handleTransfer = () => {
    if (!transferAmount || !draggedApparatus || !transferTarget) return;

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0 || amount > 100) return; // Added upper limit check

    // Deep clone chemicals to avoid mutation issues when modifying volumes/masses
    const chemicalsToTransfer = JSON.parse(JSON.stringify(draggedApparatus.chemicals)).map(c => {
      if (c.volume !== undefined) c.volume = c.volume * (amount / 100);
      if (c.mass !== undefined) c.mass = c.mass * (amount / 100);
      return c;
    });

    const updatedApparatus = apparatus.map(app => {
      if (app.id === transferTarget.id) {
        return {
          ...app,
          chemicals: [...app.chemicals, ...chemicalsToTransfer]
        };
      }
      if (app.id === draggedApparatus.id) {
        return {
          ...app,
          chemicals: app.chemicals.map(c => {
            const newChem = { ...c };
            if (newChem.volume !== undefined) newChem.volume = newChem.volume * ((100 - amount) / 100);
            if (newChem.mass !== undefined) newChem.mass = newChem.mass * ((100 - amount) / 100);
            return newChem;
          }).filter(c => (c.volume !== undefined && c.volume > 0.01) || (c.mass !== undefined && c.mass > 0.01) || (c.volume === undefined && c.mass === undefined)) // Filter out negligible amounts
        };
      }
      return app;
    });
    
    onUpdateApparatus(updatedApparatus);

    // Trigger reaction prediction for target apparatus after update
    const targetChemicals = updatedApparatus.find(a => a.id === transferTarget.id).chemicals;
    if (onReaction && targetChemicals.length > 1) { // Reaction requires at least two chemicals
      onReaction(targetChemicals, transferTarget.id);
    }

    setShowTransferDialog(false);
    setTransferAmount('');
    setDraggedApparatus(null);
  };

  const scale = zoomLevel / 100;

  const handleMouseDown = (e, app) => {
    if (e.button !== 0 || activeTool) return; // Only left click, and no drag if tool active
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = app.x || 0;
    const startTop = app.y || 0;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale; // Adjust for zoom level
      const deltaY = (moveEvent.clientY - startY) / scale; // Adjust for zoom level
      
      onUpdateApparatus(apparatus.map(a => 
        a.id === app.id 
          ? { ...a, x: startLeft + deltaX, y: startTop + deltaY }
          : a
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <Card className="h-full bg-gradient-to-b from-gray-50 to-gray-100 border-blue-200 shadow-inner overflow-hidden p-8 relative">
        <div className="min-h-full relative w-full h-full"> {/* Added w-full h-full */}
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Workspace Label */}
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-blue-200 z-10">
            <p className="text-sm font-semibold text-blue-900">Laboratory Bench</p>
            <p className="text-xs text-gray-600">Drag apparatus anywhere • Drag over another to transfer</p>
          </div>

          {/* Reaction Display */}
          {reactionResult && (
            <div className="absolute top-4 right-4 max-w-md z-10">
              <ReactionDisplay result={reactionResult} />
            </div>
          )}

          {/* Apparatus Area */}
          <div className="relative mt-32 min-h-[400px] w-full h-full"> {/* Added w-full h-full */}
            {apparatus.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-400">Empty Workspace</p>
                  <p className="text-sm text-gray-500 mt-1">Add apparatus from the sidebar to begin</p>
                </div>
              </div>
            )}

            {apparatus.map((app) => (
              <div
                key={app.id}
                style={{
                  position: 'absolute',
                  left: app.x || 100 + apparatus.indexOf(app) * 150,
                  top: app.y || 200,
                  // Cursor is set by ApparatusItem based on activeTool
                }}
                draggable={!activeTool} // Draggable only if no tool is active
                onDragStart={(e) => handleDragStart(e, app)}
                onDragOver={(e) => handleDragOver(e, app)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, app)}
                onMouseDown={(e) => handleMouseDown(e, app)}
              >
                <ApparatusItem
                  apparatus={app}
                  onRemove={() => onRemoveApparatus(app.id)}
                  onSelect={() => {}} // No longer setting `selectedApparatus` from here
                  // `isSelected` prop is removed as `selectedApparatus` state is removed
                  onMeasure={onMeasureApparatus} // New prop for measurement tool
                  activeTool={activeTool} // New prop to pass active tool status
                  scale={scale}
                />
              </div>
            ))}
          </div>

          {/* Measurement Popup */}
          {measurementPopup.show && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-lg z-20"
              style={{ left: measurementPopup.x, top: measurementPopup.y }}
            >
              {measurementPopup.message || "Nothing to measure!"}
            </motion.div>
          )}
        </div>
      </Card>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Substance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Transfer from <span className="font-semibold">{draggedApparatus?.label}</span> to{' '}
              <span className="font-semibold">{transferTarget?.label}</span>
            </p>
            <div>
              <Label>
                Amount to Transfer (%)
              </Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter percentage (e.g., 50)"
              />
              <p className="text-xs text-gray-500 mt-1">Enter percentage of total volume/mass to transfer</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransfer} disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > 100}>
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
