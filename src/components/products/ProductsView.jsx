import React, { useState } from 'react';
import { Plus, Filter, Search, Tag } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import ProductList from './ProductList';
import ProductCategoryFilter from './ProductCategoryFilter';
import ProductModal from '../modals/ProductModal';

/**
 * Vista principal de productos
 */
const ProductsView = () => {
  const { 
    products, 
    categories  // Changed from productCategories to categories to match AppContext
  } = useAppContext();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Filtrado de productos
  const filteredProducts = products.filter(product => {
    // Filtro por búsqueda (nombre o descripción)
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro por categoría
    const matchesCategory = 
      selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Estadísticas básicas
  const stats = {
    total: products.length,
    categories: categories.length,  // Changed from productCategories to categories
    filtered: filteredProducts.length
  };
  
  // Abrir modal para crear nuevo producto
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };
  
  // Abrir modal para editar producto existente
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  return (
    <div>
      {/* Cabecera y filtros */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de productos
        </h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          
          <button className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1">
            <Filter size={16} />
            <span>Filtrar</span>
          </button>
          
          <button 
            onClick={handleAddProduct}
            className="bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="mb-6">
        <ProductCategoryFilter 
          categories={categories}  // Changed from productCategories to categories
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Estadísticas */}
      <div className="flex mb-6">
        <div className="bg-white rounded-lg shadow p-4 mr-4">
          <p className="text-sm text-gray-500">Total de productos</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mr-4">
          <p className="text-sm text-gray-500">Categorías</p>
          <p className="text-2xl font-semibold">{stats.categories}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Resultados</p>
          <p className="text-2xl font-semibold">{stats.filtered}</p>
        </div>
      </div>

      {/* Lista de productos */}
      <ProductList 
        products={filteredProducts} 
        categories={categories}  // Changed from productCategories to categories
        onEditProduct={handleEditProduct}
      />
      
      {/* Modal de producto */}
      {showProductModal && (
        <ProductModal
          onClose={() => setShowProductModal(false)}
          product={editingProduct}
          categories={categories}  // Changed from productCategories to categories
        />
      )}
    </div>
  );
};

export default ProductsView;