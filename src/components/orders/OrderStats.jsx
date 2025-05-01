import React from 'react';
import { TrendingUp, CreditCard, Clock, AlertCircle } from 'lucide-react';

/**
 * Componente que muestra estadísticas de pedidos
 */
const OrderStats = ({ stats }) => {
  // Función para formatear números con separador de miles
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500 truncate">Pedidos Totales</p>
            <p className="text-xl md:text-2xl font-semibold">{formatNumber(stats.total)}</p>
          </div>
          <div className="rounded-full bg-indigo-100 p-1.5 md:p-2 text-indigo-600">
            <TrendingUp size={16} className="md:w-5 md:h-5" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 md:mt-2 truncate">
          {formatNumber(stats.filtered)} mostrados con filtros
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500 truncate">En Curso</p>
            <p className="text-xl md:text-2xl font-semibold">{formatNumber(stats.pending)}</p>
          </div>
          <div className="rounded-full bg-amber-100 p-1.5 md:p-2 text-amber-600">
            <Clock size={16} className="md:w-5 md:h-5" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 md:mt-2 truncate">
          Pedidos en preparación
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500 truncate">Pagando</p>
            <p className="text-xl md:text-2xl font-semibold">{formatNumber(stats.paying)}</p>
          </div>
          <div className="rounded-full bg-blue-100 p-1.5 md:p-2 text-blue-600">
            <CreditCard size={16} className="md:w-5 md:h-5" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 md:mt-2 truncate">
          En proceso de pago
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-500 truncate">Importe Total</p>
            <p className="text-xl md:text-2xl font-semibold">{formatNumber(stats.totalAmount)}</p>
          </div>
          <div className="rounded-full bg-emerald-100 p-1.5 md:p-2 text-emerald-600">
            <TrendingUp size={16} className="md:w-5 md:h-5" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 md:mt-2 truncate">
          De los {formatNumber(stats.filtered)} pedidos
        </p>
      </div>
    </div>
  );
};

export default OrderStats;
