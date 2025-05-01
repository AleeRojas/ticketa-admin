import React from 'react';
import { AppProvider } from './context/AppContext';
import { WooCommerceProvider } from './context/WooCommerceContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AppTabs from './components/layout/AppTabs';
import TablesView from './components/tables/TablesView';
import SalonModal from './components/modals/SalonModal';
import TableModal from './components/modals/TableModal';
import OrderModal from './components/modals/OrderModal';
import TableContextMenu from './components/tables/TableContextMenu';
import ProductsView from './components/products/ProductsView';
import OrdersView from './components/orders/OrdersView';
import StatsView from './components/stats/StatsView';
import MarketingView from './components/marketing/MarketingView';
import WooSyncStatus from './components/woocommerce/WooSyncStatus';
import { useAppContext } from './context/AppContext';
import NetworkStatus from './components/common/NetworkStatus';
import ConflictResolutionModal from './components/modals/ConflictResolutionModal';

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
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <AppTabs />
      
      {/* Barra de estado de sincronización de WooCommerce */}
      <div className="px-3 md:px-6 pt-2 md:pt-4">
        <WooSyncStatus />
      </div>
      
      {/* Contenido principal basado en la pestaña seleccionada */}
      <div className="flex-1 p-3 md:p-6 overflow-auto">
        {activeTab === 'mesas' && <TablesView />}
        {activeTab === 'pedidos' && <OrdersView />}
        {activeTab === 'productos' && <ProductsView />}
        {activeTab === 'marketing' && <MarketingView />}
        {activeTab === 'estadisticas' && <StatsView />}
      </div>
      
      {/* Modales */}
      {showTableModal && <TableModal />}
      {showSalonModal && <SalonModal />}
      {showOrderModal && <OrderModal />}
      
      {/* Menú contextual */}
      {showContextMenu.visible && <TableContextMenu />}

      <NetworkStatus />
      <ConflictResolutionModal />
    </div>
  );
};

// Componente principal que envuelve todo en el proveedor de contexto
const App = () => {
  return (
    <WooCommerceProvider>
      <AppProvider>
        <div className="flex h-screen bg-gray-100 relative overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </AppProvider>
    </WooCommerceProvider>
  );
};

export default App;
