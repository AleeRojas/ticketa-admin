import { useState } from 'react';
import { initialProducts } from '../data/products';

/**
 * Hook para la gestión de productos
 * @param {Array} initialProductsData - Datos iniciales de productos (opcional, por defecto initialProducts)
 * @returns {Object} - Métodos y estados para gestionar productos
 */
const useProductManagement = (initialProductsData = initialProducts) => {
  const [products, setProducts] = useState(initialProductsData);
  const [categories, setCategories] = useState([]);
  
  /**
   * Crear un nuevo producto o actualizar uno existente
   * @param {Object} productData - Datos del producto
   * @returns {Object} - El producto creado o actualizado
   */
  const handleSaveProduct = (productData) => {
    if (productData.id) {
      // Actualizar un producto existente
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productData.id ? productData : product
        )
      );
      return productData;
    } else {
      // Crear un nuevo producto
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct = { ...productData, id: newId };
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    }
  };
  
  /**
   * Eliminar un producto
   * @param {number} productId - ID del producto a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  const handleDeleteProduct = (productId) => {
    let found = false;
    
    setProducts(prevProducts => {
      found = prevProducts.some(product => product.id === productId);
      return prevProducts.filter(product => product.id !== productId);
    });
    
    return found;
  };
  
  /**
   * Crear o actualizar una categoría
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Object} - La categoría creada o actualizada
   */
  const handleSaveCategory = (categoryData) => {
    if (categories.some(cat => cat.id === categoryData.id)) {
      // Actualizar categoría existente
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryData.id ? categoryData : cat
        )
      );
    } else {
      // Crear nueva categoría
      setCategories(prevCategories => [...prevCategories, categoryData]);
    }
    return categoryData;
  };
  
  /**
   * Eliminar una categoría
   * @param {string} categoryId - ID de la categoría a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  const handleDeleteCategory = (categoryId) => {
    let found = false;
    
    setCategories(prevCategories => {
      found = prevCategories.some(cat => cat.id === categoryId);
      return prevCategories.filter(cat => cat.id !== categoryId);
    });
    
    // Actualizar productos que usan esta categoría
    if (found) {
      const defaultCategoryId = categories.length > 0 ? categories[0].id : null;
      
      if (defaultCategoryId) {
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.category === categoryId 
              ? { ...product, category: defaultCategoryId } 
              : product
          )
        );
      }
    }
    
    return found;
  };
  
  /**
   * Obtener productos por categoría
   * @param {string} categoryId - ID de la categoría
   * @returns {Array} - Array de productos de la categoría
   */
  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.category === categoryId);
  };
  
  /**
   * Buscar productos por nombre, descripción o categoría
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array} - Array de productos que coinciden con la búsqueda
   */
  const searchProducts = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) || 
      (product.description && product.description.toLowerCase().includes(term))
    );
  };
  
  /**
   * Cambiar disponibilidad de un producto
   * @param {number} productId - ID del producto
   * @param {boolean} available - Estado de disponibilidad
   * @returns {Object|null} - El producto actualizado o null si no se encontró
   */
  const toggleProductAvailability = (productId, available) => {
    let updatedProduct = null;
    
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        if (product.id === productId) {
          updatedProduct = { ...product, available };
          return updatedProduct;
        }
        return product;
      });
    });
    
    return updatedProduct;
  };
  
  return {
    products,
    categories,
    handleSaveProduct,
    handleDeleteProduct,
    handleSaveCategory,
    handleDeleteCategory,
    getProductsByCategory,
    searchProducts,
    toggleProductAvailability
  };
};

export default useProductManagement;
