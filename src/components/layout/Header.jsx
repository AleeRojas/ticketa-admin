import React, { useState } from 'react';
import { Search, Bell, X, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import WooSyncStatus from '../woocommerce/WooSyncStatus';

/**
 * Componente de cabecera de la aplicación adaptado para móviles
 */
const Header = () => {
  const { toggleSidebar, isSidebarOpen } = useAppContext();
  const [showSearch, setShowSearch] = useState(false);
  
  // Función para manejar el clic en el botón del menú
  const handleMenuClick = (e) => {
    e.stopPropagation(); // Evita que el evento se propague
    toggleSidebar();
  };

  return (
    <header className="bg-white shadow-sm p-2 md:p-4 safe-top">
      <div className="flex justify-between items-center">
        {/* Logo y Título */}
        <div className="flex items-center">
          {/* Botón de menú móvil desde el Header (alternativa) */}
          <button 
            onClick={handleMenuClick}
            className="lg:hidden mr-2 text-gray-600"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg md:text-2xl font-semibold text-gray-800">YAMENÚ</h1>
        </div>

        {/* Parte derecha del header - versión desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <div className="relative">
            <Bell className="text-gray-600 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>

        {/* Controles móviles */}
        <div className="flex md:hidden items-center space-x-2">
          {showSearch ? (
            <div className="absolute inset-0 bg-white z-20 p-2 flex items-center">
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="flex-1 pl-8 pr-4 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <Search className="absolute left-4 top-5 text-gray-400" size={14} />
              <button 
                onClick={() => setShowSearch(false)}
                className="ml-2 text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowSearch(true)} className="text-gray-600 p-1">
                <Search size={18} />
              </button>
              <div className="relative p-1">
                <Bell className="text-gray-600" size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Barra de estado de sincronización en versión móvil */}
      <div className="md:hidden mt-2">
        <WooSyncStatus />
      </div>
    </header>
  );
};

export default Header;
