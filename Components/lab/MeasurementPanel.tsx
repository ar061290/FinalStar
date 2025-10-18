import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Droplets, Zap, Download } from 'lucide-react';

export default function MeasurementPanel({ activeTool, onSetTool, measurements, onExport }) {
  const tools = [
    { name: 'pH', icon: Droplets, style: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { name: 'temperature', icon: Thermometer, style: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { name: 'conductivity', icon: Zap, style: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  ];

  return (
    <Card className="p-4 bg-white border-blue-200 shadow-md">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-blue-900 mb-3">Measurement Tools</h3>
          <p className="text-sm text-gray-500 mb-3">Select a tool, then click an apparatus.</p>
          <div className="space-y-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Button
                  key={tool.name}
                  onClick={() => onSetTool(tool.name)}
                  variant={activeTool === tool.name ? 'default' : 'outline'}
                  className={`w-full justify-start ${activeTool === tool.name ? tool.style + ' text-white' : ''}`}
                  size="sm"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  Measure {tool.name}
                </Button>
              );
            })}
          </div>
        </div>

        {measurements.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-blue-900">Recent Measurements</h4>
              <Button
                onClick={onExport}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-auto">
              {measurements.slice(-5).reverse().map((m, idx) => (
                <div key={idx} className="p-2 bg-blue-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium">{m.measurement_type}</span>
                    <span className="text-blue-600">{m.value} {m.unit}</span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}