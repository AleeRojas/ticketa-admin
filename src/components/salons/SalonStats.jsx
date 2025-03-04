import React from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente que muestra estadísticas del salón actual
 */
const SalonStats = () => {
  const { salonStats, activeSalon, salones } = useAppContext();

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Resumen del {salones.find(s => s.id === activeSalon)?.name}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-sm">Mesas Ocupadas</p>
          <p className="text-xl font-semibold mt-1">
            {salonStats.occupied} / {salonStats.total}
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full" 
              style={{
                width: `${salonStats.total > 0 ? (salonStats.occupied / salonStats.total) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-sm">Mesas Libres</p>
          <p className="text-xl font-semibold mt-1">
            {salonStats.free} / {salonStats.total}
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full" 
              style={{
                width: `${salonStats.total > 0 ? (salonStats.free / salonStats.total) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-sm">Total Pedidos</p>
          <p className="text-xl font-semibold mt-1">
            {salonStats.totalOrders || 0}
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-sm">Total Ventas</p>
          <p className="text-xl font-semibold mt-1">
            {salonStats.totalRevenue} 
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalonStats;
