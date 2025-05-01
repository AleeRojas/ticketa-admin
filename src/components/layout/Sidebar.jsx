import React from 'react';
import { 
  LayoutGrid,
  UtensilsCrossed, 
  ClipboardList, 
  Package, 
  Users, 
  Settings
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente de barra lateral de navegación siempre visible
 */
const Sidebar = () => {
  const { activeTab } = useAppContext();

  // Array de elementos del menú para mejor mantenimiento
  const menuItems = [
    { icon: <LayoutGrid size={24} />, label: 'Dashboard', active: activeTab === 'dashboard' },
    { icon: <UtensilsCrossed size={24} />, label: 'Restaurante', active: activeTab === 'restaurante' },
    { icon: <ClipboardList size={24} />, label: 'Pedidos', active: activeTab === 'pedidos' },
    { icon: <Package size={24} />, label: 'Productos', active: activeTab === 'productos' },
    { icon: <Users size={24} />, label: 'Usuarios', active: activeTab === 'usuarios' },
    { icon: <Settings size={24} />, label: 'Configuración', active: activeTab === 'configuracion', isLast: true }
  ];

  return (
    <div 
      className="fixed lg:static top-0 left-0 h-full z-20
      w-16 bg-indigo-900 text-white flex flex-col items-center py-6 space-y-8"
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