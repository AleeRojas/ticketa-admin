import { useState, useEffect } from 'react';

/**
 * Hook para simular actualizaciones en tiempo real de las mesas
 * @param {Array} tables - Array de mesas
 * @param {Function} setTables - Función para actualizar las mesas
 * @param {number} interval - Intervalo de actualización en ms (por defecto 7000ms)
 * @param {number} probability - Probabilidad de actualización (0-1, por defecto 0.3)
 * @returns {Object} - Objeto con el tiempo de última actualización y estado de actualización
 */
const useRealTimeUpdates = (tables, setTables, interval = 7000, probability = 0.3) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() > (1 - probability)) {
        const tablesCopy = [...tables];
        
        if (tablesCopy.length > 0) {
          // Seleccionar una mesa aleatoria
          const randomIndex = Math.floor(Math.random() * tablesCopy.length);
          const randomTableId = tablesCopy[randomIndex].id;
          
          // Estados posibles
          const statuses = ['libre', 'ocupada', 'pagando', 'reservada'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Actualizar la mesa con un nuevo estado y tiempo
          setTables(prev => 
            prev.map(table => 
              table.id === randomTableId 
                ? { 
                    ...table, 
                    status: newStatus,
                    time: newStatus === 'libre' 
                      ? '00:00' 
                      : `00:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`
                  } 
                : table
            )
          );
          
          // Actualizar el tiempo de última actualización y activar el estado de actualización
          setLastUpdate(new Date());
          setIsUpdating(true);
          
          // Desactivar el estado de actualización después de un segundo
          setTimeout(() => setIsUpdating(false), 1000);
        }
      }
    }, interval);
    
    // Limpiar el intervalo al desmontar
    return () => clearInterval(intervalId);
  }, [tables, setTables, interval, probability]);
  
  return { lastUpdate, isUpdating };
};

export default useRealTimeUpdates;
