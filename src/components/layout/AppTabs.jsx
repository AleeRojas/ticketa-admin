import React from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente de pestañas principales de navegación (con Marketing añadido)
 */
const AppTabs = () => {
  const { activeTab, setActiveTab } = useAppContext();
  
  // Array de pestañas disponibles
  const tabs = [
    { id: 'mesas', label: 'Mesas' },
    { id: 'pedidos', label: 'Pedidos' },
    { id: 'productos', label: 'Productos' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'estadisticas', label: 'Estadísticas' }
  ];

  return (
    <div className="bg-white border-b">
      <div className="flex space-x-1 px-4">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === tab.id 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppTabs;