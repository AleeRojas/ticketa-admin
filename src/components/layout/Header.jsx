import React, { useState } from 'react';
import { Search, Bell, X, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente de cabecera de la aplicación adaptado para móviles
 */
const Header = () => {
  const { toggleSidebar } = useAppContext();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        {/* Logo y Título */}
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 ml-8 lg:ml-0">YAMENÚ</h1>
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
        <div className="flex md:hidden items-center space-x-4">
          {showSearch ? (
            <div className="absolute inset-0 bg-white z-20 p-4 flex items-center">
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="flex-1 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <Search className="absolute left-8 top-6 text-gray-400" size={16} />
              <button 
                onClick={() => setShowSearch(false)}
                className="ml-2 text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowSearch(true)} className="text-gray-600">
                <Search size={20} />
              </button>
              <div className="relative">
                <Bell className="text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
