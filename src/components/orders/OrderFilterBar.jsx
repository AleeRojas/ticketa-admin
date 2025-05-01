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
    <div className="flex flex-col space-y-2 mb-6">
      {/* Filtros por estado */}
      <div className="flex overflow-x-auto pb-1 scrollbar-none mobile-touch-scroll">
        <div className="flex rounded-md overflow-hidden border border-gray-300 flex-shrink-0 mr-2">
          <button
            onClick={() => onStatusChange('all')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onStatusChange('en curso')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium flex items-center whitespace-nowrap ${
              statusFilter === 'en curso'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Utensils size={12} className="mr-1 hidden md:inline" />
            En curso
          </button>
          <button
            onClick={() => onStatusChange('pagando')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium flex items-center whitespace-nowrap ${
              statusFilter === 'pagando'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard size={12} className="mr-1 hidden md:inline" />
            Pagando
          </button>
          <button
            onClick={() => onStatusChange('pagado')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium flex items-center whitespace-nowrap ${
              statusFilter === 'pagado'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircle size={12} className="mr-1 hidden md:inline" />
            Pagado
          </button>
        </div>
        
        {/* Filtros por tiempo */}
        <div className="flex rounded-md overflow-hidden border border-gray-300 flex-shrink-0">
          <button
            onClick={() => onTimeChange('all')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium whitespace-nowrap ${
              timeFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todo tiempo
          </button>
          <button
            onClick={() => onTimeChange('last-hour')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium flex items-center whitespace-nowrap ${
              timeFilter === 'last-hour'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock size={12} className="mr-1 hidden md:inline" />
            Última hora
          </button>
          <button
            onClick={() => onTimeChange('today')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium whitespace-nowrap ${
              timeFilter === 'today'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => onTimeChange('yesterday')}
            className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium whitespace-nowrap ${
              timeFilter === 'yesterday'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Ayer
          </button>
        </div>
      </div>
      
      {/* Filtro por mesa */}
      <select
        value={tableFilter}
        onChange={(e) => onTableChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-full"
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
