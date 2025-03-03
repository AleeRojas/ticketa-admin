import { useState } from 'react';
import { initialOrders } from '../data/initialOrders';

/**
 * Hook para la gestión de pedidos
 * @param {Array} initialOrdersData - Datos iniciales de pedidos (opcional, por defecto initialOrders)
 * @param {Function} onTableStatusChange - Callback cuando cambia el estado de una mesa (opcional)
 * @returns {Object} - Métodos y estados para gestionar pedidos
 */
const useOrderManagement = (initialOrdersData = initialOrders, onTableStatusChange = () => {}) => {
  const [orders, setOrders] = useState(initialOrdersData);
  const [activeOrder, setActiveOrder] = useState(null);
  
  /**
   * Crear un nuevo pedido
   * @param {Object} orderData - Datos del pedido (tableId, items, etc.)
   * @returns {Object} - El pedido creado con su ID asignado
   */
  const createOrder = (orderData) => {
    const newId = Math.max(...orders.map(o => o.id), 0) + 1;
    const now = new Date().toISOString();
    
    const newOrder = { 
      ...orderData, 
      id: newId,
      status: orderData.status || 'en curso',
      createdAt: orderData.createdAt || now,
      updatedAt: now
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Si la mesa estaba libre, notificar el cambio de estado
    if (orderData.tableId) {
      onTableStatusChange(orderData.tableId, 'ocupada');
    }
    
    return newOrder;
  };
  
  /**
   * Actualizar un pedido existente
   * @param {number} orderId - ID del pedido a actualizar
   * @param {Object} orderData - Nuevos datos para el pedido
   * @returns {Object|null} - El pedido actualizado o null si no se encontró
   */
  const updateOrder = (orderId, orderData) => {
    let updatedOrder = null;
    
    setOrders(prev => {
      const newOrders = prev.map(order => {
        if (order.id === orderId) {
          updatedOrder = { 
            ...order, 
            ...orderData,
            updatedAt: new Date().toISOString()
          };
          return updatedOrder;
        }
        return order;
      });
      
      return newOrders;
    });
    
    return updatedOrder;
  };
  
  /**
   * Eliminar un pedido existente
   * @param {number} orderId - ID del pedido a eliminar
   * @returns {boolean} - true si se eliminó correctamente, false si no se encontró
   */
  const deleteOrder = (orderId) => {
    let deletedOrder = null;
    
    setOrders(prev => {
      deletedOrder = prev.find(order => order.id === orderId);
      return prev.filter(order => order.id !== orderId);
    });
    
    if (deletedOrder) {
      // Comprobar si hay más pedidos para esta mesa
      const remainingOrders = orders.filter(
        order => order.tableId === deletedOrder.tableId && order.id !== orderId
      );
      
      // Si no hay más pedidos, notificar el cambio de estado
      if (remainingOrders.length === 0) {
        onTableStatusChange(deletedOrder.tableId, 'libre');
      }
      
      return true;
    }
    
    return false;
  };
  
  /**
   * Actualizar el estado de un pedido
   * @param {number} orderId - ID del pedido
   * @param {string} newStatus - Nuevo estado ('en curso', 'pagando', 'pagado', etc.)
   * @returns {Object|null} - El pedido actualizado o null si no se encontró
   */
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrder = updateOrder(orderId, { status: newStatus });
    
    if (updatedOrder && newStatus === 'pagado') {
      // Comprobar si hay más pedidos sin pagar para esta mesa
      const unpaidOrders = orders.filter(
        order => order.tableId === updatedOrder.tableId && 
                order.id !== orderId && 
                order.status !== 'pagado'
      );
      
      // Si no hay más pedidos sin pagar, notificar el cambio de estado
      if (unpaidOrders.length === 0) {
        onTableStatusChange(updatedOrder.tableId, 'pagando');
      }
    }
    
    return updatedOrder;
  };
  
  /**
   * Actualizar el estado de un producto en un pedido
   * @param {number} orderId - ID del pedido
   * @param {number} itemIndex - Índice del producto en el array items
   * @param {string} newStatus - Nuevo estado ('pendiente', 'preparando', 'servido', etc.)
   * @returns {Object|null} - El pedido actualizado o null si no se encontró
   */
  const updateItemStatus = (orderId, itemIndex, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order || !order.items[itemIndex]) {
      return null;
    }
    
    const newItems = [...order.items];
    newItems[itemIndex] = { ...newItems[itemIndex], status: newStatus };
    
    return updateOrder(orderId, { items: newItems });
  };
  
  /**
   * Obtener todos los pedidos de una mesa específica
   * @param {number} tableId - ID de la mesa
   * @returns {Array} - Array de pedidos filtrados por mesa
   */
  const getOrdersByTable = (tableId) => {
    return orders.filter(order => order.tableId === tableId);
  };
  
  /**
   * Calcular el total de un pedido
   * @param {Object|number} orderOrId - Pedido u objeto o ID del pedido
   * @returns {number} - Total calculado o 0 si no se encontró
   */
  const calculateOrderTotal = (orderOrId) => {
    const order = typeof orderOrId === 'object' 
      ? orderOrId 
      : orders.find(o => o.id === orderOrId);
    
    if (!order || !order.items) {
      return 0;
    }
    
    return order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  /**
   * Calcular el total de todos los pedidos de una mesa
   * @param {number} tableId - ID de la mesa
   * @returns {number} - Total calculado para todos los pedidos de la mesa
   */
  const calculateTableTotal = (tableId) => {
    const tableOrders = getOrdersByTable(tableId);
    
    return tableOrders.reduce((total, order) => {
      return total + calculateOrderTotal(order);
    }, 0);
  };

  /**
   * Añadir un producto a un pedido
   * @param {number} orderId - ID del pedido
   * @param {Object} product - Producto a añadir
   * @param {number} quantity - Cantidad a añadir (por defecto 1)
   * @returns {Object|null} - El pedido actualizado o null si no se encontró
   */
  const addProductToOrder = (orderId, product, quantity = 1) => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return null;
    }
    
    const newItems = [...order.items];
    const existingItemIndex = newItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity
      };
    } else {
      // Añadir nuevo item
      newItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        status: 'pendiente'
      });
    }
    
    return updateOrder(orderId, { items: newItems });
  };
  
  /**
   * Remueve un producto de un pedido
   * @param {number} orderId - ID del pedido
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad a remover (por defecto 1, 0 para eliminar todo)
   * @returns {Object|null} - El pedido actualizado o null si no se encontró
   */
  const removeProductFromOrder = (orderId, productId, quantity = 1) => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return null;
    }
    
    const newItems = [...order.items];
    const existingItemIndex = newItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex === -1) {
      return order; // No encontrado, devolver el pedido sin cambios
    }
    
    if (quantity === 0 || newItems[existingItemIndex].quantity <= quantity) {
      // Eliminar el producto completamente
      newItems.splice(existingItemIndex, 1);
    } else {
      // Reducir la cantidad
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity - quantity
      };
    }
    
    return updateOrder(orderId, { items: newItems });
  };
  
  /**
   * Marca un pedido como pagado
   * @param {number} orderId - ID del pedido
   * @returns {Object|null} - El pedido actualizado o null si no se encontró
   */
  const payOrder = (orderId) => {
    return updateOrderStatus(orderId, 'pagado');
  };
  
  return {
    orders,
    setOrders,
    activeOrder,
    setActiveOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    updateItemStatus,
    getOrdersByTable,
    calculateOrderTotal,
    calculateTableTotal,
    addProductToOrder,
    removeProductFromOrder,
    payOrder
  };
};

export default useOrderManagement;
