
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

const FlameParticle = ({ color, delay }) => (
  <motion.div
    className="absolute bottom-0 rounded-t-full"
    style={{
      backgroundColor: color,
      width: `${10 + Math.random() * 10}px`,
      height: `${20 + Math.random() * 20}px`,
      left: `${40 + Math.random() * 20}%`,
    }}
    initial={{ y: 0, opacity: 1, scale: 1 }}
    animate={{ y: -60, opacity: 0, scale: 0.5 }}
    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay }}
  />
);

export default function ApparatusItem({ 
  apparatus, 
  onRemove, 
  onSelect,
  onMeasure,
  isSelected,
  activeTool,
  scale = 1 
}) {
  const getApparatusColor = () => {
    if (apparatus.chemicals.length === 0) return 'transparent';

    const colorMap = {
      'blue': '#3b82f6',
      'light blue': '#7dd3fc',
      'green': '#22c55e',
      'blue-green': '#14b8a6',
      'light green': '#86efac', // Added
      'red': '#ef4444',
      'yellow': '#eab308',
      'orange': '#f97316',
      'purple': '#a855f7',
      'pink': '#ec4899',
      'violet': '#8b5cf6', // Added
      'brown': '#92400e',
      'white': '#ffffff',
      'black': '#000000',
      'colorless': 'transparent',
      'clear': 'transparent'
    };
    
    // If there's a product with a color, use it.
    const product = apparatus.chemicals.find(c => c.product_color);
    if (product) return colorMap[product.product_color?.toLowerCase()] || '#94a3b8';

    // Otherwise, find the first available color from reactants.
    for (const chemical of apparatus.chemicals) {
      const colorKey = chemical.color?.toLowerCase();
      if (colorMap[colorKey]) return colorMap[colorKey];
    }
    
    return '#94a3b8'; // Default color
  };

  const getPrecipitateColor = () => {
    const precipitate = apparatus.chemicals.find(c => c.precipitate && c.precipitate_color);
    if (!precipitate) return 'transparent';

    const colorMap = { 'white': '#e5e7eb', 'yellow': '#fde047', 'blue': '#93c5fd', 'brown': '#a16207', 'black': '#1f2937' }; // Added black
    return colorMap[precipitate.precipitate_color.toLowerCase()] || '#d1d5db';
  };

  const getFlameColor = () => {
    if (!apparatus.flame_color) return '#f97316'; // Default orange
    const colorMap = {
      'lilac': '#c4b5fd',
      'orange': '#f97316',
      'red': '#ef4444',
      'yellow': '#eab308',
      'blue': '#3b82f6',
      'green': '#22c55e'
    };
    return colorMap[apparatus.flame_color.toLowerCase()] || '#f97316';
  }

  const liquidColor = getApparatusColor();
  const precipitateColor = getPrecipitateColor();
  const totalVolume = apparatus.chemicals.reduce((sum, c) => sum + (c.volume || 0), 0);
  const fillPercentage = totalVolume / apparatus.size * 100;
  
  const hasPrecipitate = apparatus.chemicals.some(c => c.precipitate);
  const hasEffervescence = apparatus.chemicals.some(c => c.effervescence);
  const precipitateHeight = hasPrecipitate ? Math.min(15, fillPercentage * 0.3) : 0; // New variable

  const getVolumeTagStyle = () => {
    switch (apparatus.shape) {
      case 'conical':
        return { bottom: '5px', left: '5px' }; // Changed top to bottom
      case 'volumetric':
        return { top: '50%', left: '-25px', transform: 'translateY(-50%)' }; // Changed left and added transform
      default:
        return { top: '5px', left: '5px' };
    }
  };

  const handleClick = () => {
    if (activeTool) {
      onMeasure(apparatus);
    } else {
      onSelect();
    }
  };

  const renderShape = () => {
    const baseClass = "relative bg-gray-200/50 border-2 border-gray-400 shadow-lg overflow-hidden";
    
    if (apparatus.shape === 'conical') {
      return (
        <div className={`${baseClass} w-24 h-32`} style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}>
          {renderContents()}
        </div>
      );
    }
    
    if (apparatus.shape === 'tube') {
      return (
        <div className={`${baseClass} w-16 h-36 rounded-b-xl`}>
          {renderContents()}
        </div>
      );
    }
    
    if (apparatus.shape === 'volumetric') {
      return (
        <div className="relative w-24 h-32 flex flex-col items-center">
          <div className={`${baseClass} w-8 h-8 -mb-1 z-10`} style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} />
          <div className={`${baseClass} w-24 h-24 rounded-full`}>
            {renderContents(true)}
          </div>
        </div>
      );
    }
    
    if (apparatus.shape === 'dish') {
      return (
        <div className={`${baseClass} w-32 h-16 rounded-full`} style={{ borderRadius: '50% / 40%' }}>
          {renderContents()}
        </div>
      );
    }
    
    // Default cylinder (beaker)
    return (
      <div className={`${baseClass} w-24 h-32 rounded-lg`}>
        {renderContents()}
      </div>
    );
  };

  const renderContents = (isRound = false) => (
    <>
      {/* Precipitate Layer */}
      {hasPrecipitate && (
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500"
          style={{
            height: `${precipitateHeight}%`, // Changed to use precipitateHeight
            backgroundColor: precipitateColor,
            clipPath: isRound ? 'ellipse(50% 25% at 50% 75%)' : '', // Changed clipPath for isRound
          }}
        />
      )}
      
      {/* Liquid Fill */}
      {fillPercentage > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500"
          style={{
            height: `${Math.min(fillPercentage, 100)}%`,
            backgroundColor: liquidColor,
            opacity: 0.7,
            bottom: 0, // Added bottom: 0
          }}
        >
          {/* Liquid Surface */}
          <div className="absolute top-0 left-0 right-0 h-px bg-black/40" /> {/* Changed bg-black/30 to bg-black/40 */}
        </div>
      )}
      
      {/* Chemical Indicator */}
      {apparatus.chemicals.length > 0 && (
        <div className="absolute top-1 right-1 z-10">
          <Droplets className="w-4 h-4 text-blue-600" />
        </div>
      )}
    </>
  );

  return (
    <div
      className={`relative inline-block ${activeTool ? 'cursor-crosshair' : 'cursor-move'} ${isSelected ? 'ring-4 ring-cyan-400' : ''}`}
      onClick={handleClick}
      style={{
        transform: `scale(${scale})`,
        transition: apparatus.explosive ? 'opacity 0.5s 1s' : '',
        opacity: apparatus.explosive ? 0 : 1,
      }}
    >
      {/* Effervescence Animation above container */}
      {hasEffervescence && (
        <div className="absolute -top-12 left-0 right-0 h-12 pointer-events-none"> {/* Added pointer-events-none */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/70 rounded-full border border-black/50"
              style={{
                left: `${20 + i * 10}%`,
                bottom: 0,
              }}
              animate={{
                y: [0, -50], // Changed y: [-10, -50] to y: [0, -50]
                opacity: [1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      )}

      {/* Fire Animation */}
      {apparatus.fire && !apparatus.explosive && (
        <div className="absolute -top-16 left-0 right-0 h-16 w-full pointer-events-none">
          <FlameParticle color={getFlameColor()} delay={0} />
          <FlameParticle color={getFlameColor()} delay={0.2} />
          <FlameParticle color={getFlameColor()} delay={0.4} />
        </div>
      )}

      {/* Explosion Animation */}
      {apparatus.explosive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <motion.div
            className="absolute w-4 h-4 bg-yellow-400 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute w-4 h-4 bg-orange-500 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 25, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          />
        </div>
      )}


      {/* Apparatus Container */}
      <div className="relative">
        {renderShape()}
        {/* Volume tag positioned based on shape */}
        <div className="absolute bg-white/80 rounded px-1.5 py-0.5 z-10" style={getVolumeTagStyle()}>
          <p className="text-xs font-semibold text-gray-700">{apparatus.size}ml</p>
        </div>
      </div>

      {/* Label */}
      <div className="mt-1 text-center bg-white rounded px-2 py-1 border border-gray-300 shadow-sm max-w-32">
        <p className="text-xs font-medium text-gray-900 truncate">{apparatus.label}</p>
        {apparatus.chemicals.length > 0 && (
          <p className="text-xs text-gray-600 truncate">
            {apparatus.chemicals.map(c => c.product_name || c.name).join(', ')}
          </p>
        )}
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg z-20"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
