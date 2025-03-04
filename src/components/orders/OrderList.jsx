import React from 'react';
import { Clock, CreditCard, Edit, Printer, Eye, Trash, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente que muestra la lista de pedidos
 */
const OrderList = ({ orders, ordersByTable, tables, viewMode }) => {
  const { 
    setActiveOrderTable,
    setShowOrderModal,
    handleDeleteOrder,
    handlePayOrder
  } = useAppContext();
  
  // Calcular el total de un pedido
  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  // Obtener el número de mesa
  const getTableNumber = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    return table ? table.number : '-';
  };
  
  // Formatear tiempo relativo
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };
  
  // Obtener clase CSS según el estado del pedido
  const getStatusClass = (status) => {
    switch(status) {
      case 'en curso': 
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pagando': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pagado': 
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelado': 
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Si no hay pedidos, mostrar mensaje
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700">No se encontraron pedidos</h3>
        <p className="text-gray-500 mt-1">Prueba a cambiar los filtros o crea nuevos pedidos desde las mesas</p>
      </div>
    );
  }
  
  // Renderizar vista de lista
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Mesa {getTableNumber(order.tableId)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.map((item, index) => (
                      <span key={index} className="block">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {formatRelativeTime(order.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {calculateOrderTotal(order)} 
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => {
                        const table = tables.find(t => t.id === order.tableId);
                        if (table) {
                          setActiveOrderTable(table);
                          setShowOrderModal(true);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                    >
                      <Eye size={16} />
                    </button>
                    {order.status !== 'pagado' && (
                      <>
                        <button 
                          onClick={() => handlePayOrder(order.id)}
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded-full hover:bg-emerald-50"
                        >
                          <CreditCard size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
                              handleDeleteOrder(order.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50">
                      <Printer size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  // Renderizar vista por grupo (mesas)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(ordersByTable).map(([tableId, tableOrders]) => {
        const tableNumber = getTableNumber(parseInt(tableId, 10));
        const totalAmount = tableOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
        const latestOrder = tableOrders.reduce((latest, order) => 
          new Date(order.createdAt) > new Date(latest.createdAt) ? order : latest, tableOrders[0]);
        
        return (
          <div key={tableId} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Mesa {tableNumber}</h3>
                <p className="text-sm text-gray-500">{tableOrders.length} pedidos</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{totalAmount} </p>
                <p className="text-xs text-gray-500">
                  Actualizado {formatRelativeTime(latestOrder.updatedAt)}
                </p>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {tableOrders.map(order => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {calculateOrderTotal(order)} 
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-500">
                          {(item.price * item.quantity)} 
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => {
                        const table = tables.find(t => t.id === order.tableId);
                        if (table) {
                          setActiveOrderTable(table);
                          setShowOrderModal(true);
                        }
                      }}
                      className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100"
                    >
                      Ver
                    </button>
                    {order.status !== 'pagado' && (
                      <>
                        <button 
                          onClick={() => handlePayOrder(order.id)}
                          className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100 flex items-center"
                        >
                          <CreditCard size={12} className="mr-1" />
                          Pagar
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
                              handleDeleteOrder(order.id);
                            }
                          }}
                          className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                        >
                          <Trash size={12} className="mr-1" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
