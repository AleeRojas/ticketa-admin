import React from 'react';
import { Edit, Trash, Eye, ExternalLink, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente que muestra la lista de productos con soporte para selección múltiple
 * Mejorado para visualización responsiva en dispositivos móviles
 */
const ProductList = ({ 
  products, 
  categories, 
  onEditProduct, 
  onViewProduct = () => {},
  selectedProducts = [], 
  onToggleSelect = () => {} 
}) => {
  const { handleDeleteProduct } = useAppContext();
  
  // Función para obtener el nombre de la categoría a partir de su ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };
  
  // Formatear número con separador de miles (formato chileno)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Formatear precio con símbolo de moneda chilena
  const formatPrice = (price) => {
    return "$" + formatNumber(parseFloat(price).toFixed(0));
  };

  // Procesar descripción HTML y extraer texto plano
  const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  // Si no hay productos, mostrar mensaje
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700">No se encontraron productos</h3>
        <p className="text-gray-500 mt-1">Prueba a cambiar los filtros o a crear nuevos productos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Vista de escritorio: Tabla tradicional (se oculta en móvil) */}
      <div className="hidden md:block">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  checked={products.length > 0 && products.every(p => selectedProducts.includes(p.id))}
                  onChange={() => {
                    const allSelected = products.every(p => selectedProducts.includes(p.id));
                    if (allSelected) {
                      // Deseleccionar todos
                      products.forEach(p => onToggleSelect(p.id));
                    } else {
                      // Seleccionar todos
                      products.filter(p => !selectedProducts.includes(p.id))
                        .forEach(p => onToggleSelect(p.id));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio / Costo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onToggleSelect(product.id)}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-xl mr-3">
                      {product.emoji || '🍽️'}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.featured && (
                          <Star size={14} className="ml-1 text-amber-500" />
                        )}
                        {product.wooId && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-800">
                            Woo
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">
                          {stripHtml(product.description)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium">
                    {getCategoryName(product.category)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</div>
                  {product.cost > 0 && (
                    <div className="text-xs text-gray-500">
                      Costo: {formatPrice(product.cost)}
                      <span className={`ml-1 ${
                        (((product.price - product.cost) / product.price) * 100) >= 30 
                          ? 'text-emerald-600' 
                          : (((product.price - product.cost) / product.price) * 100) >= 15 
                            ? 'text-amber-600' 
                            : 'text-red-600'
                      }`}>
                        ({(((product.price - product.cost) / product.price) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-4 py-4 text-right">
                  {product.stock !== undefined ? (
                    <span className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-emerald-600' : 
                      product.stock > 0 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {product.stock}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.available !== false 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.available !== false ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {product.wooId && (
                      <button 
                        title="Ver en WooCommerce"
                        className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50"
                        onClick={() => window.open(`/wp-admin/post.php?post=${product.wooId}&action=edit`, '_blank')}
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onViewProduct(product)}
                      title="Ver detalles"
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => onEditProduct(product)}
                      title="Editar producto"
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`¿Está seguro de que desea eliminar "${product.name}"?`)) {
                          handleDeleteProduct(product.id);
                        }
                      }}
                      title="Eliminar producto"
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil: Cards apiladas (se muestra solo en móvil) */}
      <div className="md:hidden">
        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
          <input 
            type="checkbox" 
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
            checked={products.length > 0 && products.every(p => selectedProducts.includes(p.id))}
            onChange={() => {
              const allSelected = products.every(p => selectedProducts.includes(p.id));
              if (allSelected) {
                // Deseleccionar todos
                products.forEach(p => onToggleSelect(p.id));
              } else {
                // Seleccionar todos
                products.filter(p => !selectedProducts.includes(p.id))
                  .forEach(p => onToggleSelect(p.id));
              }
            }}
          />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Seleccionar todo
          </span>
        </div>
        <div className="divide-y divide-gray-200">
          {products.map(product => (
            <div key={product.id} className="p-4 hover:bg-gray-50">
              {/* Header con checkbox y acciones */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onToggleSelect(product.id)}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300 mr-3"
                  />
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-xl">
                    {product.emoji || '🍽️'}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {product.wooId && (
                    <button 
                      title="Ver en WooCommerce"
                      className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50"
                      onClick={() => window.open(`/wp-admin/post.php?post=${product.wooId}&action=edit`, '_blank')}
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => onViewProduct(product)}
                    title="Ver detalles"
                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => onEditProduct(product)}
                    title="Editar producto"
                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`¿Está seguro de que desea eliminar "${product.name}"?`)) {
                        handleDeleteProduct(product.id);
                      }
                    }}
                    title="Eliminar producto"
                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              
              {/* Información del producto */}
              <div className="ml-7 pl-3 border-l-2 border-gray-100">
                {/* Nombre y etiquetas */}
                <div className="flex items-center flex-wrap mb-1">
                  <div className="text-sm font-medium text-gray-900 mr-1">{product.name}</div>
                  {product.featured && (
                    <Star size={14} className="text-amber-500 mr-1" />
                  )}
                  {product.wooId && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-800 mr-1">
                      Woo
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium mt-1">
                    {getCategoryName(product.category)}
                  </span>
                </div>
                
                {/* Descripción */}
                {product.description && (
                  <div className="text-xs text-gray-500 mt-1 mb-2 line-clamp-2">
                    {stripHtml(product.description)}
                  </div>
                )}
                
                {/* Detalles en grid de 2 columnas */}
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  {/* Precio y Costo */}
                  <div>
                    <span className="text-xs text-gray-500">Precio:</span>
                    <div className="font-medium text-gray-900">{formatPrice(product.price)}</div>
                    {product.cost > 0 && (
                      <div className="text-xs text-gray-500">
                        Costo: {formatPrice(product.cost)}
                        <span className={`ml-1 ${
                          (((product.price - product.cost) / product.price) * 100) >= 30 
                            ? 'text-emerald-600' 
                            : (((product.price - product.cost) / product.price) * 100) >= 15 
                              ? 'text-amber-600' 
                              : 'text-red-600'
                        }`}>
                          ({(((product.price - product.cost) / product.price) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Stock y Estado */}
                  <div className="text-right">
                    <div>
                      <span className="text-xs text-gray-500">Stock: </span>
                      {product.stock !== undefined ? (
                        <span className={`font-medium ${
                          product.stock > 10 ? 'text-emerald-600' : 
                          product.stock > 0 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {product.stock}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.available !== false 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.available !== false ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;