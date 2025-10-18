
import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import LabHeader from '../components/lab/LabHeader';
import ChemicalInputPanel from '../components/lab/ChemicalInputPanel';
import ApparatusLibrary from '../components/lab/ApparatusLibrary';
import WorkspaceBench from '../components/lab/WorkspaceBench';
import MeasurementPanel from '../components/lab/MeasurementPanel';
import GraphingPanel from '../components/lab/GraphingPanel';
import AITutorPanel from '../components/lab/AITutorPanel';

export default function Laboratory() {
  const queryClient = useQueryClient();

  // State
  const [currentExperimentId, setCurrentExperimentId] = useState(null);
  const [apparatus, setApparatus] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [tutorActive, setTutorActive] = useState(false);
  const [tutorExplanations, setTutorExplanations] = useState([]);
  const [reactionResult, setReactionResult] = useState(null);
  const [selectedApparatusId, setSelectedApparatusId] = useState(null); // Keep this, crucial for input panel
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [experimentName, setExperimentName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Keep this, used for delete dialog
  const [activeMeasurementTool, setActiveMeasurementTool] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [measurementPopup, setMeasurementPopup] = useState({ show: false, x: 0, y: 0 });

  // Load experiments
  const { data: experiments = [] } = useQuery({
    queryKey: ['experiments'],
    queryFn: () => base44.entities.Experiment.list('-created_date'),
  });

  // Save experiment mutation
  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (currentExperimentId) {
        return base44.entities.Experiment.update(currentExperimentId, data);
      }
      return base44.entities.Experiment.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
      setCurrentExperimentId(data.id);
      setShowSaveDialog(false);
    },
  });

  // Delete experiment mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Experiment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
      // If the deleted experiment was the currently loaded one, clear workspace
      if (currentExperimentId === deleteConfirm?.id) {
        handleNew(); // Call handleNew to reset the workspace state
      }
      setDeleteConfirm(null); // Close the delete confirmation dialog
    },
  });

  // Handlers
  const handleSetTool = (tool) => {
    setActiveMeasurementTool(prev => prev === tool ? null : tool);
  };

  const calculateMeasurement = useCallback((type, apparatus) => {
    if (!apparatus || apparatus.chemicals.length === 0) return null;
    const chemicals = apparatus.chemicals;

    if (type === 'temperature') {
      const totalEnergy = chemicals.reduce((acc, c) => acc + ((c.temperature || 25) * (c.volume || c.mass || 1)), 0);
      const totalMass = chemicals.reduce((acc, c) => acc + (c.volume || c.mass || 1), 0);
      if (totalMass === 0) return 25; // Default to room temp if no measurable mass/volume
      return totalEnergy / totalMass;
    }

    if (type === 'pH') {
      const acidic = chemicals.some(c => c.name?.toLowerCase().includes('acid') || c.formula?.toLowerCase().includes('hcl') || c.formula?.toLowerCase().includes('h2so4'));
      const basic = chemicals.some(c => c.name?.toLowerCase().includes('hydroxide') || c.formula?.toLowerCase().includes('naoh') || c.formula?.toLowerCase().includes('koh'));
      if (acidic && !basic) return 2 + Math.random() * 3;
      if (basic && !acidic) return 9 + Math.random() * 4;
      return 6.5 + Math.random(); // Near neutral with some variation
    }

    if (type === 'conductivity') {
      const ionic = chemicals.some(c => c.state === 'aqueous' && (c.concentration > 0 || c.name?.includes('sulfate') || c.name?.includes('chloride') || c.name?.includes('nitrate')));
      return ionic ? 500 + Math.random() * 1500 : Math.random() * 200;
    }
    return 0;
  }, []);

  const handleMeasureApparatus = useCallback(async (app, event) => { // Added event parameter
    if (!activeMeasurementTool) return;

    if (app.chemicals.length === 0) {
      setMeasurementPopup({ show: true, x: event.clientX, y: event.clientY - 40 }); // Use event clientX/Y
      setTimeout(() => setMeasurementPopup({ show: false, x: 0, y: 0 }), 1000);
      return;
    }

    const units = { pH: 'pH', temperature: '°C', conductivity: 'µS/cm' };
    const value = calculateMeasurement(activeMeasurementTool, app);

    const measurement = {
      experiment_id: currentExperimentId,
      apparatus_id: app.id,
      measurement_type: activeMeasurementTool,
      value: parseFloat(value.toFixed(2)),
      unit: units[activeMeasurementTool],
      timestamp: new Date().toISOString()
    };

    setMeasurements(prev => [...prev, measurement]);

    if (currentExperimentId) {
      try {
        await base44.entities.MeasurementLog.create(measurement);
      } catch (error) {
        console.error('Error saving measurement:', error);
      }
    }
    setActiveMeasurementTool(null); // De-select tool after use
  }, [activeMeasurementTool, currentExperimentId, calculateMeasurement]);

  const handleNew = () => {
    if (confirm('Start a new experiment? Unsaved changes will be lost.')) {
      setApparatus([]);
      setZoomLevel(100);
      setTutorExplanations([]);
      setReactionResult(null);
      setCurrentExperimentId(null);
      setExperimentName('');
      setSelectedApparatusId(null); // Clear selected apparatus
      setMeasurements([]); // Clear measurements
    }
  };

  const handleSave = () => {
    if (!currentExperimentId && !experimentName) {
      setShowSaveDialog(true);
    } else {
      saveMutation.mutate({
        name: experimentName || 'Untitled Experiment',
        workspace_state: {
          apparatus,
          zoom_level: zoomLevel,
        },
      });
    }
  };

  const handleOpen = () => {
    setShowOpenDialog(true);
  };

  const loadExperiment = (exp) => {
    setApparatus(exp.workspace_state?.apparatus || []);
    setZoomLevel(exp.workspace_state?.zoom_level || 100);
    setCurrentExperimentId(exp.id);
    setExperimentName(exp.name);
    setShowOpenDialog(false);
    setSelectedApparatusId(null); // Clear selected apparatus on load
    setMeasurements([]); // Clear measurements on load, or load from exp.measurements if stored
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleAddApparatus = (newApparatus) => {
    setApparatus(prev => [
      ...prev,
      {
        ...newApparatus,
        id: `app-${Date.now()}-${Math.random()}`,
        position: prev.length,
        chemicals: [],
      },
    ]);
  };

  const handleRemoveApparatus = (id) => {
    setApparatus(prev => prev.filter(a => a.id !== id));
    if (selectedApparatusId === id) {
      setSelectedApparatusId(null);
    }
  };

  const handleAddChemical = async (apparatusId, chemicalData) => {
    let targetApparatus = null; // Initialize targetApparatus
    setApparatus(prev => prev.map(app => {
      if (app.id === apparatusId) {
        targetApparatus = { // Assign updated apparatus to targetApparatus
          ...app,
          chemicals: [...app.chemicals, chemicalData],
        };
        return targetApparatus;
      }
      return app;
    }));

    // Check for reactions if apparatus now has multiple chemicals
    if (targetApparatus && targetApparatus.chemicals.length > 1) { // Changed condition to > 1
      await predictReaction(targetApparatus.chemicals, apparatusId);
    }
  };

  const predictReaction = async (chemicals, apparatusId) => {
    try {
      const prompt = `You are a realistic chemistry reaction simulator. Given these chemicals mixed together, predict what happens.
Input Chemicals:
${chemicals.map((c, i) => `${i + 1}. Name: ${c.name}, State: ${c.state}, Volume: ${c.volume || 'N/A'} ${c.volume_unit || ''}, Mass: ${c.mass || 'N/A'} ${c.mass_unit || ''}, Temp: ${c.temperature || 25}°C`).join('\n')}

Based on stoichiometry and chemical principles, provide a JSON response with the following fields:
- "reaction_occurs": boolean
- "initial_color": string (color of the mixture before reaction)
- "final_color": string (e.g., "light blue", "blue-green", "colorless", "pink")
- "temperature_change": string (e.g., "exothermic", "endothermic", "no significant change")
- "gas": boolean
- "precipitate": boolean (true if an insoluble solid forms or if a solid reactant doesn't fully dissolve)
- "precipitate_color": string (color of the solid)
- "effervescence": boolean
- "fire": boolean (if a flame is produced)
- "flame_color": string (e.g., "lilac", "orange", "red")
- "explosive": boolean (if the reaction is explosive)
- "products": array of objects, each with "name", "formula", "state" (e.g., aqueous, solid, gas)
- "excess_reactants": array of strings with names of unreacted chemicals.
- "description": A brief, scientific explanation of the observation.
- "color_change": boolean (true if initial and final colors differ)

Example rules:
- CuSO4(aq) is blue. FeSO4(aq) is light green.
- Potassium in water produces a lilac flame.
- Caesium in water is explosive.
- If a solid is added to a liquid and its mass exceeds solubility, it is a precipitate.
- If mixing, assume complete reaction until a limiting reactant is consumed.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            reaction_occurs: { type: "boolean" },
            initial_color: { type: "string" },
            final_color: { type: "string" },
            temperature_change: { type: "string" },
            gas: { type: "boolean" },
            precipitate: { type: "boolean" },
            precipitate_color: { type: "string" },
            effervescence: { type: "boolean" },
            fire: { type: "boolean" },
            flame_color: { type: "string" },
            explosive: { type: "boolean" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  formula: { type: "string" },
                  state: { type: "string" }
                },
                required: ["name", "formula", "state"]
              }
            },
            excess_reactants: {
              type: "array",
              items: { type: "string" }
            },
            description: { type: "string" },
            color_change: { type: "boolean" },
          }
        }
      });

      setReactionResult(result);

      if (result.reaction_occurs) {
        setApparatus(prev => prev.map(app => {
          if (app.id === apparatusId) {
            const finalChemicals = [];
            const tempChangeValue = result.temperature_change.includes("exo") ? 15 : (result.temperature_change.includes("endo") ? -10 : 0);
            const initialTemp = chemicals.reduce((a,c) => a + (c.temperature || 25), 0) / chemicals.length;
            const finalTemp = parseFloat((initialTemp + tempChangeValue).toFixed(2));

            result.products.forEach(p => {
              finalChemicals.push({
                name: p.name,
                formula: p.formula,
                product_name: p.name,
                product_color: result.final_color,
                color: result.final_color,
                effervescence: result.effervescence,
                precipitate: p.state === 'solid' || result.precipitate, // Consider overall precipitate flag
                precipitate_color: p.state === 'solid' ? result.precipitate_color : null,
                state: p.state,
                temperature: finalTemp,
                volume: p.state !== 'solid' ? (app.chemicals.reduce((v,c) => v+(c.volume||0), 0)) : undefined, // simple volume conservation for liquid/gas
                mass: p.state === 'solid' ? 1 : undefined, // Placeholder mass
              });
            });

            // Add excess reactants back
            result.excess_reactants.forEach(er_name => {
              const originalChem = chemicals.find(c => c.name.startsWith(er_name));
              if(originalChem) {
                finalChemicals.push({
                  ...originalChem,
                  name: `${er_name} [excess]`,
                  is_excess: true,
                  temperature: finalTemp,
                });
              }
            });

            return {
              ...app,
              chemicals: finalChemicals,
              fire: result.fire,
              flame_color: result.flame_color,
              explosive: result.explosive
            };
          }
          return app;
        }));

        if (result.explosive) {
          setTimeout(() => {
            handleRemoveApparatus(apparatusId);
          }, 1500); // Remove after 1.5s explosion animation
        } else if (result.fire) {
           setTimeout(() => {
            setApparatus(prev => prev.map(app =>
              app.id === apparatusId ? { ...app, fire: false, flame_color: null } : app
            ));
          }, 5000); // Fire lasts 5 seconds
        }
      }

      // Add to tutor if active
      if (tutorActive) {
        setTutorExplanations(prev => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            explanation: result.description,
            products: result.products // Include products in tutor explanation
          },
        ]);
      }

      // Auto-hide after 10 seconds
      setTimeout(() => setReactionResult(null), 10000);
    } catch (error) {
      console.error('Error predicting reaction:', error);
      // Fallback for LLM errors, possibly set a generic error message
      setTutorExplanations(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          explanation: "Could not predict reaction. An error occurred with the AI simulator.",
        },
      ]);
    }
  };

  const handleReaction = (chems, id) => predictReaction(chems, id); // Helper for WorkspaceBench

  const handleExport = () => {
    const data = {
      experiment: experimentName || 'Untitled',
      apparatus: apparatus.map(a => ({
        type: a.type,
        size: a.size,
        chemicals: a.chemicals.map(c => c.name).join(', '),
      })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experimentName || 'experiment'}.json`;
    a.click();
  };

  const exportMeasurements = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Value', 'Unit', 'Apparatus ID'].join(','),
      ...measurements.map(m => [
        new Date(m.timestamp).toLocaleString(),
        m.measurement_type,
        m.value,
        m.unit,
        m.apparatus_id
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'measurements.csv';
    a.click();
  };

  // Derive selectedApparatus object from selectedApparatusId
  const selectedApparatus = apparatus.find(a => a.id === selectedApparatusId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LabHeader
        onNew={handleNew}
        onSave={handleSave}
        onOpen={handleOpen}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleTutor={() => setTutorActive(!tutorActive)}
        tutorActive={tutorActive}
        onExport={handleExport}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-blue-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-blue-200">
            <ChemicalInputPanel
              apparatus={apparatus}
              onAddChemical={handleAddChemical}
              selectedApparatusId={selectedApparatusId}
            />
          </div>

          <div className="flex-1 overflow-auto">
            <ApparatusLibrary onAddApparatus={handleAddApparatus} />
          </div>

          <div className="p-4 border-t border-blue-200">
            <MeasurementPanel
              activeTool={activeMeasurementTool}
              onSetTool={handleSetTool}
              measurements={measurements}
              onExport={exportMeasurements}
            />
          </div>
        </div>

        {/* Main Workspace and Graph */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden gap-4">
          <div className="flex-1 overflow-hidden">
            <WorkspaceBench
              apparatus={apparatus}
              onUpdateApparatus={setApparatus}
              onRemoveApparatus={handleRemoveApparatus}
              zoomLevel={zoomLevel}
              reactionResult={reactionResult}
              onSelectApparatus={setSelectedApparatusId}
              selectedApparatusId={selectedApparatusId}
              onReaction={handleReaction}
              activeTool={activeMeasurementTool}
              onMeasureApparatus={handleMeasureApparatus}
              measurementPopup={measurementPopup}
            />
          </div>
          <div className="h-80 flex-shrink-0">
            <GraphingPanel data={measurements} />
          </div>
        </div>
      </div>

      <AITutorPanel
        active={tutorActive}
        onClose={() => setTutorActive(false)}
        explanations={tutorExplanations}
      />

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Experiment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="experiment-name">Experiment Name</Label>
              <Input
                id="experiment-name"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
                placeholder="Enter experiment name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave()}
              disabled={!experimentName.trim() || saveMutation.isPending}
            >
              {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open Dialog with Delete */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Experiment</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-96 overflow-auto">
            {experiments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No saved experiments</p>
            ) : (
              experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div
                    onClick={() => loadExperiment(exp)}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-medium text-gray-900">{exp.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(exp.created_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(exp);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experiment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              You want to delete <span className="font-semibold">{deleteConfirm?.name}</span>. This action is permanent. Proceed?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              No, Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteMutation.mutate(deleteConfirm.id);
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
