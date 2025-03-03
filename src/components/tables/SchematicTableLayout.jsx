import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTableColor, getStatusText } from '../../utils/statusHelpers';
import { Clock, Utensils, Edit } from 'lucide-react';

/**
 * Componente que muestra las mesas en formato esquemático (cuadrícula)
 */
const SchematicTableLayout = () => {
  const { 
    filteredTables, 
    isUpdating,
    setActiveOrderTable,
    setShowOrderModal,
    setEditingTable,
    setShowTableModal,
    getTableOrders,
    getTableTotal
  } = useAppContext();

  return (
    <div className="grid grid-cols-4 gap-4 p-16">
      {filteredTables.map((table) => {
        const tableColors = getTableColor(table.status);
        const orderCount = getTableOrders(table.id).length;
        
        return (
          <div 
            key={table.id}
            className={`${tableColors.bg} border-2 ${tableColors.bg} rounded-lg p-3 cursor-pointer shadow-lg hover:shadow-xl transition-shadow ${
              isUpdating && table.status !== 'libre' ? 'animate-pulse' : ''
            }`}
            onClick={() => {
              setEditingTable(table);
              setShowTableModal(true);
            }}
          >
            <div className="text-white flex justify-between items-start">
              <div className="text-center relative">
                <span className="text-3xl font-bold block">{table.number}</span>
                <span className="text-xs block">{table.seats} pax</span>
                
                {/* Mostrar contador de pedidos si hay */}
                {orderCount > 0 && (
                  <div className="absolute -top-2 -right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {orderCount}
                  </div>
                )}
              </div>
              <div className={`px-2 py-1 rounded-full ${tableColors.light} ${tableColors.text} text-xs font-semibold`}>
                {getStatusText(table.status)}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-white">
              <div className="flex items-center text-xs">
                <Clock size={12} className="mr-1" />
                <span>{table.time || '00:00'}</span>
              </div>
              <div className="flex space-x-1">
                <button 
                  className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveOrderTable(table);
                    setShowOrderModal(true);
                  }}
                >
                  <Utensils size={12} className="mr-1" />
                  <span>{orderCount > 0 ? 'Pedidos' : 'Crear pedido'}</span>
                </button>
                <button 
                  className="bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTable(table);
                    setShowTableModal(true);
                  }}
                >
                  <Edit size={12} className="mr-1" />
                </button>
              </div>
            </div>
            
            {/* Mostrar total si hay pedidos */}
            {orderCount > 0 && (
              <div className="mt-2 text-right">
                <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded text-xs font-medium">
                  {getTableTotal(table.id).toFixed(2)} €
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SchematicTableLayout;
