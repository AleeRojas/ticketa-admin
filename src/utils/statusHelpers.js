/**
 * Utilidades para manejar estados y colores en la aplicación
 */

/**
 * Obtiene los colores asociados a un estado de mesa
 * @param {string} status - Estado de la mesa ('libre', 'ocupada', 'pagando', 'reservada')
 * @returns {Object} - Objeto con clases CSS para diferentes partes
 */
export const getTableColor = (status) => {
  switch(status) {
    case 'ocupada': 
      return { 
        bg: 'bg-amber-500', 
        text: 'text-amber-800', 
        ring: 'ring-amber-500', 
        light: 'bg-amber-100',
        hover: 'hover:bg-amber-600'
      };
    case 'libre': 
      return { 
        bg: 'bg-emerald-500', 
        text: 'text-emerald-800', 
        ring: 'ring-emerald-500', 
        light: 'bg-emerald-100',
        hover: 'hover:bg-emerald-600'
      };
    case 'pagando': 
      return { 
        bg: 'bg-blue-500', 
        text: 'text-blue-800', 
        ring: 'ring-blue-500', 
        light: 'bg-blue-100',
        hover: 'hover:bg-blue-600'
      };
    case 'reservada': 
      return { 
        bg: 'bg-purple-500', 
        text: 'text-purple-800', 
        ring: 'ring-purple-500', 
        light: 'bg-purple-100',
        hover: 'hover:bg-purple-600'
      };
    default: 
      return { 
        bg: 'bg-gray-500', 
        text: 'text-gray-800', 
        ring: 'ring-gray-500', 
        light: 'bg-gray-100',
        hover: 'hover:bg-gray-600'
      };
  }
};

/**
 * Obtiene el texto descriptivo para un estado
 * @param {string} status - Código del estado
 * @returns {string} - Texto descriptivo
 */
export const getStatusText = (status) => {
  const statusMap = {
    // Estados de mesa
    'ocupada': 'Ocupada',
    'libre': 'Libre',
    'pagando': 'Pagando',
    'reservada': 'Reservada',
    
    // Estados de pedido
    'en curso': 'En curso',
    'pagado': 'Pagado',
    'cancelado': 'Cancelado',
    
    // Estados de items
    'pendiente': 'Pendiente',
    'preparando': 'Preparando',
    'servido': 'Servido'
  };
  
  return statusMap[status] || status;
};

/**
 * Obtiene los colores asociados a un estado de pedido
 * @param {string} status - Estado del pedido
 * @returns {Object} - Objeto con clases CSS para diferentes partes
 */
export const getOrderStatusColor = (status) => {
  switch(status) {
    case 'en curso': 
      return { 
        bg: 'bg-amber-100', 
        text: 'text-amber-800', 
        border: 'border-amber-200'
      };
    case 'pagado': 
      return { 
        bg: 'bg-emerald-100', 
        text: 'text-emerald-800', 
        border: 'border-emerald-200'
      };
    case 'cancelado': 
      return { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        border: 'border-red-200'
      };
    case 'pagando': 
      return { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        border: 'border-blue-200'
      };
    default: 
      return { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        border: 'border-gray-200'
      };
  }
};

/**
 * Obtiene los colores asociados a un estado de item de pedido
 * @param {string} status - Estado del item
 * @returns {Object} - Objeto con clases CSS para diferentes partes
 */
export const getItemStatusColor = (status) => {
  switch(status) {
    case 'pendiente': 
      return { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700', 
        border: 'border-gray-200'
      };
    case 'preparando': 
      return { 
        bg: 'bg-amber-100', 
        text: 'text-amber-700', 
        border: 'border-amber-200'
      };
    case 'servido': 
      return { 
        bg: 'bg-emerald-100', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200'
      };
    default: 
      return { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700', 
        border: 'border-gray-200'
      };
  }
};
