import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Beaker, TestTube, FlaskConical, Thermometer, Calculator } from 'lucide-react';

const APPARATUS_TYPES = [
  { type: 'beaker', label: 'Beaker', sizes: [50, 100, 250, 500], icon: Beaker, shape: 'cylinder' },
  { type: 'conical_flask', label: 'Conical Flask', sizes: [50, 100, 250, 500], icon: FlaskConical, shape: 'conical' },
  { type: 'test_tube', label: 'Test Tube', sizes: [10], icon: TestTube, shape: 'tube' },
  { type: 'boiling_tube', label: 'Boiling Tube', sizes: [20], icon: TestTube, shape: 'tube' },
  { type: 'measuring_cylinder', label: 'Measuring Cylinder', sizes: [10, 25, 50, 100], icon: Beaker, shape: 'cylinder' },
  { type: 'volumetric_flask', label: 'Volumetric Flask', sizes: [50, 100, 250, 500], icon: FlaskConical, shape: 'volumetric' },
  { type: 'watch_glass', label: 'Watch Glass', sizes: [1], icon: Beaker, shape: 'dish' },
  { type: 'evaporating_dish', label: 'Evaporating Dish', sizes: [50, 100], icon: Beaker, shape: 'dish' }
];

export default function ApparatusLibrary({ onAddApparatus }) {
  const [selectedType, setSelectedType] = React.useState('');
  const [selectedSize, setSelectedSize] = React.useState('');

  const handleAdd = () => {
    if (!selectedType || !selectedSize) return;
    
    const apparatus = APPARATUS_TYPES.find(a => a.type === selectedType);
    onAddApparatus({
      type: selectedType,
      label: apparatus.label,
      size: parseInt(selectedSize),
      shape: apparatus.shape,
      chemicals: []
    });
    
    setSelectedType('');
    setSelectedSize('');
  };

  return (
    <Card className="h-full bg-white border-blue-200 shadow-md overflow-hidden">
      <Tabs defaultValue="apparatus" className="h-full flex flex-col">
        <TabsList className="bg-blue-50 border-b border-blue-200 rounded-none">
          <TabsTrigger value="apparatus" className="data-[state=active]:bg-white">
            <Beaker className="w-4 h-4 mr-2" />
            Apparatus
          </TabsTrigger>
          <TabsTrigger value="measurements" className="data-[state=active]:bg-white">
            <Thermometer className="w-4 h-4 mr-2" />
            Measurements
          </TabsTrigger>
          <TabsTrigger value="calculator" className="data-[state=active]:bg-white">
            <Calculator className="w-4 h-4 mr-2" />
            Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apparatus" className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <Label className="text-sm font-semibold text-blue-900 mb-2 block">Apparatus Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="border-blue-300">
                <SelectValue placeholder="Select apparatus..." />
              </SelectTrigger>
              <SelectContent>
                {APPARATUS_TYPES.map((app) => (
                  <SelectItem key={app.type} value={app.type}>
                    {app.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedType && (
            <div>
              <Label className="text-sm font-semibold text-blue-900 mb-2 block">Size (ml)</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="border-blue-300">
                  <SelectValue placeholder="Select size..." />
                </SelectTrigger>
                <SelectContent>
                  {APPARATUS_TYPES.find(a => a.type === selectedType)?.sizes.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} ml
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleAdd}
            disabled={!selectedType || !selectedSize}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            Add to Workspace
          </Button>

          <div className="mt-6 pt-4 border-t border-blue-200">
            <p className="text-xs text-gray-600 mb-3">Available Apparatus:</p>
            <div className="grid grid-cols-2 gap-2">
              {APPARATUS_TYPES.map((app) => {
                const Icon = app.icon;
                return (
                  <div
                    key={app.type}
                    className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-center hover:bg-blue-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedType(app.type)}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs font-medium text-blue-900">{app.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="flex-1 overflow-auto p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select an apparatus in the workspace, then use the measurement panel below to measure its properties.
          </p>
        </TabsContent>

        <TabsContent value="calculator" className="flex-1 overflow-auto p-0">
          <iframe
            src="https://www.desmos.com/calculator"
            className="w-full h-full border-0"
            title="Graphing Calculator"
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}