import React from 'react';
import { DollarSign, TrendingUp, Users, ShoppingBag, CreditCard, Smartphone } from 'lucide-react';

/**
 * Componente para mostrar estadísticas de ventas
 */
const SalesStats = ({ orders, dateRange }) => {
  // Calcular total de ventas
  const totalSales = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => 
      itemSum + (item.price * item.quantity), 0);
  }, 0);
  
  // Calcular ticket promedio
  const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
  
  // Calcular total de productos vendidos
  const totalProducts = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);
  
  // Agrupar por hora del día (para el período seleccionado)
  const salesByHour = Array(24).fill(0);
  orders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    salesByHour[hour] += orderTotal;
  });
  
  // Encontrar la hora pico y hora valle
  let peakHour = 0;
  let lowHour = 0;
  let peakSales = salesByHour[0];
  let lowSales = salesByHour[0];
  
  salesByHour.forEach((sales, hour) => {
    if (sales > peakSales) {
      peakSales = sales;
      peakHour = hour;
    }
    if (sales < lowSales || (lowSales === 0 && sales === 0)) {
      lowSales = sales;
      lowHour = hour;
    }
  });
  
  // Formatear hora (considerando formato 24h)
  const formatHour = (hour) => {
    return `${hour}:00`;
  };
  
  // Agrupar por método de pago (simulado)
  const paymentMethods = [
    { method: 'Efectivo', amount: totalSales * 0.35, icon: <DollarSign size={20} /> },
    { method: 'Tarjeta', amount: totalSales * 0.50, icon: <CreditCard size={20} /> },
    { method: 'Móvil', amount: totalSales * 0.15, icon: <Smartphone size={20} /> }
  ];
  
  return (
    <div>
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ventas Totales</p>
              <p className="text-3xl font-bold">{totalSales.toFixed(2)} €</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {dateRange === 'today' ? 'Hoy' : 
             dateRange === 'yesterday' ? 'Ayer' : 
             dateRange === 'week' ? 'Esta semana' : 
             dateRange === 'month' ? 'Este mes' : 'Todo el tiempo'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ticket Promedio</p>
              <p className="text-3xl font-bold">{averageOrderValue.toFixed(2)} €</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {orders.length} pedidos totales
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Productos Vendidos</p>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {(totalProducts / Math.max(1, orders.length)).toFixed(1)} productos por pedido
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Hora Pico</p>
              <p className="text-3xl font-bold">{formatHour(peakHour)}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {peakSales.toFixed(2)} € en ventas
          </p>
        </div>
      </div>
      
      {/* Gráfico de ventas por hora */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Ventas por Hora</h3>
        <div className="h-64">
          <div className="flex h-52 items-end space-x-2">
            {salesByHour.map((sales, hour) => {
              const percentage = peakSales > 0 ? (sales / peakSales) * 100 : 0;
              return (
                <div key={hour} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full ${
                      hour === peakHour 
                        ? 'bg-green-500' 
                        : hour === lowHour 
                          ? 'bg-gray-300' 
                          : 'bg-blue-500'
                    } rounded-t`}
                    style={{ height: `${Math.max(5, percentage)}%` }}
                  ></div>
                  <span className="text-xs mt-1">{hour}</span>
                </div>
              );
            })}
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">Hora del día</div>
        </div>
      </div>
      
      {/* Métodos de pago y pedidos por hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Métodos de Pago</h3>
          
          {paymentMethods.map((payment, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-100 text-gray-600 mr-2">
                    {payment.icon}
                  </div>
                  <span className="font-medium">{payment.method}</span>
                </div>
                <span className="text-gray-900 font-medium">{payment.amount.toFixed(2)} €</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-blue-500' : 
                    'bg-indigo-500'
                  } h-2 rounded-full`}
                  style={{ width: `${(payment.amount / totalSales) * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">
                {((payment.amount / totalSales) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Resumen de Pedidos</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de pedidos:</span>
              <span className="font-semibold">{orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pedidos completados:</span>
              <span className="font-semibold">{orders.filter(o => o.status === 'pagado').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pedidos en curso:</span>
              <span className="font-semibold">{orders.filter(o => o.status === 'en curso').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pedidos pagando:</span>
              <span className="font-semibold">{orders.filter(o => o.status === 'pagando').length}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tiempo promedio:</span>
                <span className="font-semibold">23 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesStats;