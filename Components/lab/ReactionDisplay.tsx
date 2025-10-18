
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Flame, Wind, Droplets, Zap, TestTube } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReactionDisplay({ result }) {
  if (!result) return null;

  const getIcon = () => {
    // Reordered to prioritize explosive over fire, as per the change outline
    if (result.explosive) return <Zap className="w-5 h-5 text-yellow-500" />;
    if (result.fire) return <Flame className="w-5 h-5 text-orange-500" />;
    if (result.gas) return <Wind className="w-5 h-5 text-gray-500" />;
    if (result.effervescence) return <Droplets className="w-5 h-5 text-blue-500" />;
    if (result.precipitate) return <TestTube className="w-5 h-5 text-brown-500" />;
    return <AlertCircle className="w-5 h-5 text-green-500" />;
  };

  const productNames = result.products?.map(p => p.name).join(', ') || 'None';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white border-blue-300 shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">Reaction Observed</h4>
            <p className="text-sm text-gray-700 mb-2">{result.description}</p>
            
            {result.color_change && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-600">Color:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{result.initial_color || 'initial'}</span>
                  <span className="text-xs">→</span>
                  <span className="text-xs">{result.final_color || 'final'}</span>
                </div>
              </div>
            )}

            {result.temperature_change && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Temp:</span> {result.temperature_change.replace('none', 'no significant change')}
              </p>
            )}

            {result.products && result.products.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Products:</p>
                <p className="text-xs text-gray-700">{productNames}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
