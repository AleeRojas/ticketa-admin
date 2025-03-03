import { useState, useEffect } from 'react';
import woocommerceService from '../services/woocommerceService';

/**
 * Hook para gestionar pedidos de WooCommerce
 * @param {Function} onTableStatusChange - Callback para cambios de estado de mesa
 * @returns {Object} - Métodos y estados para gestionar pedidos
 */
const useWooOrders = (onTableStatusChange = () => {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  
  /**
   * Cargar pedidos desde la API de WooCommerce
   * @param {Object} params - Parámetros de consulta
   */
  const loadOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await woocommerceService.orders.getOrders({
        ...params,
        status: params.status || ['processing', 'on-hold', 'completed'],
        per_page: 100
      });
      
      // Transformar los datos de WooCommerce al formato de nuestra aplicación
      const transformedOrders = data.map(item => {
        // Extraer el ID de la mesa de los metadatos
        const tableId = parseInt(item.meta_data?.find(meta => meta.key === '_table_id')?.value || 0);
        
        // Mapear estado de WooCommerce a estados de nuestra aplicación
        let status;
        switch (item.status) {
          case 'processing':
            status = 'en curso';
            break;
          case 'on-hold':
            status = 'pagando';
            break;
          case 'completed':
            status = 'pagado';
            break;
          default:
            status = 'en curso';
        }
        
        // Transformar productos a formato de nuestra aplicación
        const items = item.line_items.map(lineItem => ({
          productId: lineItem.product_id,
          name: lineItem.name,
          quantity: lineItem.quantity,
          price: parseFloat(lineItem.price),
          status: lineItem.meta_data?.find(meta => meta.key === '_item_status')?.value || 'pendiente'
        }));
        
        return {
          id: item.id,
          tableId: tableId,
          items: items,
          status: status,
          createdAt: item.date_created,
          updatedAt: item.date_modified,
          customerName: `${item.billing.first_name} ${item.billing.last_name}`,
          customerEmail: item.billing.email,
          customerPhone: item.billing.phone,
          totalAmount: parseFloat(item.total)
        };
      });
      
      setOrders(transformedOrders);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando pedidos:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Crear un nuevo pedido en WooCommerce
   * @param {Object} orderData - Datos del pedido
   * @returns {Promise} - Promesa con el pedido creado
   */
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar líneas de productos para WooCommerce
      const line_items = orderData.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        meta_data: [
          { key: '_item_status', value: item.status || 'pendiente' }
        ]
      }));
      
      // Preparar datos para WooCommerce
      const wooOrder = {
        status: 'processing',
        meta_data: [
          { key: '_table_id', value: orderData.tableId.toString() }
        ],
        line_items: line_items,
        // Datos de cliente dummy (requeridos por WooCommerce)
        billing: {
          first_name: 'Cliente',
          last_name: 'Mesa',
          address_1: 'Restaurante',
          city: 'Ciudad',
          postcode: '00000',
          country: 'ES',
          email: 'cliente@restaurante.com',
          phone: '000000000'
        }
      };
      
      // Crear pedido en WooCommerce
      const result = await woocommerceService.orders.createOrder(wooOrder);
      
      // Transformar respuesta al formato de nuestra aplicación
      const transformedOrder = {
        id: result.id,
        tableId: orderData.tableId,
        items: orderData.items,
        status: 'en curso',
        createdAt: result.date_created,
        updatedAt: result.date_modified,
        customerName: `${result.billing.first_name} ${result.billing.last_name}`,
        customerEmail: result.billing.email,
        customerPhone: result.billing.phone,
        totalAmount: parseFloat(result.total)
      };
      
      // Actualizar estado local
      setOrders(prevOrders => [...prevOrders, transformedOrder]);
      
      // Si la mesa estaba libre, notificar el cambio de estado
      if (orderData.tableId) {
        onTableStatusChange(orderData.tableId, 'ocupada');
      }
      
      return transformedOrder;
    } catch (err) {
      setError(err.message);
      console.error('Error creando pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Actualizar un pedido existente en WooCommerce
   * @param {number} orderId - ID del pedido
   * @param {Object} orderData - Nuevos datos para el pedido
   * @returns {Promise} - Promesa con el pedido actualizado
   */
  const updateOrder = async (orderId, orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener pedido actual para mantener los datos que no cambian
      const currentOrder = orders.find(o => o.id === orderId);
      if (!currentOrder) {
        throw new Error('Pedido no encontrado');
      }
      
      // Mapear estado de nuestra aplicación a estados de WooCommerce
      let status;
      switch (orderData.status || currentOrder.status) {
        case 'en curso':
          status = 'processing';
          break;
        case 'pagando':
          status = 'on-hold';
          break;
        case 'pagado':
          status = 'completed';
          break;
        default:
          status = 'processing';
      }
      
      // Preparar líneas de productos para WooCommerce (si hay cambios)
      const line_items = orderData.items ? orderData.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        meta_data: [
          { key: '_item_status', value: item.status || 'pendiente' }
        ]
      })) : undefined;
      
      // Preparar datos para actualizar en WooCommerce
      const wooOrder = {
        status: status,
        line_items: line_items
      };
      
      // Actualizar pedido en WooCommerce
      const result = await woocommerceService.orders.updateOrder(orderId, wooOrder);
      
      // Transformar respuesta al formato de nuestra aplicación
      const transformedOrder = {
        ...currentOrder,
        ...orderData,
        updatedAt: result.date_modified
      };
      
      // Actualizar estado local
      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? transformedOrder : o));
      
      // Si se ha cambiado el estado a pagado, actualizar estado de la mesa
      if (orderData.status === 'pagado') {
        const unpaidOrders = orders.filter(
          o => o.tableId === currentOrder.tableId && o.id !== orderId && o.status !== 'pagado'
        );
        
        if (unpaidOrders.length === 0) {
          onTableStatusChange(currentOrder.tableId, 'pagando');
        }
      }
      
      return transformedOrder;
    } catch (err) {
      setError(err.message);
      console.error('Error actualizando pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Eliminar un pedido de WooCommerce
   * @param {number} orderId - ID del pedido
   * @returns {Promise} - Promesa con el resultado
   */
  const deleteOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener el pedido para saber qué mesa actualizar
      const orderToDelete = orders.find(o => o.id === orderId);
      const tableId = orderToDelete?.tableId;
      
      // Eliminar en WooCommerce (realmente cambiar a cancelado)
      await woocommerceService.orders.updateOrder(orderId, { status: 'cancelled' });
      
      // Actualizar estado local
      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
      
      // Si no quedan pedidos para esta mesa, actualizar estado
      if (tableId) {
        const remainingOrders = orders.filter(
          o => o.tableId === tableId && o.id !== orderId
        );
        
        if (remainingOrders.length === 0) {
          onTableStatusChange(tableId, 'libre');
        }
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error eliminando pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Actualizar el estado de un item del pedido
   * @param {number} orderId - ID del pedido
   * @param {number} itemIndex - Índice del item en el array
   * @param {string} newStatus - Nuevo estado del item
   * @returns {Promise} - Promesa con el pedido actualizado
   */
  const updateItemStatus = async (orderId, itemIndex, newStatus) => {
    // Obtener pedido actual
    const order = orders.find(o => o.id === orderId);
    if (!order || !order.items[itemIndex]) {
      throw new Error('Pedido o item no encontrado');
    }
    
    // Crear copia de los items con el nuevo estado
    const updatedItems = [...order.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], status: newStatus };
    
    // Actualizar el pedido con los nuevos items
    return updateOrder(orderId, { items: updatedItems });
  };
  
  /**
   * Marcar un pedido como pagado
   * @param {number} orderId - ID del pedido
   * @returns {Promise} - Promesa con el pedido actualizado
   */
  const payOrder = async (orderId) => {
    return updateOrder(orderId, { status: 'pagado' });
  };
  
  /**
   * Obtener pedidos para una mesa específica
   * @param {number} tableId - ID de la mesa
   * @returns {Array} - Array de pedidos de la mesa
   */
  const getOrdersByTable = (tableId) => {
    return orders.filter(order => order.tableId === tableId);
  };
  
  /**
   * Calcular total para todos los pedidos de una mesa
   * @param {number} tableId - ID de la mesa
   * @returns {number} - Total calculado
   */
  const calculateTableTotal = (tableId) => {
    const tableOrders = getOrdersByTable(tableId);
    return tableOrders.reduce((total, order) => total + order.totalAmount, 0);
  };
  
  // Cargar pedidos al inicializar
  useEffect(() => {
    loadOrders();
  }, []);
  
  return {
    orders,
    loading,
    error,
    activeOrder,
    setActiveOrder,
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateItemStatus,
    payOrder,
    getOrdersByTable,
    calculateTableTotal
  };
};

export default useWooOrders;
  