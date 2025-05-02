import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTableColor, getStatusText } from '../../utils/statusHelpers';
import { Utensils, Edit, Plus, Clock, Users, DollarSign, MoreVertical, ChevronRight, XCircle } from 'lucide-react';

/**
 * Componente que muestra las mesas en formato de lista con soporte mejorado para móvil
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openActions, setOpenActions] = useState(null);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Cerrar el menú de acciones al hacer clic en cualquier parte
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActions && !event.target.closest('.table-actions')) {
        setOpenActions(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActions]);

  // Función para formatear el tiempo en formato relativo
  const formatRelativeTime = (timeString) => {
    if (!timeString) return '-';
    
    // Esta función convertiría el tiempo en un formato relativo como "hace 10 min"
    // Aquí simplemente devolvemos el valor original para mantener la compatibilidad
    return timeString;
  };
  
  // Renderizar vista móvil
  const renderMobileView = () => {
    return (
      <div className="bg-gray-50 rounded-lg">
        <div className="grid gap-3 p-3">
          {filteredTables.map(table => {
            const tableColors = getTableColor(table.status);
            const orderCount = getTableOrders(table.id).length;
            const total = getTableTotal(table.id);
            
            return (
              <div 
                key={table.id} 
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Cabecera de la tarjeta */}
                <div className="px-4 py-3 flex justify-between items-center border-b">
                  <div className="flex items-center">
                    <div className="mr-2 font-semibold text-gray-900">Mesa {table.number}</div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tableColors.light} ${tableColors.text}`}>
                      {getStatusText(table.status)}
                    </span>
                  </div>
                  <div className="relative table-actions">
                    <button 
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                      onClick={() => setOpenActions(openActions === table.id ? null : table.id)}
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {/* Menú desplegable de acciones */}
                    {openActions === table.id && (
                      <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-10 w-48 py-1 border">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            setEditingTable(table);
                            setShowTableModal(true);
                            setOpenActions(null);
                          }}
                        >
                          <Edit size={14} className="mr-2" />
                          Editar mesa
                        </button>
                        {orderCount > 0 ? (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              setActiveOrderTable(table);
                              setShowOrderModal(true);
                              setOpenActions(null);
                            }}
                          >
                            <Utensils size={14} className="mr-2" />
                            Ver pedidos ({orderCount})
                          </button>
                        ) : (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center"
                            onClick={() => {
                              setActiveOrderTable(table);
                              setShowOrderModal(true);
                              setOpenActions(null);
                            }}
                          >
                            <Plus size={14} className="mr-2" />
                            Nuevo pedido
                          </button>
                        )}
                        {table.status !== 'libre' && (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            onClick={() => {
                              // Lógica para liberar mesa
                              setOpenActions(null);
                            }}
                          >
                            <XCircle size={14} className="mr-2" />
                            Liberar mesa
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Cuerpo de la tarjeta */}
                <div 
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => {
                    if (orderCount > 0) {
                      setActiveOrderTable(table);
                      setShowOrderModal(true);
                    } else {
                      setEditingTable(table);
                      setShowTableModal(true);
                    }
                  }}
                >
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        Tiempo
                      </span>
                      <span className="text-sm font-medium">
                        {formatRelativeTime(table.time)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Users size={12} className="mr-1" />
                        Capacidad
                      </span>
                      <span className="text-sm font-medium">
                        {table.seats} pax
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 flex items-center">
                        <DollarSign size={12} className="mr-1" />
                        Total
                      </span>
                      <span className="text-sm font-medium">
                        {total > 0 ? `${total} ` : '-'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="mt-3 border-t pt-3 flex justify-between">
                    {orderCount > 0 ? (
                      <button 
                        className="flex-1 bg-blue-50 text-blue-600 text-xs px-3 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOrderTable(table);
                          setShowOrderModal(true);
                        }}
                      >
                        <Utensils size={14} className="mr-2" />
                        {orderCount} {orderCount === 1 ? 'pedido' : 'pedidos'}
                      </button>
                    ) : (
                      <button 
                        className="flex-1 bg-blue-50 text-blue-600 text-xs px-3 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOrderTable(table);
                          setShowOrderModal(true);
                        }}
                      >
                        <Plus size={14} className="mr-2" />
                        Nuevo pedido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Renderizar vista desktop (tabla)
  const renderDesktopView = () => {
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
                    <div className="text-sm text-gray-900">{getTableTotal(table.id) > 0 ? `${getTableTotal(table.id)} ` : '-'}</div>
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

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default TableList;