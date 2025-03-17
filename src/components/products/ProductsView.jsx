import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Tag, ChevronDown, Check, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import ProductList from './ProductList';
import ProductCategoryFilter from './ProductCategoryFilter';
import ProductModal from '../modals/ProductModal';
import BulkEditModal from '../modals/BulkEditModal';

/**
 * Vista principal de productos mejorada con edición múltiple,
 * filtrado avanzado y paginación
 */
const ProductsView = () => {
  const { 
    products, 
    categories,
    handleSaveProduct,
    handleDeleteProduct
  } = useAppContext();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'available', 'unavailable'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'category'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Efectos
  
  // Resetear selección cuando cambian los filtros
  useEffect(() => {
    setSelectedProducts([]);
    setSelectAll(false);
  }, [selectedCategory, searchTerm, priceRange, stockFilter]);
  
  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, priceRange, stockFilter, itemsPerPage]);
  
  // Filtrado de productos
  const filteredProducts = products.filter(product => {
    // Filtro por búsqueda (nombre o descripción)
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro por categoría
    const matchesCategory = 
      selectedCategory === 'all' || product.category === selectedCategory;
    
    // Filtro por precio
    const matchesPrice = 
      (priceRange.min === '' || product.price >= parseFloat(priceRange.min)) && 
      (priceRange.max === '' || product.price <= parseFloat(priceRange.max));
    
    // Filtro por disponibilidad
    const matchesStock = 
      stockFilter === 'all' || 
      (stockFilter === 'available' && product.available !== false) || 
      (stockFilter === 'unavailable' && product.available === false);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });
  
  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let compareA, compareB;
    
    // Determinar valores a comparar según criterio de ordenación
    switch (sortBy) {
      case 'price':
        compareA = a.price || 0;
        compareB = b.price || 0;
        break;
      case 'category':
        const catA = categories.find(cat => cat.id === a.category);
        const catB = categories.find(cat => cat.id === b.category);
        compareA = catA ? catA.name : '';
        compareB = catB ? catB.name : '';
        break;
      default: // 'name'
        compareA = a.name;
        compareB = b.name;
    }
    
    // Comparar según orden seleccionado
    if (sortOrder === 'asc') {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });
  
  // Paginación
  useEffect(() => {
    setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage));
  }, [sortedProducts, itemsPerPage]);
  
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Toggle selección de todos los productos de la página actual
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const pageProductIds = paginatedProducts.map(product => product.id);
      setSelectedProducts(pageProductIds);
    }
    setSelectAll(!selectAll);
  };
  
  // Toggle selección de un producto individual
  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  // Efecto para actualizar selectAll cuando cambia la selección
  useEffect(() => {
    const pageProductIds = paginatedProducts.map(product => product.id);
    const allSelected = pageProductIds.every(id => selectedProducts.includes(id));
    setSelectAll(allSelected && pageProductIds.length > 0);
  }, [selectedProducts, paginatedProducts]);
  
  // Estadísticas básicas
  const stats = {
    total: products.length,
    categories: categories.length,
    filtered: filteredProducts.length,
    selected: selectedProducts.length
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
  
  // Abrir modal para edición múltiple
  const handleBulkEdit = () => {
    if (selectedProducts.length === 0) {
      alert('Por favor, seleccione al menos un producto para editar');
      return;
    }
    setShowBulkEditModal(true);
  };
  
  // Acción masiva: cambiar disponibilidad
  const handleBulkAvailability = (available) => {
    if (selectedProducts.length === 0) return;
    
    const confirmed = window.confirm(
      `¿Está seguro de que desea marcar ${selectedProducts.length} productos como ${available ? 'disponibles' : 'no disponibles'}?`
    );
    
    if (!confirmed) return;
    
    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        handleSaveProduct({
          ...product,
          available: available
        });
      }
    });
    
    setSelectedProducts([]);
  };
  
  // Acción masiva: eliminar productos
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    
    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar ${selectedProducts.length} productos? Esta acción no se puede deshacer.`
    );
    
    if (!confirmed) return;
    
    selectedProducts.forEach(productId => {
      handleDeleteProduct(productId);
    });
    
    setSelectedProducts([]);
  };
  
  // Cambiar página
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Formatear número con separador de miles
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div>
      {/* Cabecera y filtros */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de productos
          {selectedProducts.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({selectedProducts.length} seleccionados)
            </span>
          )}
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
          
          <button 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} />
            <span>Filtrar</span>
            <ChevronDown size={14} />
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

      {/* Filtros avanzados (expandibles) */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Filtros avanzados</h3>
            <button 
              onClick={() => setShowAdvancedFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de precio */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rango de precio
              </label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  min="0"
                  step="0.01"
                />
                <span className="text-gray-500">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* Filtro de stock */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Disponibilidad
              </label>
              <select 
                className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">Todos los productos</option>
                <option value="available">Disponibles</option>
                <option value="unavailable">No disponibles</option>
              </select>
            </div>
            
            {/* Ordenación */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <div className="flex space-x-2">
                <select 
                  className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Nombre</option>
                  <option value="price">Precio</option>
                  <option value="category">Categoría</option>
                </select>
                <button 
                  className="border rounded-md px-2 text-sm focus:outline-none hover:bg-gray-100"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <button 
              className="bg-gray-200 text-gray-800 rounded-md px-3 py-1 text-xs font-medium hover:bg-gray-300 flex items-center space-x-1"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange({ min: '', max: '' });
                setStockFilter('all');
                setSortBy('name');
                setSortOrder('asc');
              }}
            >
              <RefreshCw size={12} />
              <span>Restablecer filtros</span>
            </button>
          </div>
        </div>
      )}

      {/* Filtros de categoría */}
      <div className="mb-6">
        <ProductCategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Estadísticas */}
      <div className="flex mb-6 overflow-x-auto pb-2">
        <div className="bg-white rounded-lg shadow p-4 mr-4 min-w-32">
          <p className="text-sm text-gray-500">Total de productos</p>
          <p className="text-2xl font-semibold">{formatNumber(stats.total)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mr-4 min-w-32">
          <p className="text-sm text-gray-500">Categorías</p>
          <p className="text-2xl font-semibold">{formatNumber(stats.categories)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mr-4 min-w-32">
          <p className="text-sm text-gray-500">Resultados</p>
          <p className="text-2xl font-semibold">{formatNumber(stats.filtered)}</p>
        </div>
        {selectedProducts.length > 0 && (
          <div className="bg-indigo-50 rounded-lg shadow p-4 min-w-32">
            <p className="text-sm text-indigo-600">Seleccionados</p>
            <p className="text-2xl font-semibold text-indigo-700">{formatNumber(stats.selected)}</p>
          </div>
        )}
      </div>

      {/* Acciones para edición masiva */}
      {selectedProducts.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 flex justify-between items-center">
          <div className="text-sm text-indigo-800">
            {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''} seleccionado{selectedProducts.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleBulkAvailability(true)}
              className="bg-white border border-indigo-600 text-indigo-600 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-indigo-50"
            >
              Marcar como disponibles
            </button>
            <button 
              onClick={() => handleBulkAvailability(false)}
              className="bg-white border border-indigo-600 text-indigo-600 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-indigo-50"
            >
              Marcar como no disponibles
            </button>
            <button 
              onClick={handleBulkEdit}
              className="bg-indigo-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-indigo-700"
            >
              Edición masiva
            </button>
            <button 
              onClick={handleBulkDelete}
              className="bg-red-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-red-700"
            >
              Eliminar seleccionados
            </button>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Cabecera de la tabla con checkbox para seleccionar todos */}
        <div className="flex items-center bg-gray-50 px-6 py-3 border-b">
          <div className="pr-4">
            <input 
              type="checkbox" 
              checked={selectAll}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 flex justify-between">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {paginatedProducts.length} producto{paginatedProducts.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center">
              <select 
                className="border border-gray-300 rounded-md text-xs px-2 py-1 mr-2"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
              <span className="text-xs text-gray-500 mr-2">
                Página {currentPage} de {totalPages || 1}
              </span>
              <div className="flex">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border border-gray-300 rounded-l-md px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border border-gray-300 border-l-0 rounded-r-md px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Componente ProductList existente con nuevas props */}
        <ProductList 
          products={paginatedProducts}
          categories={categories}
          onEditProduct={handleEditProduct}
          selectedProducts={selectedProducts}
          onToggleSelect={toggleSelectProduct}
        />
        
        {/* Paginación inferior */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="text-xs text-gray-700 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-gray-700"
            >
              Primera
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Lógica para mostrar 5 páginas alrededor de la actual
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md text-xs ${
                      currentPage === pageNum 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="text-xs text-gray-700 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-gray-700"
            >
              Última
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de producto */}
      {showProductModal && (
        <ProductModal
          onClose={() => setShowProductModal(false)}
          product={editingProduct}
          categories={categories}
        />
      )}
      
      {/* Modal de edición masiva */}
      {showBulkEditModal && (
        <BulkEditModal
          onClose={() => setShowBulkEditModal(false)}
          selectedProducts={selectedProducts}
          products={products}
          categories={categories}
          onUpdateProducts={() => setSelectedProducts([])}
        />
      )}
    </div>
  );
};

export default ProductsView;