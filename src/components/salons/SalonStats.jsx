import React from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente que muestra estadísticas del salón actual
 */
const SalonStats = () => {
  const { salonStats, activeSalon, salones } = useAppContext();

  // Formatear número con separador de miles (formato chileno)
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Formatear precio con símbolo de moneda chilena
  const formatPrice = (price) => {
    return "$" + formatNumber(parseFloat(price).toFixed(0));
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow mt-4 md:mt-6">
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
        Resumen del {salones.find(s => s.id === activeSalon)?.name}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="border rounded-lg p-3 md:p-4">
          <p className="text-gray-500 text-xs md:text-sm">Mesas Ocupadas</p>
          <p className="text-lg md:text-xl font-semibold mt-1">
            {salonStats.occupied} / {salonStats.total}
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2">
            <div 
              className="bg-amber-500 h-1.5 md:h-2 rounded-full" 
              style={{
                width: `${salonStats.total > 0 ? (salonStats.occupied / salonStats.total) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="border rounded-lg p-3 md:p-4">
          <p className="text-gray-500 text-xs md:text-sm">Mesas Libres</p>
          <p className="text-lg md:text-xl font-semibold mt-1">
            {salonStats.free} / {salonStats.total}
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2">
            <div 
              className="bg-emerald-500 h-1.5 md:h-2 rounded-full" 
              style={{
                width: `${salonStats.total > 0 ? (salonStats.free / salonStats.total) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="border rounded-lg p-3 md:p-4">
          <p className="text-gray-500 text-xs md:text-sm">Total Pedidos</p>
          <p className="text-lg md:text-xl font-semibold mt-1">
            {formatNumber(salonStats.totalOrders || 0)}
          </p>
        </div>
        
        <div className="border rounded-lg p-3 md:p-4">
          <p className="text-gray-500 text-xs md:text-sm">Total Ventas</p>
          <p className="text-lg md:text-xl font-semibold mt-1">
            {formatPrice(salonStats.totalRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalonStats;
