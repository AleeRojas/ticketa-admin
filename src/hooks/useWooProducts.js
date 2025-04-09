import { useState, useEffect } from 'react';
import woocommerceService from '../services/woocommerceService';

/**
 * Hook para gestionar productos de WooCommerce
 * @returns {Object} - Métodos y estados para gestionar productos
 */
const useWooProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
   * Cargar productos desde la API de WooCommerce
   * @param {Object} params - Parámetros de consulta
   */
  const loadProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Parámetros por defecto si no se especifican
      const queryParams = {
        page: params.page || pagination.currentPage,
        per_page: params.per_page || pagination.perPage,
        ...params
      };
      
      console.log('loadProducts - Parámetros:', queryParams);
      
      // Solicitar datos a la API
      const response = await woocommerceService.products.getProducts(queryParams);

      // Si no hay resultados, devolver array vacío
      if (response.data.length === 0) {
        const emptyPagination = {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          perPage: queryParams.per_page
        };
        setProducts([]);
        setPagination(emptyPagination);
        return { products: [], pagination: emptyPagination };
      }

      // Transformar los datos de WooCommerce al formato de nuestra aplicación
      const transformedProducts = response.data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        cost: parseFloat(item.meta_data?.find(meta => meta.key === '_cost')?.value || 0),
        category: item.categories.length > 0 ? item.categories[0].id.toString() : '',
        available: item.status === 'publish',
        emoji: item.meta_data?.find(meta => meta.key === '_emoji')?.value || '🍽️',
        ingredients: item.meta_data?.find(meta => meta.key === '_ingredients')?.value || '',
        allergens: item.meta_data?.find(meta => meta.key === '_allergens')?.value || '',
        stock: item.stock_quantity,
        image: item.images.length > 0 ? item.images[0].src : null,
        wooId: item.id // Guardar el ID de WooCommerce
      }));
      
      // Actualizar estado con los productos
      setProducts(transformedProducts);
      
      // Actualizar información de paginación
      const updatedPagination = {
        currentPage: parseInt(queryParams.page),
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
        perPage: parseInt(queryParams.per_page)
      };
      
      setProducts(transformedProducts);
      setPagination(updatedPagination);
      
      return {
        products: transformedProducts,
        pagination: updatedPagination
      };
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError(err.message);
      setProducts([]); // Asegúrate de limpiar los productos en caso de error
      return { products: [], pagination: pagination };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Cargar categorías desde la API de WooCommerce
   * @param {Object} params - Parámetros de consulta
   */
  const loadCategories = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Parámetros por defecto para categorías (cargar más por página)
      const queryParams = {
        per_page: 50,
        ...params
      };
      
      const response = await woocommerceService.categories.getCategories(queryParams);
      
      // Transformar los datos de WooCommerce al formato de nuestra aplicación
      const transformedCategories = response.data.map(item => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        icon: item.meta_data?.find(meta => meta.key === '_icon')?.value || '🍽️'
      }));
      
      setCategories(transformedCategories);
      return transformedCategories;
    } catch (err) {
      setError(err.message);
      console.error('Error cargando categorías:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Guardar un producto en WooCommerce
   * @param {Object} productData - Datos del producto
   * @returns {Promise} - Promesa con el producto guardado
   */
  const saveProduct = async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos para WooCommerce
      const wooProduct = {
        name: productData.name,
        description: productData.description || '',
        regular_price: productData.price.toString(),
        status: productData.available ? 'publish' : 'draft',
        categories: productData.category ? [{ id: parseInt(productData.category) }] : [],
        meta_data: [
          { key: '_cost', value: productData.cost?.toString() || '0' },
          { key: '_emoji', value: productData.emoji || '🍽️' },
          { key: '_ingredients', value: Array.isArray(productData.ingredients) 
            ? productData.ingredients.join(',') 
            : productData.ingredients || '' },
          { key: '_allergens', value: Array.isArray(productData.allergens) 
            ? productData.allergens.join(',') 
            : productData.allergens || '' }
        ]
      };
      
      let result;
      
      if (productData.id) {
        // Actualizar producto existente
        result = await woocommerceService.products.updateProduct(productData.id, wooProduct);
      } else {
        // Crear nuevo producto
        result = await woocommerceService.products.createProduct(wooProduct);
      }
      
      // Transformar respuesta al formato de nuestra aplicación
      const transformedProduct = {
        id: result.id,
        name: result.name,
        description: result.description,
        price: parseFloat(result.price),
        cost: parseFloat(result.meta_data?.find(meta => meta.key === '_cost')?.value || 0),
        category: result.categories.length > 0 ? result.categories[0].id.toString() : '',
        available: result.status === 'publish',
        emoji: result.meta_data?.find(meta => meta.key === '_emoji')?.value || '🍽️',
        ingredients: result.meta_data?.find(meta => meta.key === '_ingredients')?.value || '',
        allergens: result.meta_data?.find(meta => meta.key === '_allergens')?.value || '',
        stock: result.stock_quantity,
        image: result.images.length > 0 ? result.images[0].src : null,
        wooId: result.id
      };
      
      // Actualizar estado local
      setProducts(prevProducts => {
        if (productData.id) {
          return prevProducts.map(p => p.id === transformedProduct.id ? transformedProduct : p);
        } else {
          return [...prevProducts, transformedProduct];
        }
      });
      
      return transformedProduct;
    } catch (err) {
      setError(err.message);
      console.error('Error guardando producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Eliminar un producto de WooCommerce
   * @param {number} productId - ID del producto
   * @returns {Promise} - Promesa con el resultado
   */
  const deleteProduct = async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      await woocommerceService.products.deleteProduct(productId);
      
      // Actualizar estado local
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error eliminando producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Guardar una categoría en WooCommerce
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise} - Promesa con la categoría guardada
   */
  const saveCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos para WooCommerce
      const wooCategory = {
        name: categoryData.name,
        description: categoryData.description || '',
        meta_data: [
          { key: '_icon', value: categoryData.icon || '🍽️' }
        ]
      };
      
      let result;
      
      if (categoryData.id && !isNaN(parseInt(categoryData.id))) {
        // Actualizar categoría existente
        result = await woocommerceService.categories.updateCategory(
          parseInt(categoryData.id), 
          wooCategory
        );
      } else {
        // Crear nueva categoría
        result = await woocommerceService.categories.createCategory(wooCategory);
      }
      
      // Transformar respuesta al formato de nuestra aplicación
      const transformedCategory = {
        id: result.id.toString(),
        name: result.name,
        description: result.description,
        icon: result.meta_data?.find(meta => meta.key === '_icon')?.value || '🍽️'
      };
      
      // Actualizar estado local
      setCategories(prevCategories => {
        if (categoryData.id && !isNaN(parseInt(categoryData.id))) {
          return prevCategories.map(c => c.id === transformedCategory.id ? transformedCategory : c);
        } else {
          return [...prevCategories, transformedCategory];
        }
      });
      
      return transformedCategory;
    } catch (err) {
      setError(err.message);
      console.error('Error guardando categoría:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Eliminar una categoría de WooCommerce
   * @param {number|string} categoryId - ID de la categoría
   * @returns {Promise} - Promesa con el resultado
   */
  const deleteCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    
    try {
      await woocommerceService.categories.deleteCategory(parseInt(categoryId));
      
      // Actualizar estado local
      setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId.toString()));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error eliminando categoría:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Cambiar de página en la paginación
   * @param {number} page - Número de página
   * @param {Object} filters - Filtros adicionales
   */
  const changePage = async (page, filters = {}) => {
    console.log('changePage - Cambiando a página:', page);
    return loadProducts({
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
    console.log('changePerPage - Cambiando a', perPage, 'ítems por página');
    return loadProducts({
      page: 1, // Volver a la primera página al cambiar items por página
      per_page: perPage,
      ...filters
    });
  };
  
  // Cargar productos y categorías al inicializar
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);
  
  return {
    products,
    categories,
    loading,
    error,
    pagination,
    loadProducts,
    loadCategories,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    changePage,
    changePerPage
  };
};

export default useWooProducts;