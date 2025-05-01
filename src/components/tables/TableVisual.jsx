import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTableColor, getStatusText } from '../../utils/statusHelpers';

/**
 * Componente que representa visualmente una mesa individual
 */
const TableVisual = ({ table, isUpdating, onClick, orderCount }) => {
  const { 
    setActiveOrderTable,
    setShowOrderModal,
    setEditingTable,
    setShowTableModal
  } = useAppContext();

  const tableColors = getTableColor(table.status);

  // Renderiza las sillas alrededor de la mesa
  const renderChairs = () => {
    if (table.shape === 'circle' || table.seats <= 4) {
      // Para mesas circulares, distribuir sillas en círculo
      return (
        <div className="absolute w-full h-full">
          {Array.from({ length: table.seats }).map((_, idx) => {
            const angle = (idx * (360 / table.seats)) * (Math.PI / 180);
            const radius = Math.min((table.seats * 8 + 12) / 2 + 4, 25); // Radio adaptativo
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div 
                key={idx}
                className="absolute w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `50%`,
                  top: `50%`,
                  marginLeft: `${x}px`,
                  marginTop: `${y}px`
                }}
              />
            );
          })}
        </div>
      );
    } else {
      // Para mesas rectangulares, distribuir sillas alrededor
      return (
        <div className="absolute w-full h-full">
          {Array.from({ length: Math.min(table.seats, 8) }).map((_, idx) => {
            // Calcular posiciones alrededor de la mesa rectangular
            const positions = [
              { top: '-4px', left: '20%' },
              { top: '-4px', left: '50%' },
              { top: '-4px', left: '80%' },
              { bottom: '-4px', left: '20%' },
              { bottom: '-4px', left: '50%' },
              { bottom: '-4px', left: '80%' },
              { left: '-4px', top: '50%' },
              { right: '-4px', top: '50%' }
            ];
            return (
              <div 
                key={idx}
                className="absolute w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
                style={positions[idx]}
              />
            );
          })}
        </div>
      );
    }
  };

  return (
    <div 
      onClick={(e) => onClick(table, e)}
      className={`absolute cursor-pointer transition-all duration-300 transform hover:scale-105 ${isUpdating && 'hover:scale-100'}`}
      style={{
        left: `${table.x}%`, 
        top: `${table.y}%`, 
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Forma de la mesa - Circular para 2 y 4 personas, rectangular para 6+ */}
      {table.seats <= 4 ? (
        <div 
          className={`${tableColors.bg} rounded-full shadow-lg flex items-center justify-center ${isUpdating && table.status !== 'libre' ? 'animate-pulse' : ''}`}
          style={{ 
            width: `${Math.max(Math.min(table.seats * 8 + 16, 52), 28)}px`, 
            height: `${Math.max(Math.min(table.seats * 8 + 16, 52), 28)}px`
          }}
        >
          <span className="font-bold text-xs md:text-sm text-white">{table.number}</span>
          
          {/* Añadir indicadores de sillas para mesas circulares */}
          {renderChairs()}
          
          {/* Mostrar contador de pedidos si hay */}
          {orderCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {orderCount}
            </div>
          )}
        </div>
      ) : (
        // Mesa rectangular para grupos más grandes
        <div 
          className={`${tableColors.bg} rounded-lg shadow-lg flex items-center justify-center ${isUpdating && table.status !== 'libre' ? 'animate-pulse' : ''}`}
          style={{ 
            width: `${Math.min(table.seats * 8 + 16, 80)}px`, 
            height: `${Math.min(Math.ceil(table.seats/2) * 10 + 12, 50)}px`
          }}
        >
          <span className="font-bold text-xs md:text-sm text-white">{table.number}</span>
          
          {/* Añadir indicadores de sillas para mesas rectangulares */}
          {renderChairs()}
          
          {/* Mostrar contador de pedidos si hay */}
          {orderCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {orderCount}
            </div>
          )}
        </div>
      )}
      
      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded ${tableColors.light} ${tableColors.text} text-xs font-medium shadow-sm whitespace-nowrap z-10`}>
        {getStatusText(table.status)}
        {table.status !== 'libre' && table.status !== 'reservada' && (
          <span> • {table.time}</span>
        )}
        <div className="flex mt-0.5 space-x-1">
          <button 
            className="bg-blue-500 text-white text-xxs md:text-xs rounded px-1 md:px-2 py-0.5 hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setActiveOrderTable(table);
              setShowOrderModal(true);
            }}
          >
            {orderCount > 0 ? 'Ver pedidos' : 'Nuevo pedido'}
          </button>
          <button 
            className="bg-gray-500 text-white text-xxs md:text-xs rounded px-1 md:px-2 py-0.5 hover:bg-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setEditingTable(table);
              setShowTableModal(true);
            }}
          >
            Editar mesa
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableVisual;
