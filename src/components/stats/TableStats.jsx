import React from 'react';
import { Users, Clock, DollarSign, TrendingUp, Tag } from 'lucide-react';

/**
 * Componente para mostrar estadísticas de mesas
 */
const TableStats = ({ orders, tables, dateRange }) => {
  // Agrupar órdenes por mesa
  const ordersByTable = {};
  orders.forEach(order => {
    if (!ordersByTable[order.tableId]) {
      ordersByTable[order.tableId] = [];
    }
    ordersByTable[order.tableId].push(order);
  });
  
  // Calcular estadísticas por mesa
  const tableStats = tables.map(table => {
    const tableOrders = ordersByTable[table.id] || [];
    const totalSales = tableOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => 
        itemSum + (item.price * item.quantity), 0);
    }, 0);
    
    const totalItems = tableOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => 
        itemSum + item.quantity, 0);
    }, 0);
    
    return {
      ...table,
      orders: tableOrders.length,
      totalSales,
      totalItems,
      avgSalePerOrder: tableOrders.length > 0 ? totalSales / tableOrders.length : 0
    };
  });
  
  // Calcular totales
  const totalTables = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'ocupada').length;
  const freeTables = tables.filter(t => t.status === 'libre').length;
  const tablesWithOrders = Object.keys(ordersByTable).length;
  const totalSales = tableStats.reduce((sum, table) => sum + table.totalSales, 0);
  const totalOrders = tableStats.reduce((sum, table) => sum + table.orders, 0);
  
  // Ordenar mesas por ventas
  const topTables = [...tableStats].sort((a, b) => b.totalSales - a.totalSales).slice(0, 10);
  const topOrderTables = [...tableStats].sort((a, b) => b.orders - a.orders).slice(0, 10);
  
  // Calcular ocupación media (simulado para estadísticas históricas)
  const occupancyRate = totalTables > 0 ? (occupiedTables / totalTables) * 100 : 0;
  
  // Calcular tiempo medio por mesa (simulado)
  const avgTimePerTable = 45; // en minutos
  
  return (
    <div>
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ocupación de Mesas</p>
              <p className="text-3xl font-bold">{occupancyRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <Users size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {occupiedTables} de {totalTables} mesas ocupadas
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tiempo Medio por Mesa</p>
              <p className="text-3xl font-bold">{avgTimePerTable} min</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Clock size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Promedio de ocupación
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Venta Media por Mesa</p>
              <p className="text-3xl font-bold">
                {(totalSales / Math.max(1, tablesWithOrders))} 
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {totalSales}  en total
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pedidos por Mesa</p>
              <p className="text-3xl font-bold">
                {(totalOrders / Math.max(1, tablesWithOrders)).toFixed(1)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {totalOrders} pedidos en total
          </p>
        </div>
      </div>
      
      {/* Gráfico de distribución de estado de mesas */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Estado Actual de Mesas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-emerald-800">Libres</h4>
              <span className="text-2xl font-bold text-emerald-600">{freeTables}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${(freeTables / totalTables) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              {((freeTables / totalTables) * 100).toFixed(1)}% del total
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-amber-800">Ocupadas</h4>
              <span className="text-2xl font-bold text-amber-600">{occupiedTables}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full" 
                style={{ width: `${(occupiedTables / totalTables) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              {((occupiedTables / totalTables) * 100).toFixed(1)}% del total
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-blue-800">Pagando</h4>
              <span className="text-2xl font-bold text-blue-600">
                {tables.filter(t => t.status === 'pagando').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ 
                  width: `${(tables.filter(t => t.status === 'pagando').length / totalTables) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {((tables.filter(t => t.status === 'pagando').length / totalTables) * 100).toFixed(1)}% del total
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-purple-800">Reservadas</h4>
              <span className="text-2xl font-bold text-purple-600">
                {tables.filter(t => t.status === 'reservada').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ 
                  width: `${(tables.filter(t => t.status === 'reservada').length / totalTables) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-purple-700 mt-1">
              {((tables.filter(t => t.status === 'reservada').length / totalTables) * 100).toFixed(1)}% del total
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top mesas por ventas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Mesas por Ventas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas</th>
                </tr>
              </thead>
              <tbody>
                {topTables.map((table) => (
                  <tr key={table.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 
                          ${table.status === 'ocupada' ? 'bg-amber-500' : 
                            table.status === 'libre' ? 'bg-emerald-500' : 
                            table.status === 'pagando' ? 'bg-blue-500' : 
                            'bg-purple-500'}`}
                        ></div>
                        <span className="font-medium">Mesa {table.number}</span>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-center">{table.orders}</td>
                    <td className="py-2 text-sm text-right font-medium">{table.totalSales} </td>
                  </tr>
                ))}
                {topTables.length === 0 && (
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
        
        {/* Top mesas por número de pedidos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Mesas por Número de Pedidos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Venta Media</th>
                </tr>
              </thead>
              <tbody>
                {topOrderTables.map((table) => (
                  <tr key={table.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 
                          ${table.status === 'ocupada' ? 'bg-amber-500' : 
                            table.status === 'libre' ? 'bg-emerald-500' : 
                            table.status === 'pagando' ? 'bg-blue-500' : 
                            'bg-purple-500'}`}
                        ></div>
                        <span className="font-medium">Mesa {table.number}</span>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-center">{table.orders}</td>
                    <td className="py-2 text-sm text-right font-medium">{table.avgSalePerOrder} </td>
                  </tr>
                ))}
                {topOrderTables.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No hay datos de pedidos en el período seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Estadísticas por tamaño de mesa */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Rendimiento por Tamaño de Mesa</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nº de Mesas</th>
                <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ítems</th>
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Venta Total</th>
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Venta Media</th>
              </tr>
            </thead>
            <tbody>
              {/* Agrupar por capacidad de las mesas */}
              {Array.from(new Set(tables.map(t => t.seats))).sort((a, b) => a - b).map(seatSize => {
                const tablesOfSize = tableStats.filter(t => t.seats === seatSize);
                const totalTablesOfSize = tablesOfSize.length;
                const totalOrdersOfSize = tablesOfSize.reduce((sum, t) => sum + t.orders, 0);
                const totalItemsOfSize = tablesOfSize.reduce((sum, t) => sum + t.totalItems, 0);
                const totalSalesOfSize = tablesOfSize.reduce((sum, t) => sum + t.totalSales, 0);
                const avgSaleOfSize = totalOrdersOfSize > 0 ? totalSalesOfSize / totalOrdersOfSize : 0;
                
                return (
                  <tr key={seatSize} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-sm">
                      <span className="font-medium">{seatSize} personas</span>
                    </td>
                    <td className="py-2 text-sm text-center">{totalTablesOfSize}</td>
                    <td className="py-2 text-sm text-center">{totalOrdersOfSize}</td>
                    <td className="py-2 text-sm text-center">{totalItemsOfSize}</td>
                    <td className="py-2 text-sm text-right">{totalSalesOfSize} </td>
                    <td className="py-2 text-sm text-right font-medium">{avgSaleOfSize} </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableStats;