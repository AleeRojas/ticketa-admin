import React from 'react';
import { Wifi, Clock } from 'lucide-react';

/**
 * Componente que muestra el indicador de tiempo real y última actualización
 */
const RealtimeIndicator = ({ isUpdating, lastUpdate }) => {
  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className={`flex items-center space-x-1 ${isUpdating ? 'text-green-600' : 'text-gray-500'}`}>
        <Wifi size={16} className={isUpdating ? 'animate-pulse' : ''} />
        <span>Tiempo real</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-500">
        <Clock size={16} />
        <span>
          Última act.: {lastUpdate?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    </div>
  );
};

export default RealtimeIndicator;
