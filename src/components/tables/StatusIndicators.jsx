import React from 'react';

/**
 * Componente que muestra indicadores de estado de las mesas
 */
const StatusIndicators = ({ stats }) => {
  return (
    <div className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        <span className="text-sm text-gray-600">Libre ({stats.free})</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
        <span className="text-sm text-gray-600">Ocupada ({stats.occupied})</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-sm text-gray-600">Pagando ({stats.paying})</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        <span className="text-sm text-gray-600">Reservada ({stats.reserved})</span>
      </div>
    </div>
  );
};

export default StatusIndicators;
