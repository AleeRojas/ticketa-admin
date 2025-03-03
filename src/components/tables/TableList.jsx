import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTableColor, getStatusText } from '../../utils/statusHelpers';
import { Utensils, Edit, Plus } from 'lucide-react';

/**
 * Componente que muestra las mesas en formato de lista
 */
const TableList = () => {
  const { 
    filteredTables, 
    setActiveOrderTable,
    setShowOrderModal,
    setEditingTable,
    setShowTableModal,
    getTableOrders,
    getTableTotal
  } = useAppContext();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTables.map(table => {
            const tableColors = getTableColor(table.status);
            const orderCount = getTableOrders(table.id).length;
            
            return (
              <tr 
                key={table.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setEditingTable(table);
                  setShowTableModal(true);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Mesa {table.number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tableColors.light} ${tableColors.text}`}>
                    {getStatusText(table.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{table.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {orderCount > 0 ? (
                      <div className="flex space-x-1">
                        <button 
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-100 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrderTable(table);
                            setShowOrderModal(true);
                          }}
                        >
                          <span>{orderCount} pedidos</span>
                          <Utensils size={12} className="ml-1" />
                        </button>
                        <button 
                          className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTable(table);
                            setShowTableModal(true);
                          }}
                        >
                          <Edit size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-1">
                        <button 
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-100 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrderTable(table);
                            setShowOrderModal(true);
                          }}
                        >
                          <Plus size={12} className="mr-1" />
                          <span>Nuevo pedido</span>
                        </button>
                        <button 
                          className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTable(table);
                            setShowTableModal(true);
                          }}
                        >
                          <Edit size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getTableTotal(table.id) > 0 ? `${getTableTotal(table.id).toFixed(2)} €` : '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{table.seats} pax</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;
