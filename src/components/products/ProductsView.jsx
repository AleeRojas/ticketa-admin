import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Tag, ChevronDown, Check, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import ProductList from './ProductList';
import ProductCategoryFilter from './ProductCategoryFilter';
import ProductModal from '../modals/ProductModal';
import BulkEditModal from '../modals/BulkEditModal';
import { useWooCommerceContext } from '../../context/WooCommerceContext';

/**
 * Vista principal de productos con paginación corregida
 */
const ProductsView = () => {
  // IMPORTANTE: Al estar usando dos contextos, necesitamos sincronizar los datos
  const { 
    handleSaveProduct,
    handleDeleteProduct
  } = useAppContext();
  
  // Contexto de WooCommerce para usar loadProducts con paginación
  const { 
    loadProducts, 
    products: wooProducts, // Importante: ahora usamos productos de WooCommerce directamente
    categories: wooCategories, // Importante: también usamos categorías de WooCommerce
    changePage: wooChangePage,
    pagination: wooPagination,
    productsLoading 
  } = useWooCommerceContext();
  
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
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Sincronizar con paginación de WooCommerce
  useEffect(() => {
    if (wooPagination) {
      console.log('ProductsView - Actualizando paginación:', wooPagination);
      setCurrentPage(wooPagination.currentPage);
      setTotalPages(wooPagination.totalPages);
      setTotalItems(wooPagination.totalItems);
      setItemsPerPage(wooPagination.perPage);
    }
  }, [wooPagination]);
  
  // Resetear selección cuando cambian los filtros
  useEffect(() => {
    setSelectedProducts([]);
    setSelectAll(false);
  }, [selectedCategory, searchTerm, priceRange, stockFilter]);
  
  // Construir parámetros para la API
  const buildApiParams = () => {
    const params = {
      page: currentPage,
      per_page: itemsPerPage
    };
    
    // Filtro por búsqueda
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    // Filtro por categoría
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    
    // Filtro por disponibilidad/estado
    if (stockFilter !== 'all') {
      params.status = stockFilter === 'available' ? 'publish' : 'draft';
    }
    
    // Ordenación
    if (sortBy === 'name') {
      params.orderby = 'title';
      params.order = sortOrder;
    } else if (sortBy === 'price') {
      params.orderby = 'price';
      params.order = sortOrder;
    }
    
    return params;
  };
  
  // Cargar productos con los filtros actuales
  const fetchProducts = async (params = {}) => {
    console.log("Cargando productos con parámetros:", params);
    try {
      // Aquí está la clave de la solución: estamos usando el resultado directamente
      const result = await loadProducts(params);
      console.log("Resultado de fetchProducts:", result);
      
      // El estado de los productos está actualizado en WooCommerceContext
      // y ahora usamos wooProducts en vez de products
      
      return result;
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };
  
  // Efecto para cargar productos al inicio
  useEffect(() => {
    console.log("Cargando productos iniciales");
    fetchProducts({ page: 1, per_page: itemsPerPage });
  }, []);
  
  // Manejar cambios en los filtros
  const handleFiltersChange = () => {
    console.log("Cambio en filtros, volviendo a página 1");
    fetchProducts({
      ...buildApiParams(),
      page: 1 // Siempre volver a la primera página al cambiar filtros
    });
  };
  
  // Observar cambios en filtros con un debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFiltersChange();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, stockFilter, sortBy, sortOrder]);
  
  // FUNCIÓN CRÍTICA: Cambiar de página
  const handlePageChange = (page) => {
    // Validaciones y logs
    console.log(`Navegación a página ${page} solicitada. Página actual: ${currentPage}, Total páginas: ${totalPages}`);
    
    if (page < 1 || (totalPages > 0 && page > totalPages) || productsLoading) {
      console.log(`Navegación cancelada: ${productsLoading ? 'Cargando...' : 'Página fuera de rango'}`);
      return;
    }
    
    // Actualizar UI inmediatamente
    setCurrentPage(page);
    
    // Crear parámetros específicos para esta navegación
    const params = {
      ...buildApiParams(),
      page: page
    };
    
    console.log(`Ejecutando navegación a página ${page} con parámetros:`, params);
    
    // Usar loadProducts directamente en lugar de wooChangePage
    // para asegurar que usamos los parámetros correctos
    loadProducts(params).then(result => {
      console.log(`Navegación a página ${page} completada:`, result);
    }).catch(error => {
      console.error(`Error en navegación a página ${page}:`, error);
    });
  };
  
  // Cambiar items por página
  const handleItemsPerPageChange = (perPage) => {
    console.log(`Cambiando a ${perPage} ítems por página`);
    setItemsPerPage(perPage);
    
    const params = {
      ...buildApiParams(),
      page: 1, // Volver a primera página cuando cambia items por página
      per_page: perPage
    };
    
    fetchProducts(params);
  };
  
  // Toggle selección de todos los productos
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const pageProductIds = wooProducts.map(product => product.id);
      setSelectedProducts(pageProductIds);
    }
    setSelectAll(!selectAll);
  };
  
  // Toggle selección de un producto
  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  // Actualizar selectAll cuando cambia la selección
  useEffect(() => {
    const pageProductIds = wooProducts.map(product => product.id);
    const allSelected = pageProductIds.length > 0 && pageProductIds.every(id => selectedProducts.includes(id));
    setSelectAll(allSelected);
  }, [selectedProducts, wooProducts]);
  
  // Estadísticas
  const stats = {
    total: totalItems || 0,
    categories: wooCategories.length,
    filtered: totalItems || 0,
    selected: selectedProducts.length
  };
  
  // Abrir modal para crear nuevo producto
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };
  
  // Abrir modal para editar producto
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
    
    const updatePromises = selectedProducts.map(productId => {
      const product = wooProducts.find(p => p.id === productId);
      if (product) {
        return handleSaveProduct({
          ...product,
          available: available
        });
      }
      return Promise.resolve();
    });
    
    Promise.all(updatePromises).then(() => {
      setSelectedProducts([]);
      fetchProducts(buildApiParams()); // Recargar productos
    });
  };
  
  // Acción masiva: eliminar productos
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    
    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar ${selectedProducts.length} productos? Esta acción no se puede deshacer.`
    );
    
    if (!confirmed) return;
    
    const deletePromises = selectedProducts.map(productId => {
      return handleDeleteProduct(productId);
    });
    
    Promise.all(deletePromises).then(() => {
      setSelectedProducts([]);
      fetchProducts(buildApiParams()); // Recargar productos
    });
  };
  
  // Formatear número con separador de miles
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Restablecer filtros
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setStockFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    
    // Recargar con valores predeterminados
    setCurrentPage(1);
    fetchProducts({ page: 1, per_page: itemsPerPage });
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

      {/* Información de depuración de paginación - Quitar en producción */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-2 mb-4 text-xs text-yellow-800">
        <p>Debug paginación: Página {currentPage} de {totalPages} | Total items: {totalItems} | Por página: {itemsPerPage}</p>
        <p>Productos actuales: {wooProducts.length}</p>
      </div>

      {/* Filtros avanzados */}
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
              onClick={handleResetFilters}
            >
              <RefreshCw size={12} />
              <span>Restablecer filtros</span>
            </button>
          </div>
        </div>
      )}

      {/* Filtro de categorías */}
      <div className="mb-6">
        <ProductCategoryFilter 
          categories={wooCategories}
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
        {/* Cabecera de la tabla */}
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
              {productsLoading ? 'Cargando...' : `${wooProducts.length} productos`}
            </div>
            <div className="flex items-center">
              <select 
                className="border border-gray-300 rounded-md text-xs px-2 py-1 mr-2"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                disabled={productsLoading}
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
              <span className="text-xs text-gray-500 mr-2">
                Página {currentPage} de {totalPages || 1}
              </span>
              
              {/* NAVEGACIÓN DE PÁGINAS */}
              <div className="flex">
                {/* Botón para página anterior */}
                <button 
                  onClick={() => {
                    console.log("Navegando a página anterior:", currentPage - 1);
                    handlePageChange(currentPage - 1);
                  }}
                  disabled={currentPage <= 1 || productsLoading}
                  className="border border-gray-300 rounded-l-md px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                {/* Botón para página siguiente */}
                <button 
                  onClick={() => {
                    console.log("Navegando a página siguiente:", currentPage + 1);
                    handlePageChange(currentPage + 1);
                  }}
                  disabled={currentPage >= totalPages || productsLoading}
                  className="border border-gray-300 border-l-0 rounded-r-md px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicador de carga */}
        {productsLoading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        )}
        
        {/* Lista de productos */}
        {!productsLoading && wooProducts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No se encontraron productos</h3>
            <p className="text-gray-500 mt-1">Prueba a cambiar los filtros o a crear nuevos productos</p>
          </div>
        ) : (
          <>
            {!productsLoading && wooProducts.length > 0 && (
              <ProductList 
                products={wooProducts}
                categories={wooCategories}
                onEditProduct={handleEditProduct}
                selectedProducts={selectedProducts}
                onToggleSelect={toggleSelectProduct}
              />
            )}
          </>
        )}
        
        {/* PAGINACIÓN INFERIOR */}
        {totalPages > 1 && !productsLoading && (
          <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
              className="text-xs text-gray-700 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-gray-700"
            >
              Primera
            </button>
            
            <div className="flex space-x-1">
              {/* Números de página */}
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
              disabled={currentPage >= totalPages}
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
          categories={wooCategories}
        />
      )}
      
      {/* Modal de edición masiva */}
      {showBulkEditModal && (
        <BulkEditModal
          onClose={() => setShowBulkEditModal(false)}
          selectedProducts={selectedProducts}
          products={wooProducts}
          categories={wooCategories}
          onUpdateProducts={() => {
            setSelectedProducts([]);
            fetchProducts(buildApiParams()); // Recargar después de la edición masiva
          }}
        />
      )}
    </div>
  );
};

export default ProductsView;