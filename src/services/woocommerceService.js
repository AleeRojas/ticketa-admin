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
 * @returns {Promise} - Promesa con la respuesta y metadatos de paginación
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
    console.log(`Realizando petición ${method} a: ${url.toString()}`);
    const response = await fetch(url, options);
    
    // Manejar errores HTTP
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }
    
    // Extraer información de paginación de los encabezados
    // Nota: WooCommerce usa 'x-wp-total' y 'x-wp-totalpages' (minúsculas)
    const totalItems = parseInt(response.headers.get('x-wp-total') || '0');
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
    
    console.log('Cabeceras de paginación recibidas:', {
      'x-wp-total': response.headers.get('x-wp-total'),
      'x-wp-totalpages': response.headers.get('x-wp-totalpages')
    });
    
    // Mostrar todas las cabeceras para debug
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('Todas las cabeceras:', headers);
    
    const pagination = {
      totalItems: totalItems,
      totalPages: totalPages,
    };
    
    // Parsear respuesta como JSON
    const data = await response.json();
    
    console.log(`Datos recibidos: ${data.length} items, Paginación:`, pagination);
    
    // Devolver tanto los datos como la información de paginación
    return {
      data,
      pagination
    };
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
   * @returns {Promise} - Promesa con la lista de productos y metadatos de paginación
   */
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Añadir parámetros de consulta
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    // Asegurarse de que la paginación esté incluida en la consulta
    if (!params.page) {
      queryParams.append('page', '1');
    }
    
    if (!params.per_page) {
      queryParams.append('per_page', '10');
    }
    
    console.log('getProducts - Parámetros:', Object.fromEntries(queryParams.entries()));
    return apiRequest(`/products?${queryParams.toString()}`);
  },
  
  /**
   * Obtener un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise} - Promesa con el producto
   */
  getProduct: async (id) => {
    const response = await apiRequest(`/products/${id}`);
    return response.data;
  },
  
  /**
   * Crear un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise} - Promesa con el producto creado
   */
  createProduct: async (productData) => {
    const response = await apiRequest('/products', 'POST', productData);
    return response.data;
  },
  
  /**
   * Actualizar un producto existente
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos actualizados del producto
   * @returns {Promise} - Promesa con el producto actualizado
   */
  updateProduct: async (id, productData) => {
    const response = await apiRequest(`/products/${id}`, 'PUT', productData);
    return response.data;
  },
  
  /**
   * Eliminar un producto
   * @param {number} id - ID del producto
   * @returns {Promise} - Promesa con la confirmación
   */
  deleteProduct: async (id) => {
    const response = await apiRequest(`/products/${id}`, 'DELETE');
    return response.data;
  }
};

// Servicios para Categorías
const categoryService = {
  /**
   * Obtener todas las categorías
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} - Promesa con la lista de categorías y metadatos de paginación
   */
  getCategories: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    // Asegurarse de incluir parámetros de paginación
    if (!params.page) {
      queryParams.append('page', '1');
    }
    
    if (!params.per_page) {
      queryParams.append('per_page', '50');  // Mayor valor por defecto para categorías
    }
    
    return apiRequest(`/products/categories?${queryParams.toString()}`);
  },
  
  /**
   * Crear una nueva categoría
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise} - Promesa con la categoría creada
   */
  createCategory: async (categoryData) => {
    const response = await apiRequest('/products/categories', 'POST', categoryData);
    return response.data;
  },
  
  /**
   * Actualizar una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} categoryData - Datos actualizados de la categoría
   * @returns {Promise} - Promesa con la categoría actualizada
   */
  updateCategory: async (id, categoryData) => {
    const response = await apiRequest(`/products/categories/${id}`, 'PUT', categoryData);
    return response.data;
  },
  
  /**
   * Eliminar una categoría
   * @param {number} id - ID de la categoría
   * @returns {Promise} - Promesa con la confirmación
   */
  deleteCategory: async (id) => {
    const response = await apiRequest(`/products/categories/${id}`, 'DELETE');
    return response.data;
  }
};

// Servicios para Pedidos
const orderService = {
  /**
   * Obtener todos los pedidos
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} - Promesa con la lista de pedidos y metadatos de paginación
   */
  getOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    // Asegurarse de incluir parámetros de paginación
    if (!params.page) {
      queryParams.append('page', '1');
    }
    
    if (!params.per_page) {
      queryParams.append('per_page', '10');
    }
    
    return apiRequest(`/orders?${queryParams.toString()}`);
  },
  
  /**
   * Obtener un pedido por ID
   * @param {number} id - ID del pedido
   * @returns {Promise} - Promesa con el pedido
   */
  getOrder: async (id) => {
    const response = await apiRequest(`/orders/${id}`);
    return response.data;
  },
  
  /**
   * Crear un nuevo pedido
   * @param {Object} orderData - Datos del pedido
   * @returns {Promise} - Promesa con el pedido creado
   */
  createOrder: async (orderData) => {
    const response = await apiRequest('/orders', 'POST', orderData);
    return response.data;
  },
  
  /**
   * Actualizar un pedido existente
   * @param {number} id - ID del pedido
   * @param {Object} orderData - Datos actualizados del pedido
   * @returns {Promise} - Promesa con el pedido actualizado
   */
  updateOrder: async (id, orderData) => {
    const response = await apiRequest(`/orders/${id}`, 'PUT', orderData);
    return response.data;
  },
  
  /**
   * Eliminar un pedido
   * @param {number} id - ID del pedido
   * @returns {Promise} - Promesa con la confirmación
   */
  deleteOrder: async (id) => {
    const response = await apiRequest(`/orders/${id}`, 'DELETE');
    return response.data;
  }
};

// Servicios para Clientes
const customerService = {
  /**
   * Obtener todos los clientes
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} - Promesa con la lista de clientes y metadatos de paginación
   */
  getCustomers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });
    
    // Asegurarse de incluir parámetros de paginación
    if (!params.page) {
      queryParams.append('page', '1');
    }
    
    if (!params.per_page) {
      queryParams.append('per_page', '10');
    }
    
    return apiRequest(`/customers?${queryParams.toString()}`);
  },
  
  /**
   * Obtener un cliente por ID
   * @param {number} id - ID del cliente
   * @returns {Promise} - Promesa con el cliente
   */
  getCustomer: async (id) => {
    const response = await apiRequest(`/customers/${id}`);
    return response.data;
  },
  
  /**
   * Crear un nuevo cliente
   * @param {Object} customerData - Datos del cliente
   * @returns {Promise} - Promesa con el cliente creado
   */
  createCustomer: async (customerData) => {
    const response = await apiRequest('/customers', 'POST', customerData);
    return response.data;
  },
  
  /**
   * Actualizar un cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} customerData - Datos actualizados del cliente
   * @returns {Promise} - Promesa con el cliente actualizado
   */
  updateCustomer: async (id, customerData) => {
    const response = await apiRequest(`/customers/${id}`, 'PUT', customerData);
    return response.data;
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