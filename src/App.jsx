import React from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AppTabs from './components/layout/AppTabs';
import TablesView from './components/tables/TablesView';
import TableModal from './components/modals/TableModal';
import SalonModal from './components/modals/SalonModal'; // Añadir esta importación
import OrderModal from './components/modals/OrderModal';
import TableContextMenu from './components/tables/TableContextMenu';
import ProductsView from './components/products/ProductsView'; // Añadir esta importación
import OrdersView from './components/orders/OrdersView'; // Añadir esta importación
import { useAppContext } from './context/AppContext';

// Componente principal de la aplicación que maneja las vistas
const MainContent = () => {
  const { 
    activeTab, 
    showTableModal, 
    showSalonModal, 
    showOrderModal,
    showContextMenu
  } = useAppContext();

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <AppTabs />
      
      {/* Contenido principal basado en la pestaña seleccionada */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'mesas' && <TablesView />}
        {activeTab === 'pedidos' && <OrdersView />} {/* Reemplazar por el componente real */}
        {activeTab === 'productos' && <ProductsView />} {/* Reemplazar por el componente real */}
        {activeTab === 'estadisticas' && (
          <div className="bg-white rounded-lg shadow p-16 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Sección de Estadísticas</h3>
            <p className="text-gray-500">Esta funcionalidad se implementará en la siguiente fase</p>
          </div>
        )}
      </div>
      
      {/* Modales */}
      {showTableModal && <TableModal />}
      {showSalonModal && <SalonModal />}
      {showOrderModal && <OrderModal />}
      
      {/* Menú contextual */}
      {showContextMenu.visible && <TableContextMenu />}
    </div>
  );
};

// Componente principal que envuelve todo en el proveedor de contexto
const App = () => {
  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
};

export default App;