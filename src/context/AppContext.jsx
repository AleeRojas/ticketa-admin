import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTables } from '../data/initialTables';
import { initialOrders } from '../data/initialOrders';
import { initialSalons } from '../data/initialSalons';
import { initialProducts, productCategories } from '../data/products';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';
import { useWooCommerceContext } from './WooCommerceContext';

// Nombres de las claves para localStorage
const LOCAL_STORAGE_KEYS = {
  TABLES: 'restaurant_tables',
  ORDERS: 'restaurant_orders',
  SALONS: 'restaurant_salons',
  PRODUCTS: 'restaurant_products',
  CATEGORIES: 'restaurant_categories',
  LAST_SYNC: 'restaurant_last_sync'
};

// Crear el contexto
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Integración con WooCommerce
  const { 
    products: wooProducts, 
    categories: wooCategories,
    orders: wooOrders,
    syncEnabled,
    lastSyncTime: wooLastSyncTime
  } = useWooCommerceContext();

  // Estados principales
  const [tables, setTables] = useState(() => {
    try {
      const storedTables = localStorage.getItem(LOCAL_STORAGE_KEYS.TABLES);
      return storedTables ? JSON.parse(storedTables) : initialTables;
    } catch (error) {
      console.error('Error loading tables from localStorage:', error);
      return initialTables;
    }
  });
  
  const [orders, setOrders] = useState(() => {
    try {
      const storedOrders = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return storedOrders ? JSON.parse(storedOrders) : initialOrders;
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
      return initialOrders;
    }
  });
  
  const [salones, setSalones] = useState(() => {
    try {
      const storedSalons = localStorage.getItem(LOCAL_STORAGE_KEYS.SALONS);
      return storedSalons ? JSON.parse(storedSalons) : initialSalons;
    } catch (error) {
      console.error('Error loading salons from localStorage:', error);
      return initialSalons;
    }
  });
  
  const [products, setProducts] = useState(() => {
    try {
      const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return storedProducts ? JSON.parse(storedProducts) : initialProducts;
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return initialProducts;
    }
  });
  
  const [categories, setCategories] = useState(() => {
    try {
      const storedCategories = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
      return storedCategories ? JSON.parse(storedCategories) : productCategories;
    } catch (error) {
      console.error('Error loading categories from localStorage:', error);
      return productCategories;
    }
  });
  
  // Estados de UI
  const [activeTab, setActiveTab] = useState('mesas');
  const [activeSalon, setActiveSalon] = useState('principal');
  const [viewMode, setViewMode] = useState('salon');
  const [viewType, setViewType] = useState('visual');
  
  // Estados de modales
  const [showTableModal, setShowTableModal] = useState(false);
  const [showSalonModal, setShowSalonModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [editingSalon, setEditingSalon] = useState(null);
  const [activeOrderTable, setActiveOrderTable] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Menú contextual
  const [showContextMenu, setShowContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    table: null
  });
  
  // Menú de salones
  const [showSalonMenu, setShowSalonMenu] = useState(false);
  
  // Integración con la simulación de tiempo real
  const { lastUpdate, isUpdating } = useRealTimeUpdates(tables, setTables);
  
  // Sincronización con localStorage
  // Guardar tablas en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TABLES, JSON.stringify(tables));
    } catch (error) {
      console.error('Error saving tables to localStorage:', error);
    }
  }, [tables]);
  
  // Guardar pedidos en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders]);
  
  // Guardar salones en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SALONS, JSON.stringify(salones));
    } catch (error) {
      console.error('Error saving salons to localStorage:', error);
    }
  }, [salones]);
  
  // Guardar productos en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }, [products]);
  
  // Guardar categorías en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories to localStorage:', error);
    }
  }, [categories]);
  
  // Sincronización con WooCommerce
  // Sincronizar productos desde WooCommerce si la sincronización está activada
  useEffect(() => {
    if (syncEnabled && wooProducts && wooProducts.length > 0) {
      console.log('Synchronizing products from WooCommerce');
      setProducts(wooProducts);
      
      // Guardar última sincronización
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNC, wooLastSyncTime ? wooLastSyncTime.toISOString() : new Date().toISOString());
      } catch (error) {
        console.error('Error saving last sync time to localStorage:', error);
      }
    }
  }, [wooProducts, syncEnabled, wooLastSyncTime]);
  
  // Sincronizar categorías desde WooCommerce si la sincronización está activada
  useEffect(() => {
    if (syncEnabled && wooCategories && wooCategories.length > 0) {
      console.log('Synchronizing categories from WooCommerce');
      setCategories(wooCategories);
    }
  }, [wooCategories, syncEnabled]);
  
  // Sincronizar pedidos desde WooCommerce si la sincronización está activada
  useEffect(() => {
    if (syncEnabled && wooOrders && wooOrders.length > 0) {
      console.log('Synchronizing orders from WooCommerce');
      setOrders(wooOrders);
    }
  }, [wooOrders, syncEnabled]);
  
  // Filtrar mesas por salón activo
  const filteredTables = tables.filter(table => table.salon === activeSalon);
  
  // Helper function to get orders for a specific table
  const getTableOrders = (tableId) => {
    return orders.filter(order => order.tableId === tableId);
  };
  
  // Helper function to calculate total for a table
  const getTableTotal = (tableId) => {
    const tableOrders = getTableOrders(tableId);
    return tableOrders.reduce((total, order) => {
      return total + order.items.reduce((itemTotal, item) => itemTotal + (item.price * item.quantity), 0);
    }, 0);
  };
  
  // Estadísticas para el salón activo
  const salonStats = {
    total: filteredTables.length,
    occupied: filteredTables.filter(t => t.status === 'ocupada').length,
    free: filteredTables.filter(t => t.status === 'libre').length,
    paying: filteredTables.filter(t => t.status === 'pagando').length,
    reserved: filteredTables.filter(t => t.status === 'reservada').length,
    totalRevenue: filteredTables.reduce((sum, table) => sum + getTableTotal(table.id), 0),
    totalOrders: orders.filter(order => 
      filteredTables.some(table => table.id === order.tableId)
    ).length
  };
  
  // Manejador de salvar mesa
  const handleSaveTable = (tableData) => {
    if (editingTable) {
      // Update existing table
      setTables(tables.map(table => 
        table.id === editingTable.id ? { ...tableData, id: table.id } : table
      ));
    } else {
      // Add new table
      const newId = Math.max(...tables.map(t => t.id), 0) + 1;
      setTables([...tables, { ...tableData, id: newId }]);
    }
    setShowTableModal(false);
    setEditingTable(null);
  };
  
  // Manejador de borrar mesa
  const handleDeleteTable = (tableId) => {
    setTables(tables.filter(table => table.id !== tableId));
    setShowTableModal(false);
    setEditingTable(null);
  };
  
  // Manejador de salvar salón
  const handleSaveSalon = (salonData) => {
    if (editingSalon) {
      // Update existing salon
      setSalones(salones.map(salon => 
        salon.id === editingSalon.id ? { ...salonData, id: salon.id } : salon
      ));
      
      // If the active salon was edited, update it
      if (activeSalon === editingSalon.id) {
        setActiveSalon(salonData.id);
      }
    } else {
      // Add new salon
      setSalones([...salones, salonData]);
    }
    setShowSalonModal(false);
    setEditingSalon(null);
  };
  
  // Manejador de borrar salón
  const handleDeleteSalon = (salonId) => {
    // Check if there are tables in this salon
    const tablesInSalon = tables.some(table => table.salon === salonId);
    
    if (tablesInSalon) {
      alert('No se puede eliminar un salón que contiene mesas. Mueva las mesas a otro salón primero.');
      return;
    }
    
    setSalones(salones.filter(salon => salon.id !== salonId));
    
    // If the active salon was deleted, switch to the first available salon
    if (activeSalon === salonId && salones.length > 1) {
      const newActiveSalon = salones.find(s => s.id !== salonId)?.id;
      if (newActiveSalon) setActiveSalon(newActiveSalon);
    }
    
    setShowSalonModal(false);
    setEditingSalon(null);
  };
  
  // Manejador de guardar producto
  const handleSaveProduct = (productData) => {
    if (productData.id) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === productData.id ? productData : product
      ));
    } else {
      // Add new product
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, { ...productData, id: newId }]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };
  
  // Manejador de borrar producto
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
    setShowProductModal(false);
    setEditingProduct(null);
  };
  
  // Manejador de guardar categoría
  const handleSaveCategory = (categoryData) => {
    if (categories.some(c => c.id === categoryData.id)) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === categoryData.id ? categoryData : category
      ));
    } else {
      // Add new category
      setCategories([...categories, categoryData]);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };
  
  // Manejador de borrar categoría
  const handleDeleteCategory = (categoryId) => {
    // Check if there are products in this category
    const productsInCategory = products.some(product => product.category === categoryId);
    
    if (productsInCategory) {
      alert('No se puede eliminar una categoría que contiene productos. Cambie la categoría de los productos primero.');
      return;
    }
    
    setCategories(categories.filter(category => category.id !== categoryId));
    setShowCategoryModal(false);
    setEditingCategory(null);
  };
  
  // Manejador de guardar pedido
  const handleSaveOrder = (newOrder, existingOrderId) => {
    if (existingOrderId) {
      // Update existing order
      setOrders(orders.map(order => 
        order.id === existingOrderId ? newOrder : order
      ));
    } else {
      // Add new order
      const newId = Math.max(...orders.map(o => o.id), 0) + 1;
      setOrders([...orders, { ...newOrder, id: newId }]);
      
      // Update table status if it was libre
      if (activeOrderTable?.status === 'libre') {
        setTables(tables.map(table => 
          table.id === activeOrderTable.id ? { ...table, status: 'ocupada', time: '00:01' } : table
        ));
      }
    }
  };
  
  // Manejador de borrar pedido
  const handleDeleteOrder = (orderId) => {
    // Get the table ID before removing the order
    const orderToDelete = orders.find(order => order.id === orderId);
    const tableId = orderToDelete?.tableId;
    
    setOrders(orders.filter(order => order.id !== orderId));
    
    // If no orders left for this table, update status if not reserved
    if (tableId) {
      const remainingOrders = orders.filter(order => order.tableId === tableId && order.id !== orderId);
      
      if (remainingOrders.length === 0) {
        const tableToUpdate = tables.find(table => table.id === tableId);
        
        if (tableToUpdate && tableToUpdate.status !== 'reservada') {
          setTables(tables.map(table => 
            table.id === tableId ? { ...table, status: 'libre', time: '00:00' } : table
          ));
        }
      }
    }
  };
  
  // Manejador de marcar pedido como pagado
  const handlePayOrder = (orderId) => {
    // Get the order and table ID
    const orderToPay = orders.find(order => order.id === orderId);
    const tableId = orderToPay?.tableId;
    
    // Mark order as paid
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'pagado' } : order
    ));
    
    // Update table status if all orders are paid
    if (tableId) {
      const tableOrders = orders.filter(order => order.tableId === tableId);
      const allPaid = tableOrders.length === 1 || 
                     tableOrders.every(order => order.id === orderId || order.status === 'pagado');
      
      if (allPaid) {
        setTables(tables.map(table => 
          table.id === tableId ? { ...table, status: 'pagando' } : table
        ));
      }
    }
  };
  
  // Cerrar el menú contextual al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu.visible) {
        setShowContextMenu(prev => ({ ...prev, visible: false }));
      }
    };
    
    window.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showContextMenu.visible]);

  const contextValue = {
    // Estados
    tables,
    orders,
    salones,
    products,
    categories,
    activeTab,
    activeSalon,
    viewMode,
    viewType,
    showTableModal,
    showSalonModal,
    showOrderModal,
    showProductModal,
    showCategoryModal,
    editingTable,
    editingSalon,
    activeOrderTable,
    editingProduct,
    editingCategory,
    showContextMenu,
    showSalonMenu,
    lastUpdate,
    isUpdating,
    filteredTables,
    salonStats,
    
    // Setters
    setTables,
    setOrders,
    setSalones,
    setProducts,
    setCategories,
    setActiveTab,
    setActiveSalon,
    setViewMode,
    setViewType,
    setShowTableModal,
    setShowSalonModal,
    setShowOrderModal,
    setShowProductModal,
    setShowCategoryModal,
    setEditingTable,
    setEditingSalon,
    setActiveOrderTable,
    setEditingProduct,
    setEditingCategory,
    setShowContextMenu,
    setShowSalonMenu,
    
    // Handlers
    handleSaveTable,
    handleDeleteTable,
    handleSaveSalon,
    handleDeleteSalon,
    handleSaveProduct,
    handleDeleteProduct,
    handleSaveCategory,
    handleDeleteCategory,
    handleSaveOrder,
    handleDeleteOrder,
    handlePayOrder,
    
    // Utility functions
    getTableOrders,
    getTableTotal,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
