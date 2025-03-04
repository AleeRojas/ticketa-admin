import { useWooCommerceContext } from '../context/WooCommerceContext';
import { useAppContext } from '../context/AppContext';

/**
 * Hook para operaciones de órdenes con soporte offline
 */
const useOrderOperations = () => {
  const { 
    isOnline, 
    syncEnabled, 
    createOrder: wooCreateOrder,
    updateOrder: wooUpdateOrder,
    deleteOrder: wooDeleteOrder,
    payOrder: wooPayOrder,
    queueOperation
  } = useWooCommerceContext();
  
  const { 
    orders, 
    setOrders,
    handleSaveOrder: localSaveOrder,
    handleDeleteOrder: localDeleteOrder,
    handlePayOrder: localPayOrder
  } = useAppContext();
  
  /**
   * Guardar/crear orden con soporte offline
   * @param {Object} orderData - Datos de la orden
   * @param {number} existingOrderId - ID de orden existente (si es actualización)
   * @returns {Promise<number>} - ID de la orden guardada
   */
  const saveOrder = async (orderData, existingOrderId) => {
    console.log('Saving order:', orderData, 'Existing ID:', existingOrderId);
    
    // Asegurarse de que tenga timestamp
    const orderWithTimestamp = {
      ...orderData,
      updatedAt: new Date().toISOString()
    };
    
    // Siempre guardar localmente primero
    const savedOrderId = localSaveOrder(orderWithTimestamp, existingOrderId);
    
    // Si está online y la sincronización está activada, guardar en WooCommerce
    if (isOnline && syncEnabled) {
      try {
        if (existingOrderId) {
          await wooUpdateOrder(existingOrderId, orderWithTimestamp);
          console.log('Order updated in WooCommerce:', existingOrderId);
        } else {
          const createdOrder = await wooCreateOrder(orderWithTimestamp);
          console.log('Order created in WooCommerce:', createdOrder);
          // Si tenemos un ID remoto, actualizar la orden local con ese ID
          if (createdOrder && createdOrder.id) {
            localSaveOrder({
              ...orderWithTimestamp,
              id: createdOrder.id
            }, savedOrderId);
          }
        }
      } catch (error) {
        console.error(`Error ${existingOrderId ? 'updating' : 'creating'} order in WooCommerce:`, error);
        // Si falla, poner en cola para más tarde
        queueOperation(existingOrderId ? 'update' : 'create', 'order', {
          ...orderWithTimestamp,
          id: existingOrderId || savedOrderId
        });
      }
    } else if (syncEnabled) {
      // Si está offline pero la sincronización está activada, poner en cola
      console.log('Offline mode, queueing order for later sync');
      queueOperation(existingOrderId ? 'update' : 'create', 'order', {
        ...orderWithTimestamp,
        id: existingOrderId || savedOrderId
      });
    }
    
    return savedOrderId;
  };
  
  /**
   * Eliminar orden con soporte offline
   * @param {number} orderId - ID de la orden a eliminar
   * @returns {Promise<void>}
   */
  const deleteOrder = async (orderId) => {
    console.log('Deleting order:', orderId);
    
    // Obtener datos de la orden antes de eliminarla
    const orderToDelete = orders.find(o => o.id === orderId);
    
    if (!orderToDelete) {
      console.error('Order not found for deletion:', orderId);
      return;
    }
    
    // Siempre eliminar localmente primero
    localDeleteOrder(orderId);
    
    // Si está online y la sincronización está activada, eliminar de WooCommerce
    if (isOnline && syncEnabled) {
      try {
        await wooDeleteOrder(orderId);
        console.log('Order deleted from WooCommerce:', orderId);
      } catch (error) {
        console.error('Error deleting order from WooCommerce:', error);
        // Si falla, poner en cola para más tarde
        queueOperation('delete', 'order', orderToDelete);
      }
    } else if (syncEnabled) {
      // Si está offline pero la sincronización está activada, poner en cola
      console.log('Offline mode, queueing order deletion for later sync');
      queueOperation('delete', 'order', orderToDelete);
    }
  };
  
  /**
   * Pagar orden con soporte offline
   * @param {number} orderId - ID de la orden a pagar
   * @returns {Promise<void>}
   */
  const payOrder = async (orderId) => {
    console.log('Paying order:', orderId);
    
    // Siempre pagar localmente primero
    localPayOrder(orderId);
    
    // Si está online y la sincronización está activada, pagar en WooCommerce
    if (isOnline && syncEnabled) {
      try {
        await wooPayOrder(orderId);
        console.log('Order paid in WooCommerce:', orderId);
      } catch (error) {
        console.error('Error paying order in WooCommerce:', error);
        // Si falla, poner en cola para más tarde
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          queueOperation('update', 'order', updatedOrder);
        }
      }
    } else if (syncEnabled) {
      // Si está offline pero la sincronización está activada, poner en cola
      console.log('Offline mode, queueing order payment for later sync');
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        queueOperation('update', 'order', updatedOrder);
      }
    }
  };
  
  /**
   * Actualizar el estado de un ítem en una orden
   * @param {number} orderId - ID de la orden
   * @param {number} itemIndex - Índice del ítem
   * @param {string} status - Nuevo estado
   * @returns {Promise<void>}
   */
  const updateItemStatus = async (orderId, itemIndex, status) => {
    console.log('Updating item status:', orderId, itemIndex, status);
    
    // Buscar la orden
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      console.error('Order not found for item status update:', orderId);
      return;
    }
    
    // Crear una copia actualizada de la orden
    const updatedOrder = {
      ...order,
      items: order.items.map((item, idx) => 
        idx === itemIndex ? { ...item, status } : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    // Guardar la orden actualizada
    await saveOrder(updatedOrder, orderId);
  };
  
  return {
    saveOrder,
    deleteOrder,
    payOrder,
    updateItemStatus
  };
};

export default useOrderOperations;