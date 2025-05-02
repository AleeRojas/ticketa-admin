import React, { useEffect } from 'react';
import {
  LayoutGrid,
  UtensilsCrossed,
  ClipboardList,
  Package,
  Users,
  Settings
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { isMobileDevice } from '../../utils/deviceDetection'; // Importamos la función de detección móvil

/**
 * Componente de barra lateral de navegación siempre visible en desktop (lg+)
 * y ocultable en móvil (<lg) usando animaciones CSS personalizadas.
 */
const Sidebar = () => {
  // Obtenemos el estado activo de la pestaña y si el sidebar está abierto
  const { activeTab, isSidebarOpen } = useAppContext();

  // *** DEBUG: Log para verificar si el estado cambia dentro del componente Sidebar ***
  useEffect(() => {
    console.log('Sidebar component - isSidebarOpen:', isSidebarOpen);
  }, [isSidebarOpen]);
  // ******************************************************************************


  // Array de elementos del menú para mejor mantenimiento
  const menuItems = [
    { icon: <LayoutGrid size={24} />, label: 'Dashboard', active: activeTab === 'dashboard' },
    { icon: <UtensilsCrossed size={24} />, label: 'Restaurante', active: activeTab === 'restaurante' },
    { icon: <ClipboardList size={24} />, label: 'Pedidos', active: activeTab === 'pedidos' },
    { icon: <Package size={24} />, label: 'Productos', active: activeTab === 'productos' },
    { icon: <Users size={24} />, label: 'Usuarios', active: activeTab === 'usuarios' },
    { icon: <Settings size={24} />, label: 'Configuración', active: activeTab === 'configuracion', isLast: true }
  ];

  // Definimos las clases base que siempre aplican
  // Quitamos la clase de fondo de debug
  const baseClasses = 'fixed lg:static top-0 left-0 h-full z-20 w-16 bg-indigo-900 text-white flex flex-col items-center py-6 space-y-8';

  // Determinamos la clase de animación personalizada para móvil (<lg)
  // Solo aplicamos la animación si estamos en un dispositivo móvil
  let animationClass = '';
  if (isMobileDevice()) {
    // Aplicamos la clase de animación slide-in o slide-out basada en isSidebarOpen
    animationClass = isSidebarOpen ? 'slide-in' : 'slide-out';
  }
  // Nota: No necesitamos lg:translate-x-0 aquí porque el posicionamiento lg:static
  // y la ausencia de clases de animación en desktop ya lo colocan correctamente.


  // Combinamos todas las clases
  const sidebarClasses = `${baseClasses} ${animationClass}`;


  return (
    <div
      className={sidebarClasses} // Usamos la cadena de clases construida
      // Agregamos un rol y aria-hidden para mejorar la accesibilidad cuando está oculto
      // Usamos la función isMobileDevice para determinar si está en móvil
      aria-hidden={!isSidebarOpen && isMobileDevice()}
      role="navigation"
    >
      {/* Logo */}
      <div className="p-2 rounded-lg bg-indigo-700 mx-auto">
        <LayoutGrid size={24} />
      </div>

      {/* Elementos del menú */}
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`
            p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer
            ${item.active ? 'bg-indigo-700' : ''}
            ${item.isLast ? 'mt-auto' : ''}
          `}
          title={item.label}
        >
          {React.cloneElement(item.icon, { size: 20 })}  {/* Hacemos los iconos un poco más pequeños */}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
