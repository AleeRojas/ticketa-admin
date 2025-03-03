import React, { useState } from 'react';
import { Filter, Search, Clock, List, Grid, CreditCard, Utensils, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import OrderList from './OrderList';
import OrderFilterBar from './OrderFilterBar';
import OrderStats from './OrderStats';

/**
 * Vista principal de pedidos
 */
const OrdersView = () => {
  const { 
    orders, 
    tables
  } = useAppContext();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tableFilter, setTableFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'grid'
  
  // Filtrado de pedidos
  const filteredOrders = orders.filter(order => {
    // Filtro por búsqueda (table number, items, etc)
    const tableNumber = tables.find(t => t.id === order.tableId)?.number || '';
    const itemNames = order.items.map(item => item.name.toLowerCase()).join(' ');
    const matchesSearch = 
      tableNumber.toString().includes(searchTerm.toLowerCase()) || 
      itemNames.includes(searchTerm.toLowerCase());
    
    // Filtro por estado
    const matchesStatus = 
      statusFilter === 'all' || order.status === statusFilter;
    
    // Filtro por mesa
    const matchesTable = 
      tableFilter === 'all' || order.tableId.toString() === tableFilter;
    
    // Filtro por tiempo
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const orderTime = new Date(order.createdAt).getTime();
      const now = new Date().getTime();
      const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
      
      switch (timeFilter) {
        case 'last-hour':
          matchesTime = hoursDiff <= 1;
          break;
        case 'today':
          matchesTime = hoursDiff <= 24;
          break;
        case 'yesterday':
          matchesTime = hoursDiff > 24 && hoursDiff <= 48;
          break;
        default:
          matchesTime = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesTable && matchesTime;
  });
  
  // Estadísticas de pedidos
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'en curso').length,
    completed: orders.filter(o => o.status === 'pagado').length,
    paying: orders.filter(o => o.status === 'pagando').length,
    filtered: filteredOrders.length,
    totalAmount: filteredOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => 
        itemSum + (item.price * item.quantity), 0);
    }, 0)
  };
  
  // Agrupar pedidos por mesa
  const ordersByTable = filteredOrders.reduce((groups, order) => {
    const tableId = order.tableId;
    if (!groups[tableId]) {
      groups[tableId] = [];
    }
    groups[tableId].push(order);
    return groups;
  }, {});

  return (
    <div>
      {/* Cabecera y filtros */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de pedidos
        </h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar pedidos..." 
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          
          <button className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1">
            <Filter size={16} />
            <span>Filtrar</span>
          </button>
          
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de filtros */}
      <OrderFilterBar 
        tables={tables}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        tableFilter={tableFilter}
        onTableChange={setTableFilter}
        timeFilter={timeFilter}
        onTimeChange={setTimeFilter}
      />

      {/* Estadísticas */}
      <OrderStats stats={orderStats} />

      {/* Lista o grid de pedidos */}
      <OrderList 
        orders={filteredOrders}
        ordersByTable={ordersByTable}
        tables={tables} 
        viewMode={viewMode}
      />
    </div>
  );
};

export default OrdersView;
