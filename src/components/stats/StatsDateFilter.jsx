import React from 'react';
import { Calendar, Clock, CalendarDays, Calendar as CalendarIcon } from 'lucide-react';

/**
 * Componente para filtrar estadísticas por rango de fecha
 */
const StatsDateFilter = ({ dateRange, onDateRangeChange }) => {
  return (
    <div className="flex rounded-md overflow-hidden border border-gray-300 bg-white">
      <button
        onClick={() => onDateRangeChange('today')}
        className={`px-3 py-2 text-sm font-medium flex items-center ${
          dateRange === 'today' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Clock size={14} className="mr-1" />
        Hoy
      </button>
      <button
        onClick={() => onDateRangeChange('yesterday')}
        className={`px-3 py-2 text-sm font-medium flex items-center ${
          dateRange === 'yesterday' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Calendar size={14} className="mr-1" />
        Ayer
      </button>
      <button
        onClick={() => onDateRangeChange('week')}
        className={`px-3 py-2 text-sm font-medium flex items-center ${
          dateRange === 'week' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <CalendarDays size={14} className="mr-1" />
        Semana
      </button>
      <button
        onClick={() => onDateRangeChange('month')}
        className={`px-3 py-2 text-sm font-medium flex items-center ${
          dateRange === 'month' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <CalendarIcon size={14} className="mr-1" />
        Mes
      </button>
      <button
        onClick={() => onDateRangeChange('all')}
        className={`px-3 py-2 text-sm font-medium ${
          dateRange === 'all' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Todo
      </button>
    </div>
  );
};

export default StatsDateFilter;
