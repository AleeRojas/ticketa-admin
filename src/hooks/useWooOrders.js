import { useState, useEffect } from 'react';
import woocommerceService from '../services/woocommerceService';
import { appToWooOrder, wooToAppOrder } from '../utils/orderAdapter';

/**
 * Custom hook para manejar órdenes de WooCommerce
 * @param {Function} onTableStatusChange - Callback para cuando cambia el estado de una mesa
 * @returns {Object} - Funciones y estado para manejar órdenes
 */
const useWooOrders = (onTableStatusChange) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10
  });
  
  /**
   * Cargar órdenes desde WooCommerce
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Object>} - Órdenes convertidas al formato de la aplicación y datos de paginación
   */
  const loadOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Establecer valores por defecto para paginación
      const queryParams = {
        page: params.page || pagination.currentPage,
        per_page: params.per_page || pagination.perPage,
        ...params
      };
      
      const response = await woocommerceService.orders.getOrders(queryParams);
      
      // Convertir órdenes al formato de la aplicación
      const appOrders = response.data.map(wooToAppOrder);
      
      // Actualizar estado con las órdenes
      setOrders(appOrders);
      
      // Actualizar información de paginación
      const updatedPagination = {
        currentPage: parseInt(queryParams.page),
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
        perPage: parseInt(queryParams.per_page)
      };
      
      setPagination(updatedPagination);
      
      return {
        orders: appOrders,
        pagination: updatedPagination
      };
    } catch (error) {
      console.error('Error loading orders from WooCommerce:', error);
      setError(error.message || 'Error loading orders');
      return { 
        orders: [], 
        pagination: pagination 
      };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Crear una nueva orden en WooCommerce
   * @param {Object} orderData - Datos de la orden en formato de la aplicación
   * @returns {Promise<Object>} - Orden creada en formato de la aplicación
   */
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convertir al formato WooCommerce
      const wooOrderData = appToWooOrder(orderData);
      
      // Enviar a WooCommerce
      const createdWooOrder = await woocommerceService.orders.createOrder(wooOrderData);
      
      // Convertir la respuesta al formato de la aplicación
      const createdAppOrder = wooToAppOrder(createdWooOrder);
      
      // Actualizar estado local
      setOrders(prev => [...prev, createdAppOrder]);
      
      return createdAppOrder;
    } catch (error) {
      console.error('Error creating order in WooCommerce:', error);
      setError(error.message || 'Error creating order');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Actualizar una orden existente en WooCommerce
   * @param {number} orderId - ID de la orden
   * @param {Object} orderData - Datos actualizados en formato de la aplicación
   * @returns {Promise<Object>} - Orden actualizada en formato de la aplicación
   */
  const updateOrder = async (orderId, orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convertir al formato WooCommerce
      const wooOrderData = appToWooOrder({ ...orderData, id: orderId });
      
      // Enviar a WooCommerce
      const updatedWooOrder = await woocommerceService.orders.updateOrder(orderId, wooOrderData);
      
      // Convertir la respuesta al formato de la aplicación
      const updatedAppOrder = wooToAppOrder(updatedWooOrder);
      
      // Actualizar estado local
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedAppOrder : order
      ));
      
      return updatedAppOrder;
    } catch (error) {
      console.error('Error updating order in WooCommerce:', error);
      setError(error.message || 'Error updating order');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Eliminar una orden de WooCommerce
   * @param {number} orderId - ID de la orden
   * @returns {Promise<boolean>} - Éxito de la operación
   */
  const deleteOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Enviar a WooCommerce
      await woocommerceService.orders.deleteOrder(orderId);
      
      // Actualizar estado local
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      return true;
    } catch (error) {
      console.error('Error deleting order from WooCommerce:', error);
      setError(error.message || 'Error deleting order');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Actualizar el estado de un ítem en una orden
   * @param {number} orderId - ID de la orden
   * @param {number} itemIndex - Índice del ítem en la orden
   * @param {string} newStatus - Nuevo estado
   * @returns {Promise<Object>} - Orden actualizada
   */
  const updateItemStatus = async (orderId, itemIndex, newStatus) => {
    // Buscar la orden
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    // Actualizar el estado del ítem
    const updatedItems = order.items.map((item, idx) => 
      idx === itemIndex ? { ...item, status: newStatus } : item
    );
    
    // Crear una nueva orden con los ítems actualizados
    const updatedOrder = {
      ...order,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };
    
    // Actualizar en WooCommerce
    return updateOrder(orderId, updatedOrder);
  };
  
  /**
   * Marcar una orden como pagada
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} - Orden actualizada
   */
  const payOrder = async (orderId) => {
    // Buscar la orden
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    // Actualizar estado a pagado
    const updatedOrder = {
      ...order,
      status: 'pagado',
      updatedAt: new Date().toISOString()
    };
    
    // Si hay un callback, notificar cambio de estado de mesa
    if (onTableStatusChange && order.tableId) {
      onTableStatusChange(order.tableId, 'pagando');
    }
    
    // Actualizar en WooCommerce
    return updateOrder(orderId, updatedOrder);
  };
  
  /**
   * Obtener órdenes por ID de mesa
   * @param {number} tableId - ID de la mesa
   * @returns {Array} - Órdenes de la mesa
   */
  const getOrdersByTable = (tableId) => {
    return orders.filter(order => order.tableId === tableId);
  };
  
  /**
   * Calcular total para una mesa específica
   * @param {number} tableId - ID de la mesa
   * @returns {number} - Total en euros
   */
  const calculateTableTotal = (tableId) => {
    const tableOrders = getOrdersByTable(tableId);
    
    return tableOrders.reduce((total, order) => {
      return total + order.items.reduce((itemsTotal, item) => {
        return itemsTotal + (item.price * item.quantity);
      }, 0);
    }, 0);
  };
  
  /**
   * Cambiar de página en la paginación
   * @param {number} page - Número de página
   * @param {Object} filters - Filtros adicionales
   */
  const changePage = async (page, filters = {}) => {
    return loadOrders({
      page,
      per_page: pagination.perPage,
      ...filters
    });
  };
  
  /**
   * Cambiar cantidad de items por página
   * @param {number} perPage - Items por página
   * @param {Object} filters - Filtros adicionales
   */
  const changePerPage = async (perPage, filters = {}) => {
    return loadOrders({
      page: 1, // Volver a la primera página al cambiar items por página
      per_page: perPage,
      ...filters
    });
  };
  
  /**
   * Filtrar órdenes por estado
   * @param {string} status - Estado a filtrar
   */
  const filterByStatus = async (status) => {
    return loadOrders({
      page: 1,
      per_page: pagination.perPage,
      status
    });
  };

  /**
   * Filtrar órdenes por fecha
   * @param {string} after - Fecha de inicio (ISO 8601)
   * @param {string} before - Fecha de fin (ISO 8601)
   */
  const filterByDate = async (after, before) => {
    const filters = {};
    
    if (after) {
      filters.after = after;
    }
    
    if (before) {
      filters.before = before;
    }
    
    return loadOrders({
      page: 1,
      per_page: pagination.perPage,
      ...filters
    });
  };

  /**
   * Buscar órdenes por texto
   * @param {string} searchTerm - Término de búsqueda
   */
  const searchOrders = async (searchTerm) => {
    return loadOrders({
      page: 1,
      per_page: pagination.perPage,
      search: searchTerm
    });
  };
  
  // Cargar órdenes al inicializar el hook
  useEffect(() => {
    loadOrders();
  }, []);
  
  return {
    orders,
    loading,
    error,
    pagination,
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateItemStatus,
    payOrder,
    getOrdersByTable,
    calculateTableTotal,
    changePage,
    changePerPage,
    filterByStatus,
    filterByDate,
    searchOrders
  };
};

export default useWooOrders;