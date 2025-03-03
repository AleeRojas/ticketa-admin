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
  
  /**
   * Cargar productos desde la API de WooCommerce
   * @param {Object} params - Parámetros de consulta
   */
  const loadProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await woocommerceService.products.getProducts(params);
      
      // Transformar los datos de WooCommerce al formato de nuestra aplicación
      const transformedProducts = data.map(item => ({
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
        image: item.images.length > 0 ? item.images[0].src : null
      }));
      
      setProducts(transformedProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando productos:', err);
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
      const data = await woocommerceService.categories.getCategories(params);
      
      // Transformar los datos de WooCommerce al formato de nuestra aplicación
      const transformedCategories = data.map(item => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        icon: item.meta_data?.find(meta => meta.key === '_icon')?.value || '🍽️'
      }));
      
      setCategories(transformedCategories);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando categorías:', err);
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
        image: result.images.length > 0 ? result.images[0].src : null
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
    loadProducts,
    loadCategories,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory
  };
};

export default useWooProducts;
