import { useState } from 'react';
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
  
  /**
   * Cargar órdenes desde WooCommerce
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Array>} - Órdenes convertidas al formato de la aplicación
   */
  const loadOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const wooOrders = await woocommerceService.orders.getOrders(params);
      
      // Convertir órdenes al formato de la aplicación
      const appOrders = wooOrders.map(wooToAppOrder);
      
      setOrders(appOrders);
      return appOrders;
    } catch (error) {
      console.error('Error loading orders from WooCommerce:', error);
      setError(error.message || 'Error loading orders');
      return [];
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
  
  return {
    orders,
    loading,
    error,
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateItemStatus,
    payOrder,
    getOrdersByTable,
    calculateTableTotal
  };
}

export default useWooOrders;