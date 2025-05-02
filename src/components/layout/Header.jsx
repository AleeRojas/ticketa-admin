import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, Menu, RefreshCw, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useWooCommerceContext } from '../../context/WooCommerceContext';
import WooSyncStatus from '../woocommerce/WooSyncStatus';

/**
 * Componente de cabecera de la aplicación adaptado para móviles
 */
const Header = () => {
  // Obtenemos el estado del sidebar y la función para alternarlo desde el contexto
  const { toggleSidebar, isSidebarOpen } = useAppContext();
  // Estado local para controlar la visibilidad de la barra de búsqueda en móvil
  const [showSearch, setShowSearch] = useState(false);

  // Función para manejar el clic en el botón del menú
  const handleMenuClick = (e) => {
    e.stopPropagation(); // Evita que el evento se propague
    toggleSidebar(); // Llama a la función del contexto para alternar el sidebar
  };

  return (
    <header className="bg-white shadow-sm p-2 md:p-4 safe-top">
      <div className="flex justify-between items-center">
        {/* Logo y Título */}
        <div className="flex items-center">
          {/* Botón de menú móvil desde el Header (alternativa) */}
          {/* Aplicamos clases de transición y rotación condicional */}
          <button
            onClick={handleMenuClick}
            className={`lg:hidden mr-2 text-gray-600 transition-transform duration-300 ${isSidebarOpen ? 'rotate-90' : ''}`}
            aria-label="Menu"
          >
            {/* Icono del menú */}
            <Menu size={20} />
          </button>
          {/* Título de la aplicación */}
          <h1 className="text-lg md:text-2xl font-semibold text-gray-800">YAMENÚ</h1>
        </div>

        {/* Parte derecha del header - versión desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          
          {/* Aquí añadiremos el componente de sincronización */}
          <SyncStatusIndicator />
          
          {/* Icono de notificaciones */}
          <div className="relative">
            <Bell className="text-gray-600 cursor-pointer" />
            {/* Contador de notificaciones */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
          {/* Avatar de usuario */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>

        {/* Controles móviles */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Renderizado condicional de la barra de búsqueda móvil */}
          {showSearch ? (
            // Barra de búsqueda móvil activa
            <div className="absolute inset-0 bg-white z-20 p-2 flex items-center">
              <input
                type="text"
                placeholder="Buscar..."
                className="flex-1 pl-8 pr-4 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <Search className="absolute left-4 top-5 text-gray-400" size={14} />
              {/* Botón para cerrar la barra de búsqueda móvil */}
              <button
                onClick={() => setShowSearch(false)}
                className="ml-2 text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            // Controles móviles normales (búsqueda, notificaciones, avatar)
            <>
              {/* Botón para mostrar la barra de búsqueda móvil */}
              <button onClick={() => setShowSearch(true)} className="text-gray-600 p-1">
                <Search size={18} />
              </button>
              
              {/* Componente de sincronización móvil */}
              <SyncStatusIndicator isMobile={true} />
              
              {/* Icono de notificaciones móvil */}
              <div className="relative p-1">
                <Bell className="text-gray-600" size={18} />
                {/* Contador de notificaciones móvil */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              {/* Avatar de usuario móvil */}
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </>
          )}
        </div>
      </div>

    </header>
  );
};


const SyncStatusIndicator = ({ isMobile = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { syncEnabled, syncing, lastSyncTime, performSync, isOnline, pendingOperations = [] } = useWooCommerceContext();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  // Cambiamos la clase pero no deshabilitamos el botón
  const buttonClass = `${isMobile ? 'p-1' : 'p-1.5'} rounded-full ${
    syncing ? 'text-indigo-400 bg-indigo-50' :
    !syncEnabled ? 'text-gray-400 hover:bg-gray-100' :
    isOnline ? 'text-indigo-600 hover:bg-indigo-50' : 'text-amber-500 hover:bg-amber-50'
  }`;
  
  let indicator = null;
  if (pendingOperations.length > 0) {
    indicator = <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{pendingOperations.length}</span>;
  } else if (!isOnline) {
    indicator = <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>;
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Quitamos el disabled={!syncEnabled} para permitir desplegar siempre */}
      <button onClick={handleIconClick} className={buttonClass}>
        <RefreshCw size={isMobile ? 18 : 16} className={syncing ? 'animate-spin' : ''} />
        {indicator}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-30" style={{width: '280px'}}>
          <WooSyncStatus inDropdown={true} />
        </div>
      )}
    </div>
  );
};

export default Header;
