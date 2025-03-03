/**
 * Servicio para interactuar con la API de WooCommerce
 */

// Constantes para la configuración de la API
const API_BASE_URL = import.meta.env.VITE_WOO_API_URL || 'https://tudominio.com/wp-json/wc/v3';
const CONSUMER_KEY = import.meta.env.VITE_WOO_CONSUMER_KEY || 'tu_consumer_key';
const CONSUMER_SECRET = import.meta.env.VITE_WOO_CONSUMER_SECRET || 'tu_consumer_secret';

/**
 * Función auxiliar para realizar peticiones a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} data - Datos para enviar (para POST y PUT)
 * @returns {Promise} - Promesa con la respuesta
 */
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  // Preparar URL con autenticación
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Añadir consumer key y secret como parámetros de consulta
  url.searchParams.append('consumer_key', CONSUMER_KEY);
  url.searchParams.append('consumer_secret', CONSUMER_SECRET);
  
  // Configurar opciones para fetch
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  // Añadir datos al cuerpo para POST y PUT
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    // Manejar errores HTTP
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }
    
    // Parsear respuesta como JSON
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Servicios para Productos
const productService = {
  /**
   * Obtener todos los productos
   * @param {Object} params - Parámetros de consulta (paginación, ordenación, etc.)
   * @returns {Promise} - Promesa con la lista de productos
   */
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Añadir parámetros de consulta
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    return apiRequest(`/products?${queryParams.toString()}`);
  },
  
  /**
   * Obtener un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise} - Promesa con el producto
   */
  getProduct: async (id) => {
    return apiRequest(`/products/${id}`);
  },
  
  /**
   * Crear un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise} - Promesa con el producto creado
   */
  createProduct: async (productData) => {
    return apiRequest('/products', 'POST', productData);
  },
  
  /**
   * Actualizar un producto existente
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos actualizados del producto
   * @returns {Promise} - Promesa con el producto actualizado
   */
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, 'PUT', productData);
  },
  
  /**
   * Eliminar un producto
   * @param {number} id - ID del producto
   * @returns {Promise} - Promesa con la confirmación
   */
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, 'DELETE');
  }
};

// Servicios para Categorías
const categoryService = {
  /**
   * Obtener todas las categorías
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} - Promesa con la lista de categorías
   */
  getCategories: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    return apiRequest(`/products/categories?${queryParams.toString()}`);
  },
  
  /**
   * Crear una nueva categoría
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise} - Promesa con la categoría creada
   */
  createCategory: async (categoryData) => {
    return apiRequest('/products/categories', 'POST', categoryData);
  },
  
  /**
   * Actualizar una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} categoryData - Datos actualizados de la categoría
   * @returns {Promise} - Promesa con la categoría actualizada
   */
  updateCategory: async (id, categoryData) => {
    return apiRequest(`/products/categories/${id}`, 'PUT', categoryData);
  },
  
  /**
   * Eliminar una categoría
   * @param {number} id - ID de la categoría
   * @returns {Promise} - Promesa con la confirmación
   */
  deleteCategory: async (id) => {
    return apiRequest(`/products/categories/${id}`, 'DELETE');
  }
};

// Servicios para Pedidos
const orderService = {
  /**
   * Obtener todos los pedidos
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} - Promesa con la lista de pedidos
   */
  getOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    return apiRequest(`/orders?${queryParams.toString()}`);
  },
  
  /**
   * Obtener un pedido por ID
   * @param {number} id - ID del pedido
   * @returns {Promise} - Promesa con el pedido
   */
  getOrder: async (id) => {
    return apiRequest(`/orders/${id}`);
  },
  
  /**
   * Crear un nuevo pedido
   * @param {Object} orderData - Datos del pedido
   * @returns {Promise} - Promesa con el pedido creado
   */
  createOrder: async (orderData) => {
    return apiRequest('/orders', 'POST', orderData);
  },
  
  /**
   * Actualizar un pedido existente
   * @param {number} id - ID del pedido
   * @param {Object} orderData - Datos actualizados del pedido
   * @returns {Promise} - Promesa con el pedido actualizado
   */
  updateOrder: async (id, orderData) => {
    return apiRequest(`/orders/${id}`, 'PUT', orderData);
  },
  
  /**
   * Eliminar un pedido
   * @param {number} id - ID del pedido
   * @returns {Promise} - Promesa con la confirmación
   */
  deleteOrder: async (id) => {
    return apiRequest(`/orders/${id}`, 'DELETE');
  }
};

// Servicios para Clientes
const customerService = {
  /**
   * Obtener todos los clientes
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} - Promesa con la lista de clientes
   */
  getCustomers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    return apiRequest(`/customers?${queryParams.toString()}`);
  },
  
  /**
   * Obtener un cliente por ID
   * @param {number} id - ID del cliente
   * @returns {Promise} - Promesa con el cliente
   */
  getCustomer: async (id) => {
    return apiRequest(`/customers/${id}`);
  },
  
  /**
   * Crear un nuevo cliente
   * @param {Object} customerData - Datos del cliente
   * @returns {Promise} - Promesa con el cliente creado
   */
  createCustomer: async (customerData) => {
    return apiRequest('/customers', 'POST', customerData);
  },
  
  /**
   * Actualizar un cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} customerData - Datos actualizados del cliente
   * @returns {Promise} - Promesa con el cliente actualizado
   */
  updateCustomer: async (id, customerData) => {
    return apiRequest(`/customers/${id}`, 'PUT', customerData);
  }
};

// Exportar todos los servicios
export const woocommerceService = {
  products: productService,
  categories: categoryService,
  orders: orderService,
  customers: customerService
};

export default woocommerceService;
