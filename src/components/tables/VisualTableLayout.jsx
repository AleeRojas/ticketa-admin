import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTableColor, getStatusText } from '../../utils/statusHelpers';
import TableVisual from './TableVisual';

/**
 * Componente que muestra las mesas en formato visual (plano del salón)
 */
const VisualTableLayout = () => {
  const { 
    filteredTables, 
    isUpdating,
    setActiveOrderTable,
    setShowContextMenu,
    getTableOrders
  } = useAppContext();

  const handleTableClick = (table, e) => {
    // Al hacer clic en una mesa, mostrar menú contextual
    setActiveOrderTable(table);
    setShowContextMenu({ 
      visible: true, 
      x: e.clientX, 
      y: e.clientY,
      table: table 
    });
  };

  return (
    <div className="relative w-full h-full">
      {filteredTables.map((table) => (
        <TableVisual 
          key={table.id}
          table={table} 
          isUpdating={isUpdating}
          onClick={handleTableClick}
          orderCount={getTableOrders(table.id).length}
        />
      ))}
    </div>
  );
};

export default VisualTableLayout;
