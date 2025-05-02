import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
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
import NetworkStatus from './components/common/NetworkStatus';
import ConflictResolutionModal from './components/modals/ConflictResolutionModal';

// Componente principal de la aplicación que maneja las vistas
const MainContent = () => {
  const {
    activeTab,
    showTableModal,
    showSalonModal,
    showOrderModal,
    showContextMenu,
    isSidebarOpen // Obtenemos el estado del sidebar
  } = useAppContext();

  return (
    // Ajustamos el margen izquierdo condicionalmente en pantallas pequeñas
    <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-16' : 'ml-0'} lg:ml-0`}> {/* Margen izquierdo condicional en <lg, siempre 0 en lg+ */}
      <Header />
      <AppTabs />

      {/* Barra de estado de sincronización de WooCommerce - solo visible en desktop
         En móvil la mostramos en el Header */}
      <div className="px-3 md:px-6 pt-2 md:pt-4 hidden md:block">
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
        {/* Eliminamos 'overflow-hidden' de este contenedor principal */}
        <div className="flex h-screen bg-gray-100 relative">
          <Sidebar /> {/* El Sidebar ahora maneja su propia visibilidad/posición en móvil */}
          <MainContent /> {/* El MainContent ajusta su margen para no superponer al Sidebar */}
        </div>
      </AppProvider>
    </WooCommerceProvider>
  );
};

export default App;
