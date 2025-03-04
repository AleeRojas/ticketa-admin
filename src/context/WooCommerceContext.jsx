// WooCommerceContext.jsx (Con persistencia y detección online/offline)

import React, { createContext, useContext, useState, useEffect } from 'react';
import useWooProducts from '../hooks/useWooProducts';
import useWooOrders from '../hooks/useWooOrders';

// Nombres de las claves para localStorage
const LOCAL_STORAGE_KEYS = {
  SYNC_ENABLED: 'woo_sync_enabled',
  SYNC_CONFIG: 'woo_sync_config',
  LAST_SYNC: 'woo_last_sync',
  PENDING_OPERATIONS: 'woo_pending_operations',
};

// Crear el contexto
const WooCommerceContext = createContext();

export const useWooCommerceContext = () => useContext(WooCommerceContext);

/**
 * Proveedor de contexto para la integración con WooCommerce
 * Centraliza el estado y la lógica relacionada con WooCommerce
 */
export const WooCommerceProvider = ({ children }) => {
  // Estado de conexión
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Cargar configuración desde localStorage
  const [syncEnabled, setSyncEnabled] = useState(() => {
    try {
      const storedEnabled = localStorage.getItem(LOCAL_STORAGE_KEYS.SYNC_ENABLED);
      return storedEnabled ? JSON.parse(storedEnabled) : false;
    } catch (error) {
      console.error('Error loading sync enabled state from localStorage:', error);
      return false;
    }
  });
  
  const [syncConfig, setSyncConfig] = useState(() => {
    try {
      const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEYS.SYNC_CONFIG);
      return storedConfig ? JSON.parse(storedConfig) : {
        autoSync: false,
        syncInterval: 5, // minutos
        syncProducts: true,
        syncOrders: true,
        syncCategories: true
      };
    } catch (error) {
      console.error('Error loading sync config from localStorage:', error);
      return {
        autoSync: false,
        syncInterval: 5,
        syncProducts: true,
        syncOrders: true,
        syncCategories: true
      };
    }
  });
  
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    try {
      const storedTime = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SYNC);
      return storedTime ? new Date(storedTime) : null;
    } catch (error) {
      console.error('Error loading last sync time from localStorage:', error);
      return null;
    }
  });
  
  const [syncing, setSyncing] = useState(false);
  
  // Cola de operaciones pendientes
  const [pendingOperations, setPendingOperations] = useState(() => {
    try {
      const storedOperations = localStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_OPERATIONS);
      return storedOperations ? JSON.parse(storedOperations) : [];
    } catch (error) {
      console.error('Error loading pending operations from localStorage:', error);
      return [];
    }
  });
  
  // Conflictos de sincronización
  const [conflicts, setConflicts] = useState([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  
  // Cambiar estado de mesa cuando cambia un pedido
  const handleTableStatusChange = (tableId, newStatus) => {
    // Implementar cambio de estado de mesa
    console.log(`Cambio estado mesa ${tableId} a ${newStatus}`);
    // Aquí se llamaría a la función correspondiente
  };
  
  // Hooks para productos y pedidos
  const productManager = useWooProducts();
  const orderManager = useWooOrders(handleTableStatusChange);
  
  // Detectar estado de conexión a Internet
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Intentar sincronizar cuando vuelve la conexión
      if (syncEnabled && !syncing && pendingOperations.length > 0) {
        processPendingOperations();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncEnabled, syncing, pendingOperations]);
  
  // Persistir cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SYNC_ENABLED, JSON.stringify(syncEnabled));
    } catch (error) {
      console.error('Error saving sync enabled state to localStorage:', error);
    }
  }, [syncEnabled]);
  
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SYNC_CONFIG, JSON.stringify(syncConfig));
    } catch (error) {
      console.error('Error saving sync config to localStorage:', error);
    }
  }, [syncConfig]);
  
  useEffect(() => {
    if (lastSyncTime) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNC, lastSyncTime.toISOString());
      } catch (error) {
        console.error('Error saving last sync time to localStorage:', error);
      }
    }
  }, [lastSyncTime]);
  
  // Persistir operaciones pendientes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_OPERATIONS, JSON.stringify(pendingOperations));
    } catch (error) {
      console.error('Error saving pending operations to localStorage:', error);
    }
  }, [pendingOperations]);
  
  // Añadir operación a la cola para cuando vuelva la conexión
  const queueOperation = (operationType, entityType, data) => {
    console.log(`Queuing operation: ${operationType} ${entityType}`, data);
    setPendingOperations([...pendingOperations, {
      id: Date.now(), // ID único para la operación
      type: operationType, // 'create', 'update', 'delete'
      entity: entityType, // 'product', 'order', 'category'
      data: data,
      timestamp: new Date().toISOString()
    }]);
  };
  
  // Procesar operaciones pendientes cuando vuelve la conexión
  const processPendingOperations = async () => {
    if (!isOnline || !syncEnabled || pendingOperations.length === 0 || syncing) {
      return;
    }
    
    console.log('Processing pending operations:', pendingOperations);
    setSyncing(true);
    
    const failedOperations = [];
    
    for (const operation of pendingOperations) {
      try {
        switch (operation.entity) {
          case 'product':
            if (operation.type === 'create' || operation.type === 'update') {
              await productManager.saveProduct(operation.data);
            } else if (operation.type === 'delete') {
              await productManager.deleteProduct(operation.data.id);
            }
            break;
          case 'category':
            if (operation.type === 'create' || operation.type === 'update') {
              await productManager.saveCategory(operation.data);
            } else if (operation.type === 'delete') {
              await productManager.deleteCategory(operation.data.id);
            }
            break;
          case 'order':
            if (operation.type === 'create') {
              await orderManager.createOrder(operation.data);
            } else if (operation.type === 'update') {
              await orderManager.updateOrder(operation.data.id, operation.data);
            } else if (operation.type === 'delete') {
              await orderManager.deleteOrder(operation.data.id);
            }
            break;
          default:
            console.warn('Unknown entity type:', operation.entity);
        }
        console.log(`Operation processed successfully: ${operation.type} ${operation.entity}`);
      } catch (error) {
        console.error(`Failed to process operation: ${operation.type} ${operation.entity}`, error);
        failedOperations.push(operation);
      }
    }
    
    // Actualizar cola con las operaciones fallidas
    setPendingOperations(failedOperations);
    setSyncing(false);
    
    if (failedOperations.length === 0) {
      // Todas las operaciones procesadas exitosamente
      setLastSyncTime(new Date());
    }
  };
  
  // Buscar diferencias entre objetos (para resolución de conflictos)
  const findDifferences = (localObj, remoteObj) => {
    const differences = {};
    
    // Claves a ignorar en la comparación (ej. timestamps, ids internos)
    const ignoreKeys = ['updatedAt', 'date_modified', 'date_created'];
    
    // Comparar local con remoto
    Object.keys(localObj).forEach(key => {
      if (ignoreKeys.includes(key)) return;
      
      // Buscar clave remota que coincida (maneja camelCase vs snake_case)
      const remoteKey = Object.keys(remoteObj).find(
        k => k.toLowerCase() === key.toLowerCase() ||
        k.toLowerCase() === key.replace(/([A-Z])/g, "_$1").toLowerCase()
      );
      
      if (remoteKey && JSON.stringify(localObj[key]) !== JSON.stringify(remoteObj[remoteKey])) {
        differences[key] = {
          local: localObj[key],
          remote: remoteObj[remoteKey]
        };
      }
    });
    
    return differences;
  };
  
  // Resolver conflictos de sincronización
  const resolveConflicts = (resolutions) => {
    resolutions.forEach(async resolution => {
      const conflict = conflicts.find(c => 
        c.id === resolution.id && c.entityType === resolution.entityType
      );
      
      if (!conflict) return;
      
      if (resolution.useLocal) {
        // Mantener versión local, actualizar remota
        switch (resolution.entityType) {
          case 'product':
            if (conflict.localData) {
              await productManager.saveProduct(conflict.localData);
            } else {
              // Los datos locales no existen, eliminar del remoto
              await productManager.deleteProduct(conflict.id);
            }
            break;
          case 'category':
            if (conflict.localData) {
              await productManager.saveCategory(conflict.localData);
            } else {
              await productManager.deleteCategory(conflict.id);
            }
            break;
          case 'order':
            if (conflict.localData) {
              await orderManager.updateOrder(conflict.id, conflict.localData);
            } else {
              await orderManager.deleteOrder(conflict.id);
            }
            break;
        }
      } else {
        // Usar versión remota, actualizar local
        // Esta lógica se implementaría a nivel de aplicación
        // para actualizar los estados locales
      }
    });
    
    // Limpiar conflictos
    setConflicts([]);
    
    // Actualizar última sincronización
    setLastSyncTime(new Date());
  };
  
  // Activar/desactivar la sincronización
  const toggleSync = (enabled) => {
    setSyncEnabled(enabled !== undefined ? enabled : !syncEnabled);
  };
  
  // Realizar sincronización manual
  const performSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    
    try {
      const detectedConflicts = [];
      
      // Sincronización de operaciones pendientes primero
      if (pendingOperations.length > 0) {
        await processPendingOperations();
      }
      
      const syncPromises = [];
      
      // Sincronizar productos
      if (syncConfig.syncProducts) {
        try {
          const remoteProducts = await productManager.loadProducts();
          syncPromises.push(Promise.resolve(remoteProducts));
          
          // Detectar conflictos (implementación futura)
          // Aquí iría código para detectar conflictos entre
          // productos locales y remotos
        } catch (error) {
          console.error("Error cargando productos:", error);
        }
      }
      
      if (syncConfig.syncCategories) {
        try {
          const remoteCategories = await productManager.loadCategories();
          syncPromises.push(Promise.resolve(remoteCategories));
          
          // Detectar conflictos de categorías (implementación futura)
        } catch (error) {
          console.error("Error cargando categorías:", error);
        }
      }
      
      if (syncConfig.syncOrders) {
        try {
          const remoteOrders = await orderManager.loadOrders();
          syncPromises.push(Promise.resolve(remoteOrders));
          
          // Detectar conflictos de pedidos (implementación futura)
        } catch (error) {
          console.error("Error cargando pedidos:", error);
        }
      }
      
      await Promise.allSettled(syncPromises);
      
      // Mostrar modal de resolución si hay conflictos
      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);
        setShowConflictModal(true);
      } else {
        setLastSyncTime(new Date());
      }
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
        if (isOnline) {
          performSync();
        }
      }, syncConfig.syncInterval * 60 * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [syncEnabled, syncConfig.autoSync, syncConfig.syncInterval, isOnline]);
  
  // Realizar sincronización inicial si está habilitada
  useEffect(() => {
    if (syncEnabled && isOnline) {
      performSync();
    }
  }, [syncEnabled]);
  
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
  
  // Procesar operaciones pendientes cuando se restablece la conexión
  useEffect(() => {
    if (isOnline && syncEnabled && pendingOperations.length > 0 && !syncing) {
      processPendingOperations();
    }
  }, [isOnline]);
  
  const contextValue = {
    // Estado de sincronización
    syncEnabled,
    syncing,
    lastSyncTime,
    syncConfig,
    isOnline,
    pendingOperations,
    
    // Funciones de sincronización
    toggleSync,
    performSync,
    updateSyncConfig,
    checkConnection,
    queueOperation,
    
    // Gestión de conflictos
    conflicts,
    showConflictModal,
    setShowConflictModal,
    resolveConflicts,
    
    // Datos de WooCommerce
    products: productManager.products,
    categories: productManager.categories,
    orders: orderManager.orders,
    
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

export default WooCommerceProvider;