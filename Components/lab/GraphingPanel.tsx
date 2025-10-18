import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraphingPanel({ data }) {
  const chartData = data.map((log) => ({
    time: new Date(log.timestamp).toLocaleTimeString(),
    [log.measurement_type]: log.value,
  }));

  // Merge data points by time
  const mergedData = Object.values(
    chartData.reduce((acc, item) => {
      acc[item.time] = { ...acc[item.time], ...item };
      return acc;
    }, {})
  );

  return (
    <Card className="p-4 bg-white border-blue-200 shadow-md h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-blue-900">Data Visualization</h3>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-gray-500">Take measurements to see data graphed here</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="pH" stroke="#3b82f6" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="conductivity" stroke="#a855f7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}