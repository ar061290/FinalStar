
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Beaker, Loader2, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ChemicalInputPanel({ apparatus, onAddChemical }) {
  const [chemicalText, setChemicalText] = useState('');
  const [selectedApparatus, setSelectedApparatus] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleParse = async () => {
    if (!chemicalText.trim()) return;
    
    setParsing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Parse this chemical description into structured data. Return JSON only.
        
Input: "${chemicalText}"

Return format:
{
  "name": "chemical name",
  "formula": "chemical formula if identifiable",
  "state": "solid/liquid/gas/aqueous",
  "concentration": number or null,
  "concentration_unit": "M/g/L/etc" or null,
  "volume": number or null,
  "volume_unit": "ml/L" or null,
  "mass": number or null,
  "mass_unit": "g/kg/mg" or null,
  "temperature": number or null,
  "temperature_unit": "C/K" or null,
  "form": "powder/strip/wire/sphere/crystal" or null,
  "color": "color name like 'blue', 'light green', 'pink'",
  "pressure": number or null,
  "pressure_unit": "atm/Pa" or null
}`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            formula: { type: "string" },
            state: { type: "string" },
            concentration: { type: ["number", "null"] },
            concentration_unit: { type: ["string", "null"] },
            volume: { type: ["number", "null"] },
            volume_unit: { type: ["string", "null"] },
            mass: { type: ["number", "null"] },
            mass_unit: { type: ["string", "null"] },
            temperature: { type: ["number", "null"] },
            temperature_unit: { type: ["string", "null"] },
            form: { type: ["string", "null"] },
            color: { type: "string" },
            pressure: { type: ["number", "null"] },
            pressure_unit: { type: ["string", "null"] }
          }
        }
      });
      
      // Default temperature if not provided
      if (result && !result.temperature) {
        result.temperature = 25; // Room temp in C
        result.temperature_unit = "C";
      }

      setParsedData(result);
    } catch (error) {
      console.error('Error parsing chemical:', error);
    }
    setParsing(false);
  };

  const handleAdd = () => {
    if (!selectedApparatus || !parsedData) return;
    
    onAddChemical(selectedApparatus, parsedData);
    setChemicalText('');
    setParsedData(null);
    setSelectedApparatus('');
  };

  return (
    <Card className="p-4 bg-white border-blue-200 shadow-md">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-blue-900 mb-2 block">
            <Beaker className="w-4 h-4 inline mr-1" />
            Chemical Input (Natural Language)
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., 20g CuSO4 crystals in 50ml water"
              value={chemicalText}
              onChange={(e) => setChemicalText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleParse()}
              className="flex-1 border-blue-300 focus:border-cyan-500"
            />
            <Button
              onClick={handleParse}
              disabled={parsing || !chemicalText.trim()}
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {parsing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Parse'
              )}
            </Button>
          </div>
        </div>

        {parsedData && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-2">Parsed Chemical:</p>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Name:</span> {parsedData.name}</p>
              {parsedData.formula && <p><span className="font-medium">Formula:</span> {parsedData.formula}</p>}
              <p><span className="font-medium">State:</span> {parsedData.state}</p>
              {parsedData.concentration && (
                <p><span className="font-medium">Concentration:</span> {parsedData.concentration}{parsedData.concentration_unit}</p>
              )}
              {parsedData.volume && (
                <p><span className="font-medium">Volume:</span> {parsedData.volume}{parsedData.volume_unit}</p>
              )}
              {parsedData.mass && (
                <p><span className="font-medium">Mass:</span> {parsedData.mass}{parsedData.mass_unit}</p>
              )}
              {parsedData.temperature && (
                <p><span className="font-medium">Temperature:</span> {parsedData.temperature}°{parsedData.temperature_unit}</p>
              )}
              <p><span className="font-medium">Color:</span> {parsedData.color}</p>
            </div>
          </div>
        )}

        <div>
          <Label className="text-sm font-semibold text-blue-900 mb-2 block">Add To Apparatus</Label>
          <Select value={selectedApparatus} onValueChange={setSelectedApparatus}>
            <SelectTrigger className="border-blue-300">
              <SelectValue placeholder="Select apparatus..." />
            </SelectTrigger>
            <SelectContent>
              {apparatus.length === 0 && (
                <div className="p-2 text-sm text-gray-500 text-center">
                  No apparatus in workspace
                </div>
              )}
              {apparatus.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.label} ({app.type}, {app.size}ml)
                  {app.chemicals.length > 0 && ` - ${app.chemicals.map(c => c.name).join(', ')}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAdd}
          disabled={!selectedApparatus || !parsedData}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Chemical to Apparatus
        </Button>
      </div>
    </Card>
  );
}
