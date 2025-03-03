import React from 'react';
import { Clock, CreditCard, Utensils, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Barra de filtros para pedidos
 */
const OrderFilterBar = ({ 
  tables, 
  statusFilter, 
  onStatusChange, 
  tableFilter, 
  onTableChange, 
  timeFilter, 
  onTimeChange 
}) => {
  return (
    <div className="flex flex-wrap space-x-2 space-y-2 md:space-y-0 mb-6">
      {/* Filtros por estado */}
      <div className="flex rounded-md overflow-hidden border border-gray-300">
        <button
          onClick={() => onStatusChange('all')}
          className={`px-3 py-2 text-sm font-medium ${
            statusFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => onStatusChange('en curso')}
          className={`px-3 py-2 text-sm font-medium flex items-center ${
            statusFilter === 'en curso'
              ? 'bg-amber-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Utensils size={14} className="mr-1" />
          En curso
        </button>
        <button
          onClick={() => onStatusChange('pagando')}
          className={`px-3 py-2 text-sm font-medium flex items-center ${
            statusFilter === 'pagando'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CreditCard size={14} className="mr-1" />
          Pagando
        </button>
        <button
          onClick={() => onStatusChange('pagado')}
          className={`px-3 py-2 text-sm font-medium flex items-center ${
            statusFilter === 'pagado'
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CheckCircle size={14} className="mr-1" />
          Pagado
        </button>
      </div>
      
      {/* Filtros por tiempo */}
      <div className="flex rounded-md overflow-hidden border border-gray-300">
        <button
          onClick={() => onTimeChange('all')}
          className={`px-3 py-2 text-sm font-medium ${
            timeFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Todo tiempo
        </button>
        <button
          onClick={() => onTimeChange('last-hour')}
          className={`px-3 py-2 text-sm font-medium flex items-center ${
            timeFilter === 'last-hour'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Clock size={14} className="mr-1" />
          Última hora
        </button>
        <button
          onClick={() => onTimeChange('today')}
          className={`px-3 py-2 text-sm font-medium ${
            timeFilter === 'today'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => onTimeChange('yesterday')}
          className={`px-3 py-2 text-sm font-medium ${
            timeFilter === 'yesterday'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Ayer
        </button>
      </div>
      
      {/* Filtro por mesa */}
      <select
        value={tableFilter}
        onChange={(e) => onTableChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">Todas las mesas</option>
        {tables.map(table => (
          <option key={table.id} value={table.id.toString()}>
            Mesa {table.number}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderFilterBar;
