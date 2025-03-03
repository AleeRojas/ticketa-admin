import React from 'react';
import { TrendingUp, CreditCard, Clock, AlertCircle } from 'lucide-react';

/**
 * Componente que muestra estadísticas de pedidos
 */
const OrderStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pedidos Totales</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {stats.filtered} mostrados con los filtros actuales
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">En Curso</p>
            <p className="text-2xl font-semibold">{stats.pending}</p>
          </div>
          <div className="rounded-full bg-amber-100 p-2 text-amber-600">
            <Clock size={20} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Pedidos que están siendo preparados
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pagando</p>
            <p className="text-2xl font-semibold">{stats.paying}</p>
          </div>
          <div className="rounded-full bg-blue-100 p-2 text-blue-600">
            <CreditCard size={20} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Pedidos en proceso de pago
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Importe Total</p>
            <p className="text-2xl font-semibold">{stats.totalAmount.toFixed(2)} €</p>
          </div>
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          De los {stats.filtered} pedidos mostrados
        </p>
      </div>
    </div>
  );
};

export default OrderStats;
