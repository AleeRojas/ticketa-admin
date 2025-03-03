import React from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente para seleccionar el salón activo
 */
const SalonSelector = () => {
  const { salones, activeSalon, setActiveSalon } = useAppContext();

  return (
    <div className="flex space-x-2">
      {salones.map(salon => (
        <button 
          key={salon.id}
          onClick={() => setActiveSalon(salon.id)}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeSalon === salon.id 
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span>{salon.icon}</span>
          <span>{salon.name}</span>
        </button>
      ))}
    </div>
  );
};

export default SalonSelector;
