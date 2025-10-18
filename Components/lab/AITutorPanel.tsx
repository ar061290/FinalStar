import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AITutorPanel({ active, onClose, explanations }) {
  if (!active) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-blue-200 shadow-2xl z-50">
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold">AI Chemistry Tutor</h3>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {explanations.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">
                  Perform reactions to get AI-powered explanations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {explanations.slice().reverse().map((exp, idx) => (
                  <Card key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(exp.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{exp.explanation}</p>
                    {exp.products && exp.products.length > 0 && (
                       <div className="mt-2 pt-2 border-t border-gray-200">
                         <p className="text-xs font-semibold text-gray-600 mb-1">Products Formed:</p>
                         <p className="text-xs text-gray-700">{exp.products.map(p => p.name).join(', ')}</p>
                       </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}