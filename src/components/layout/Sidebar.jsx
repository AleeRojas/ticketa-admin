import React from 'react';
import { 
  LayoutGrid,
  UtensilsCrossed, 
  ClipboardList, 
  Package, 
  Users, 
  Settings
} from 'lucide-react';

/**
 * Componente de barra lateral de navegación
 */
const Sidebar = () => {
  return (
    <div className="w-16 bg-indigo-900 text-white flex flex-col items-center py-6 space-y-8">
      <div className="p-2 rounded-lg bg-indigo-700">
        <LayoutGrid size={24} />
      </div>
      <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
        <UtensilsCrossed size={24} />
      </div>
      <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
        <ClipboardList size={24} />
      </div>
      <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
        <Package size={24} />
      </div>
      <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
        <Users size={24} />
      </div>
      <div className="mt-auto p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
        <Settings size={24} />
      </div>
    </div>
  );
};

export default Sidebar;
