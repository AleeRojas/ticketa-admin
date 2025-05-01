import React from 'react';

/**
 * Componente que muestra indicadores de estado de las mesas
 */
const StatusIndicators = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4">
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500"></div>
        <span className="text-xs md:text-sm text-gray-600">Libre ({stats.free})</span>
      </div>
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-500"></div>
        <span className="text-xs md:text-sm text-gray-600">Ocupada ({stats.occupied})</span>
      </div>
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500"></div>
        <span className="text-xs md:text-sm text-gray-600">Pagando ({stats.paying})</span>
      </div>
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-purple-500"></div>
        <span className="text-xs md:text-sm text-gray-600">Reservada ({stats.reserved})</span>
      </div>
    </div>
  );
};

export default StatusIndicators;
