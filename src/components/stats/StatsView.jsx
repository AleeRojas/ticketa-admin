import React, { useState } from 'react';
import { BarChart, Calendar, TrendingUp, DollarSign, Users, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SalesStats from './SalesStats';
import ProductStats from './ProductStats';
import TableStats from './TableStats';
import StatsDateFilter from './StatsDateFilter';

/**
 * Vista principal de estadísticas
 */
const StatsView = () => {
  const { 
    orders, 
    tables, 
    products,
    salones
  } = useAppContext();
  
  // Estados locales
  const [dateRange, setDateRange] = useState('today');
  const [activeTab, setActiveTab] = useState('general');
  
  // Filtrar órdenes por rango de fecha
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    switch(dateRange) {
      case 'today':
        return orderDate >= today;
      case 'yesterday':
        return orderDate >= yesterday && orderDate < today;
      case 'week':
        return orderDate >= thisWeekStart;
      case 'month':
        return orderDate >= thisMonthStart;
      case 'all':
      default:
        return true;
    }
  });
  
  // Calcular estadísticas generales
  const calculateGeneralStats = () => {
    // Total de ventas
    const totalSales = filteredOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => 
        itemSum + (item.price * item.quantity), 0);
    }, 0);
    
    // Pedidos por estado
    const ordersByStatus = {
      total: filteredOrders.length,
      enCurso: filteredOrders.filter(o => o.status === 'en curso').length,
      pagando: filteredOrders.filter(o => o.status === 'pagando').length,
      pagado: filteredOrders.filter(o => o.status === 'pagado').length,
    };
    
    // Mesas por estado
    const tablesByStatus = {
      total: tables.length,
      ocupadas: tables.filter(t => t.status === 'ocupada').length,
      libres: tables.filter(t => t.status === 'libre').length,
      pagando: tables.filter(t => t.status === 'pagando').length,
      reservadas: tables.filter(t => t.status === 'reservada').length,
    };
    
    // Productos más vendidos
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    
    return {
      totalSales,
      ordersByStatus,
      tablesByStatus,
      topProducts,
      averageOrderValue: ordersByStatus.total > 0 
        ? totalSales / ordersByStatus.total 
        : 0
    };
  };
  
  const stats = calculateGeneralStats();

  return (
    <div>
      {/* Cabecera y filtros */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Estadísticas del Restaurante
        </h2>
        
        <StatsDateFilter 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Pestañas de estadísticas */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'general' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart size={16} className="mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'sales' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <DollarSign size={16} className="mr-2" />
            Ventas
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'products' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'tables' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={16} className="mr-2" />
            Mesas
          </button>
        </div>
      </div>

      {/* Resumen de estadísticas generales */}
      {activeTab === 'general' && (
        <>
          {/* Cards de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total de Ventas</p>
                  <p className="text-3xl font-bold">{stats.totalSales} </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 flex items-center">
                  <TrendingUp size={16} className="mr-1" /> 
                  {stats.ordersByStatus.total} pedidos
                </span>
                <span className="ml-auto text-gray-500">
                  {dateRange === 'today' ? 'Hoy' : 
                   dateRange === 'yesterday' ? 'Ayer' : 
                   dateRange === 'week' ? 'Esta semana' : 
                   dateRange === 'month' ? 'Este mes' : 'Todo el tiempo'}
                </span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ticket Promedio</p>
                  <p className="text-3xl font-bold">{stats.averageOrderValue} </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(80, stats.averageOrderValue / 20 * 100)}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ocupación de Mesas</p>
                  <p className="text-3xl font-bold">
                    {stats.tablesByStatus.total > 0 
                      ? `${Math.round((stats.tablesByStatus.ocupadas / stats.tablesByStatus.total) * 100)}%` 
                      : '0%'}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <Clock size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-amber-500">
                  {stats.tablesByStatus.ocupadas} ocupadas
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-emerald-500">
                  {stats.tablesByStatus.libres} libres
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-purple-500">
                  {stats.tablesByStatus.reservadas} reservadas
                </span>
              </div>
            </div>
          </div>
          
          {/* Productos más vendidos */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map(product => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-sm">{product.name}</td>
                      <td className="py-3 text-sm text-center">{product.quantity} uds.</td>
                      <td className="py-3 text-sm text-right font-medium">{product.revenue} </td>
                    </tr>
                  ))}
                  {stats.topProducts.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-gray-500">
                        No hay datos de ventas en el período seleccionado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Distribución de pedidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Estado de Pedidos</h3>
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">En curso</p>
                  <p className="text-lg font-semibold">{stats.ordersByStatus.enCurso} pedidos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pagando</p>
                  <p className="text-lg font-semibold">{stats.ordersByStatus.pagando} pedidos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completados</p>
                  <p className="text-lg font-semibold">{stats.ordersByStatus.pagado} pedidos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Distribución por Salón</h3>
              
              {salones.map(salon => {
                const salonTables = tables.filter(t => t.salon === salon.id);
                const occupiedTables = salonTables.filter(t => t.status === 'ocupada').length;
                const occupancyPercentage = salonTables.length > 0 
                  ? (occupiedTables / salonTables.length) * 100 
                  : 0;
                  
                return (
                  <div key={salon.id} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{salon.name}</span>
                      <span className="text-sm text-gray-500">
                        {occupiedTables} / {salonTables.length} mesas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${occupancyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      
      {/* Estadísticas específicas según la pestaña */}
      {activeTab === 'sales' && (
        <SalesStats orders={filteredOrders} dateRange={dateRange} />
      )}
      
      {activeTab === 'products' && (
        <ProductStats orders={filteredOrders} products={products} dateRange={dateRange} />
      )}
      
      {activeTab === 'tables' && (
        <TableStats orders={filteredOrders} tables={tables} dateRange={dateRange} />
      )}
    </div>
  );
};

export default StatsView;
