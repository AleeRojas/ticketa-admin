import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTables } from '../data/initialTables';
import { initialOrders } from '../data/initialOrders';
import { initialSalons } from '../data/initialSalons';
import { initialProducts, productCategories } from '../data/products';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';
import useTableManagement from '../hooks/useTableManagement';
import useOrderManagement from '../hooks/useOrderManagement';
import useProductManagement from '../hooks/useProductManagement';

// Crear el contexto
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Estados principales para UI
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
  
  // Hooks de gestión
  const tableManagement = useTableManagement(initialTables);
  const { tables, setTables } = tableManagement;
  
  const handleTableStatusChange = (tableId, newStatus) => {
    tableManagement.changeTableStatus(tableId, newStatus);
  };
  
  const orderManagement = useOrderManagement(initialOrders, handleTableStatusChange);
  const { orders, setOrders } = orderManagement;
  
  const productManagement = useProductManagement(initialProducts);
  const { products, setProducts, categories, setCategories } = productManagement;
  
  // Integración con la simulación de tiempo real
  const { lastUpdate, isUpdating } = useRealTimeUpdates(tables, setTables);
  
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
    salones: initialSalons,
    products,
    productCategories,
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
    
    // Operaciones de mesas
    ...tableManagement,
    
    // Operaciones de pedidos
    ...orderManagement,
    
    // Operaciones de productos
    ...productManagement,
    
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
