/**
 * Adaptador para convertir órdenes entre el formato de la aplicación y WooCommerce
 */

/**
 * Convierte una orden del formato de la aplicación al formato de WooCommerce
 * @param {Object} appOrder - Orden en formato de la aplicación
 * @returns {Object} - Orden en formato WooCommerce
 */
export const appToWooOrder = (appOrder) => {
  // Básico: mantener el ID si existe
  const orderData = {
    status: mapAppStatusToWoo(appOrder.status),
    meta_data: [
      {
        key: '_yamenu_table_id',
        value: appOrder.tableId.toString()
      },
      {
        key: '_yamenu_app_data',
        value: JSON.stringify(appOrder)
      }
    ]
  };

  // Añadir líneas de productos
  orderData.line_items = appOrder.items.map(item => ({
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    meta_data: [
      {
        key: '_yamenu_item_status',
        value: item.status
      }
    ]
  }));

  return orderData;
};

/**
 * Convierte una orden del formato de WooCommerce al formato de la aplicación
 * @param {Object} wooOrder - Orden en formato WooCommerce
 * @returns {Object} - Orden en formato de la aplicación
 */
export const wooToAppOrder = (wooOrder) => {
  // Intentar recuperar datos originales de la aplicación si existen
  const appDataMeta = wooOrder.meta_data?.find(meta => meta.key === '_yamenu_app_data');
  
  if (appDataMeta && appDataMeta.value) {
    try {
      // Si tenemos los datos completos de la app, usarlos como base
      const originalAppData = JSON.parse(appDataMeta.value);
      return {
        ...originalAppData,
        id: wooOrder.id,
        status: mapWooStatusToApp(wooOrder.status),
        updatedAt: wooOrder.date_modified || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing app data from WooCommerce:', error);
      // Continuar con la conversión manual
    }
  }
  
  // Conversión manual si no hay datos originales o falló el parsing
  const tableIdMeta = wooOrder.meta_data?.find(meta => meta.key === '_yamenu_table_id');
  const tableId = tableIdMeta ? parseInt(tableIdMeta.value, 10) : 0;
  
  // Crear una orden en formato de la aplicación
  const appOrder = {
    id: wooOrder.id,
    tableId: tableId,
    status: mapWooStatusToApp(wooOrder.status),
    createdAt: wooOrder.date_created || new Date().toISOString(),
    updatedAt: wooOrder.date_modified || new Date().toISOString(),
    items: []
  };
  
  // Convertir líneas de productos
  if (wooOrder.line_items && Array.isArray(wooOrder.line_items)) {
    appOrder.items = wooOrder.line_items.map(item => {
      const itemStatusMeta = item.meta_data?.find(meta => meta.key === '_yamenu_item_status');
      
      return {
        productId: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price || 0),
        status: itemStatusMeta ? itemStatusMeta.value : 'pendiente'
      };
    });
  }
  
  return appOrder;
};

/**
 * Mapea el estado de una orden de la aplicación al formato de WooCommerce
 * @param {string} appStatus - Estado en formato de la aplicación
 * @returns {string} - Estado en formato WooCommerce
 */
const mapAppStatusToWoo = (appStatus) => {
  const statusMap = {
    'en curso': 'processing',
    'pagando': 'pending',
    'pagado': 'completed',
    'cancelado': 'cancelled'
  };
  
  return statusMap[appStatus] || 'processing';
};

/**
 * Mapea el estado de una orden de WooCommerce al formato de la aplicación
 * @param {string} wooStatus - Estado en formato WooCommerce
 * @returns {string} - Estado en formato de la aplicación
 */
const mapWooStatusToApp = (wooStatus) => {
  const statusMap = {
    'processing': 'en curso',
    'pending': 'pagando',
    'completed': 'pagado',
    'cancelled': 'cancelado',
    'refunded': 'cancelado',
    'failed': 'cancelado',
    'on-hold': 'pagando'
  };
  
  return statusMap[wooStatus] || 'en curso';
};

export default {
  appToWooOrder,
  wooToAppOrder
};