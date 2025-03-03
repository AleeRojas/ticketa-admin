import React from 'react';
import { Utensils, Edit } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getTableColor, getStatusText } from '../../utils/statusHelpers';

/**
 * Menú contextual para mesas
 */
const TableContextMenu = () => {
  const { 
    showContextMenu, 
    setShowContextMenu,
    setActiveOrderTable,
    setShowOrderModal,
    setEditingTable,
    setShowTableModal,
    getTableOrders,
    getTableTotal
  } = useAppContext();

  if (!showContextMenu.visible || !showContextMenu.table) {
    return null;
  }

  const { table } = showContextMenu;
  const tableColors = getTableColor(table.status);
  const orderCount = getTableOrders(table.id).length;

  return (
    <>
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-lg border overflow-hidden w-48"
        style={{
          left: `${showContextMenu.x}px`,
          top: `${showContextMenu.y}px`,
        }}
      >
        <div className="px-4 py-2 bg-gray-50 font-medium border-b">
          Mesa {table.number}
        </div>
        <div className="p-1">
          <button
            onClick={() => {
              setActiveOrderTable(table);
              setShowOrderModal(true);
              setShowContextMenu({...showContextMenu, visible: false});
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center rounded"
          >
            <Utensils size={16} className="mr-2 text-blue-600" />
            {orderCount > 0 ? (
              <span>Ver pedidos <span className="bg-red-100 text-red-800 text-xs rounded-full px-1.5">
                {orderCount}
              </span></span>
            ) : (
              <span>Nuevo pedido</span>
            )}
          </button>
          
          <button
            onClick={() => {
              setEditingTable(table);
              setShowTableModal(true);
              setShowContextMenu({...showContextMenu, visible: false});
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center rounded"
          >
            <Edit size={16} className="mr-2 text-gray-600" />
            Editar mesa
          </button>
          
          <div className="border-t my-1"></div>
          
          <div className="px-3 py-2 text-xs text-gray-500">
            Estado: <span className={`px-1.5 py-0.5 rounded-full ${tableColors.light} ${tableColors.text} font-medium`}>
              {getStatusText(table.status)}
            </span>
          </div>
          
          {orderCount > 0 && (
            <div className="px-3 py-1 text-xs text-gray-500">
              Total: <span className="font-medium">{getTableTotal(table.id).toFixed(2)} €</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Fondo transparente para cerrar el menú al hacer clic fuera */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setShowContextMenu({...showContextMenu, visible: false})}
      ></div>
    </>
  );
};

export default TableContextMenu;
