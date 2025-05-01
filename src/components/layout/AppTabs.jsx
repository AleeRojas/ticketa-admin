import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente de pestañas principales de navegación adaptado para móviles
 */
const AppTabs = () => {
  const { activeTab, setActiveTab } = useAppContext();
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const tabsContainerRef = useRef(null);
  
  // Array de pestañas disponibles
  const tabs = [
    { id: 'mesas', label: 'Mesas' },
    { id: 'pedidos', label: 'Pedidos' },
    { id: 'productos', label: 'Productos' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'estadisticas', label: 'Estadísticas' }
  ];

  // Función para detectar si se necesitan botones de desplazamiento
  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const { scrollWidth, clientWidth } = tabsContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    // Verificar al cargar y en resize
    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Funciones para desplazar las pestañas
  const scrollLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  // Función para mantener visible la pestaña activa
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTabElement = tabsContainerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      
      if (activeTabElement) {
        // Calcular la posición del elemento en el scroll
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const tabRect = activeTabElement.getBoundingClientRect();
        
        // Si el elemento está fuera de la vista, scrollear hacia él
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          activeTabElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      }
    }
  }, [activeTab]);

  return (
    <div className="bg-white border-b relative">
      <div className="flex items-center">
        {/* Botón de desplazamiento izquierdo */}
        {showScrollButtons && (
          <button 
            onClick={scrollLeft}
            className="absolute left-0 z-10 bg-white bg-opacity-90 h-full px-1 flex items-center justify-center shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        {/* Contenedor de pestañas con scroll horizontal */}
        <div 
          ref={tabsContainerRef}
          className="flex space-x-1 px-2 md:px-4 overflow-x-auto scrollbar-none scroll-smooth py-1 w-full mx-0 md:mx-6 mobile-touch-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map(tab => (
            <button 
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 ${ 
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Botón de desplazamiento derecho */}
        {showScrollButtons && (
          <button 
            onClick={scrollRight}
            className="absolute right-0 z-10 bg-white bg-opacity-90 h-full px-1 flex items-center justify-center shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AppTabs;
