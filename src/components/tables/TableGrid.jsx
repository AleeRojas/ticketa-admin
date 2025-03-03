import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTableColor, getStatusText } from '../../utils/statusHelpers';
import VisualTableLayout from './VisualTableLayout';
import SchematicTableLayout from './SchematicTableLayout';

/**
 * Componente que muestra la cuadrícula de mesas según el tipo de vista
 */
const TableGrid = () => {
  const { 
    viewType, 
    activeSalon, 
    salones,
    isUpdating
  } = useAppContext();

  // Determinar qué layout mostrar basado en viewType
  const renderTableLayout = () => {
    if (viewType === 'visual') {
      return <VisualTableLayout />;
    } else {
      return <SchematicTableLayout />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 relative" style={{height: '500px'}}>
      <h3 className="absolute top-4 left-4 text-lg font-semibold text-gray-800">
        {salones.find(s => s.id === activeSalon)?.name || 'Salón'}
      </h3>
      
      {/* Elementos de fondo específicos por salón */}
      {activeSalon === 'principal' && (
        <>
          <div className="absolute left-4 top-16 p-2 text-gray-400 text-sm border border-gray-200 rounded bg-gray-50">Entrada</div>
          <div className="absolute right-4 top-16 p-2 text-gray-400 text-sm border border-gray-200 rounded bg-gray-50">Cocina</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-gray-200 rounded-lg pointer-events-none"></div>
        </>
      )}
      
      {activeSalon === 'terraza' && (
        <>
          <div className="absolute left-4 top-16 p-2 text-gray-400 text-sm border border-gray-200 rounded bg-gray-50">Jardín</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-gray-200 rounded-lg pointer-events-none"></div>
          <div className="absolute bottom-8 right-8 text-6xl opacity-10 pointer-events-none">☀️</div>
        </>
      )}
      
      {/* Renderizar el layout apropiado */}
      {renderTableLayout()}
    </div>
  );
};

export default TableGrid;
