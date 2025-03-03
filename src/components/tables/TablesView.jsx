import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Eye, Filter, LayoutGrid, MapPin, ChevronDown, Plus } from 'lucide-react';
import SalonSelector from '../salons/SalonSelector';
import SalonStats from '../salons/SalonStats';
import TableGrid from './TableGrid';
import TableList from './TableList';
import StatusIndicators from './StatusIndicators';
import RealtimeIndicator from '../ui/RealtimeIndicator';

/**
 * Componente principal para la vista de mesas
 */
const TablesView = () => {
  const { 
    viewMode, 
    setViewMode, 
    viewType, 
    setViewType,
    salonStats,
    showSalonMenu,
    setShowSalonMenu, 
    setShowTableModal,
    setEditingTable,
    setShowSalonModal,
    setEditingSalon,
    lastUpdate,
    isUpdating
  } = useAppContext();

  return (
    <div>
      {/* Cabecera con selectores de salón y acciones */}
      <div className="flex justify-between items-center mb-6">
        <SalonSelector />
        
        <div className="flex space-x-2">
          {/* Menú de salones */}
          <div className="relative">
            <button 
              onClick={() => setShowSalonMenu(!showSalonMenu)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
            >
              <MapPin size={16} />
              <span>Salones</span>
              <ChevronDown size={16} />
            </button>
            
            {showSalonMenu && (
              <div className="absolute mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-48">
                <button 
                  onClick={() => {
                    setShowSalonModal(true);
                    setEditingSalon(null);
                    setShowSalonMenu(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Crear nuevo salón
                </button>
                {/* El resto del menú se renderiza en SalonMenu.jsx */}
              </div>
            )}
          </div>
          
          {/* Botón de filtrar */}
          <button className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1">
            <Filter size={16} />
            <span>Filtrar</span>
          </button>
          
          {/* Botón de cambio de vista */}
          <button 
            onClick={() => setViewMode(viewMode === 'salon' ? 'lista' : 'salon')}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
          >
            <Eye size={16} />
            <span>{viewMode === 'salon' ? 'Ver lista' : 'Ver salón'}</span>
          </button>
          
          {/* Botón de cambio de tipo de vista (solo en modo salón) */}
          {viewMode === 'salon' && (
            <button 
              onClick={() => setViewType(viewType === 'visual' ? 'esquema' : 'visual')}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
            >
              <LayoutGrid size={16} />
              <span>{viewType === 'visual' ? 'Vista esquema' : 'Vista visual'}</span>
            </button>
          )}
          
          {/* Botón de añadir mesa */}
          <button 
            onClick={() => {
              setShowTableModal(true);
              setEditingTable(null);
            }}
            className="bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Añadir Mesa</span>
          </button>
        </div>
      </div>

      {/* Indicadores de estado y stats */}
      <div className="flex flex-wrap justify-between mb-6">
        <StatusIndicators stats={salonStats} />
        
        <RealtimeIndicator 
          isUpdating={isUpdating} 
          lastUpdate={lastUpdate} 
        />
      </div>

      {/* Vista de mesas */}
      {viewMode === 'salon' ? (
        <TableGrid />
      ) : (
        <TableList />
      )}

      {/* Resumen estadístico */}
      <SalonStats />
    </div>
  );
};

export default TablesView;
