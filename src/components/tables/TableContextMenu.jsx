import React from 'react';
import { Utensils, Edit, DollarSign, Clock } from 'lucide-react';
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
  
  // Formatear número con separador de miles (formato chileno)
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Formatear precio con símbolo de moneda chilena
  const formatPrice = (price) => {
    return "$" + formatNumber(parseFloat(price).toFixed(0));
  };

  // Determinar si estamos en dispositivo móvil
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Ajustar posición para que el menú no se corte en pantallas pequeñas
  const adjustPosition = () => {
    if (!isMobile) {
      return {
        left: `${showContextMenu.x}px`,
        top: `${showContextMenu.y}px`,
      };
    }

    // En móvil, centrar en la pantalla
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <>
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-lg border overflow-hidden w-64 md:w-48 max-w-[90vw]"
        style={adjustPosition()}
      >
        <div className="px-4 py-2 bg-gray-50 font-medium border-b flex justify-between items-center">
          <div>Mesa {table.number}</div>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${tableColors.light} ${tableColors.text} font-medium`}>
            {getStatusText(table.status)}
          </span>
        </div>
        <div className="p-1">
          {/* Información de la mesa */}
          <div className="px-3 py-2 flex justify-between items-center border-b">
            <div className="text-xs text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              Tiempo: <span className="ml-1 font-medium">{table.time || '00:00'}</span>
            </div>
            
            {orderCount > 0 && (
              <div className="text-xs text-gray-500 flex items-center">
                <DollarSign size={12} className="mr-1" />
                <span className="font-medium">{formatPrice(getTableTotal(table.id))}</span>
              </div>
            )}
          </div>

          {/* Botones de acciones */}
          <button
            onClick={() => {
              setActiveOrderTable(table);
              setShowOrderModal(true);
              setShowContextMenu({...showContextMenu, visible: false});
            }}
            className="w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 flex items-center rounded my-1"
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
            className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center rounded my-1"
          >
            <Edit size={16} className="mr-2 text-gray-600" />
            Editar mesa
          </button>
        </div>
      </div>
      
      {/* Fondo transparente para cerrar el menú al hacer clic fuera */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-25" 
        onClick={() => setShowContextMenu({...showContextMenu, visible: false})}
      ></div>
    </>
  );
};

export default TableContextMenu;
