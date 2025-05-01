import React from 'react';
import { Wifi, Clock } from 'lucide-react';

/**
 * Componente que muestra el indicador de tiempo real y última actualización
 */
const RealtimeIndicator = ({ isUpdating, lastUpdate }) => {
  return (
    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap">
      <div className={`flex items-center space-x-1 ${isUpdating ? 'text-green-600' : 'text-gray-500'}`}>
        <Wifi size={14} className={`md:w-4 md:h-4 ${isUpdating ? 'animate-pulse' : ''}`} />
        <span>Tiempo real</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-500">
        <Clock size={14} className="md:w-4 md:h-4" />
        <span>
          Últ. act.: {lastUpdate?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    </div>
  );
};

export default RealtimeIndicator;
