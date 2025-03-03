import React, { createContext, useContext, useState, useEffect } from 'react';
import useWooProducts from '../hooks/useWooProducts';
import useWooOrders from '../hooks/useWooOrders';

// Crear el contexto
const WooCommerceContext = createContext();

export const useWooCommerceContext = () => useContext(WooCommerceContext);

/**
 * Proveedor de contexto para la integración con WooCommerce
 * Centraliza el estado y la lógica relacionada con WooCommerce
 */
export const WooCommerceProvider = ({ children }) => {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncConfig, setSyncConfig] = useState({
    autoSync: false,
    syncInterval: 5, // minutos
    syncProducts: true,
    syncOrders: true,
    syncCategories: true
  });
  
  // Cambiar estado de mesa cuando cambia un pedido
  const handleTableStatusChange = (tableId, newStatus) => {
    // Implementar cambio de estado de mesa
    console.log(`Cambio estado mesa ${tableId} a ${newStatus}`);
    // Aquí se llamaría a la función correspondiente
  };
  
  // Hooks para productos y pedidos
  const productManager = useWooProducts();
  const orderManager = useWooOrders(handleTableStatusChange);
  
  // Activar/desactivar la sincronización
  const toggleSync = (enabled) => {
    setSyncEnabled(enabled !== undefined ? enabled : !syncEnabled);
  };
  
  // Realizar sincronización manual
  const performSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    
    try {
      const syncPromises = [];
      
      if (syncConfig.syncProducts) {
        syncPromises.push(productManager.loadProducts());
        syncPromises.push(productManager.loadCategories());
      }
      
      if (syncConfig.syncOrders) {
        syncPromises.push(orderManager.loadOrders());
      }
      
      await Promise.all(syncPromises);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error("Error durante la sincronización:", error);
    } finally {
      setSyncing(false);
    }
  };
  
  // Actualizar configuración de sincronización
  const updateSyncConfig = (newConfig) => {
    setSyncConfig({ ...syncConfig, ...newConfig });
  };
  
  // Configurar sincronización automática si está habilitada
  useEffect(() => {
    let intervalId;
    
    if (syncEnabled && syncConfig.autoSync) {
      intervalId = setInterval(() => {
        performSync();
      }, syncConfig.syncInterval * 60 * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [syncEnabled, syncConfig.autoSync, syncConfig.syncInterval]);
  
  // Realizar sincronización inicial si está habilitada
  useEffect(() => {
    if (syncEnabled) {
      performSync();
    }
  }, [syncEnabled]);
  
  // Convertir productos y categorías de WooCommerce al formato de la aplicación
  const mapProductsToAppFormat = () => {
    return productManager.products;
  };
  
  const mapCategoriesToAppFormat = () => {
    return productManager.categories;
  };
  
  const mapOrdersToAppFormat = () => {
    return orderManager.orders;
  };
  
  // Comprobar estado de conexión
  const checkConnection = async () => {
    try {
      // Realizar una consulta simple para comprobar la conexión
      await productManager.loadCategories({ per_page: 1 });
      return true;
    } catch (error) {
      console.error("Error de conexión con WooCommerce:", error);
      return false;
    }
  };
  
  const contextValue = {
    // Estado de sincronización
    syncEnabled,
    syncing,
    lastSyncTime,
    syncConfig,
    
    // Funciones de sincronización
    toggleSync,
    performSync,
    updateSyncConfig,
    checkConnection,
    
    // Datos convertidos al formato de la aplicación
    products: mapProductsToAppFormat(),
    categories: mapCategoriesToAppFormat(),
    orders: mapOrdersToAppFormat(),
    
    // Funciones de productos
    loadProducts: productManager.loadProducts,
    saveProduct: productManager.saveProduct,
    deleteProduct: productManager.deleteProduct,
    
    // Funciones de categorías
    loadCategories: productManager.loadCategories,
    saveCategory: productManager.saveCategory,
    deleteCategory: productManager.deleteCategory,
    
    // Funciones de pedidos
    loadOrders: orderManager.loadOrders,
    createOrder: orderManager.createOrder,
    updateOrder: orderManager.updateOrder,
    deleteOrder: orderManager.deleteOrder,
    updateItemStatus: orderManager.updateItemStatus,
    payOrder: orderManager.payOrder,
    getOrdersByTable: orderManager.getOrdersByTable,
    calculateTableTotal: orderManager.calculateTableTotal,
    
    // Estados
    productsLoading: productManager.loading,
    productsError: productManager.error,
    ordersLoading: orderManager.loading,
    ordersError: orderManager.error
  };
  
  return (
    <WooCommerceContext.Provider value={contextValue}>
      {children}
    </WooCommerceContext.Provider>
  );
};
