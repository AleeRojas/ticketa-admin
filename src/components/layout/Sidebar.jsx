import React from 'react';
import { 
  LayoutGrid,
  UtensilsCrossed, 
  ClipboardList, 
  Package, 
  Users, 
  Settings,
  Menu, // Importamos el icono para el menú móvil
  X // Importamos el icono para cerrar
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente de barra lateral de navegación con soporte para dispositivos móviles
 */
const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useAppContext();

  // Array de elementos del menú para mejor mantenimiento
  const menuItems = [
    { icon: <LayoutGrid size={24} />, label: 'Dashboard', active: true },
    { icon: <UtensilsCrossed size={24} />, label: 'Restaurante' },
    { icon: <ClipboardList size={24} />, label: 'Pedidos' },
    { icon: <Package size={24} />, label: 'Productos' },
    { icon: <Users size={24} />, label: 'Usuarios' },
    { icon: <Settings size={24} />, label: 'Configuración', isLast: true }
  ];

  return (
    <>
      {/* Overlay para dispositivos móviles cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Botón de menú móvil */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 bg-indigo-600 text-white p-2 rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:static top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out
        w-64 lg:w-16 bg-indigo-900 text-white flex flex-col lg:items-center py-6 space-y-8`}
      >
        {/* Botón para cerrar (solo en móvil) */}
        <div className="flex justify-between items-center px-4 lg:px-0 mb-6 lg:mb-0">
          <div className="p-2 rounded-lg bg-indigo-700 lg:mx-auto">
            <LayoutGrid size={24} />
          </div>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Elementos del menú */}
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`
              p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer
              ${index === 0 ? 'bg-indigo-700' : ''}
              ${item.isLast ? 'mt-auto lg:mt-auto' : ''}
              ${isSidebarOpen ? 'flex items-center px-4' : 'lg:mx-auto'}
            `}
          >
            {item.icon}
            {isSidebarOpen && <span className="ml-3 lg:hidden">{item.label}</span>}
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
