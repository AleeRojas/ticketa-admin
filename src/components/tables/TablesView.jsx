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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 mb-4 md:mb-6">
        <SalonSelector />
        
        <div className="flex flex-wrap w-full md:w-auto gap-2">
          {/* Menú de salones */}
          <div className="relative">
            <button 
              onClick={() => setShowSalonMenu(!showSalonMenu)}
              className="bg-white border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
            >
              <MapPin size={14} className="md:w-4 md:h-4" />
              <span>Salones</span>
              <ChevronDown size={14} className="md:w-4 md:h-4" />
            </button>
            
            {showSalonMenu && (
              <div className="absolute mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-48">
                <button 
                  onClick={() => {
                    setShowSalonModal(true);
                    setEditingSalon(null);
                    setShowSalonMenu(false);
                  }}
                  className="px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <Plus size={14} className="mr-2" />
                  Crear nuevo salón
                </button>
                {/* El resto del menú se renderiza en SalonMenu.jsx */}
              </div>
            )}
          </div>
          
          {/* Botón de filtrar */}
          <button className="bg-white border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1">
            <Filter size={14} className="md:w-4 md:h-4" />
            <span>Filtrar</span>
          </button>
          
          {/* Botón de cambio de vista */}
          <button 
            onClick={() => setViewMode(viewMode === 'salon' ? 'lista' : 'salon')}
            className="bg-white border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
          >
            <Eye size={14} className="md:w-4 md:h-4" />
            <span>{viewMode === 'salon' ? 'Ver lista' : 'Ver salón'}</span>
          </button>
          
          {/* Botón de cambio de tipo de vista (solo en modo salón) */}
          {viewMode === 'salon' && (
            <button 
              onClick={() => setViewType(viewType === 'visual' ? 'esquema' : 'visual')}
              className="bg-white border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
            >
              <LayoutGrid size={14} className="md:w-4 md:h-4" />
              <span>{viewType === 'visual' ? 'Vista esquema' : 'Vista visual'}</span>
            </button>
          )}
          
          {/* Botón de añadir mesa */}
          <button 
            onClick={() => {
              setShowTableModal(true);
              setEditingTable(null);
            }}
            className="bg-indigo-600 text-white rounded-md px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium hover:bg-indigo-700 flex items-center space-x-1 ml-auto md:ml-0"
          >
            <Plus size={14} className="md:w-4 md:h-4" />
            <span>Añadir Mesa</span>
          </button>
        </div>
      </div>

      {/* Indicadores de estado y stats */}
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center mb-4 md:mb-6 gap-2 md:gap-0">
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
