import React from 'react';
import { Edit, Trash, Eye, ExternalLink, Star, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Componente de tarjeta para productos en vista móvil
 */
const ProductCardItem = ({ 
  product, 
  expandedProduct, 
  setExpandedProduct, 
  handleViewProduct, 
  handleEditProduct, 
  handleDeleteProduct,
  getCategoryName,
  formatPrice,
  stripHtml 
}) => {
  return (
    <div className="py-3">
      <div className="flex items-start">
        <input 
          type="checkbox" 
          checked={false} // Reemplazar por lógica de selección
          onChange={() => {}} // Reemplazar por función de toggle
          className="h-4 w-4 text-indigo-600 rounded border-gray-300 mt-1 mr-2 flex-shrink-0"
        />
      
        <div className="flex-1">
          {/* Cabecera de la tarjeta */}
          <div className="flex items-start mb-1">
            <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-xl mr-2">
              {product.emoji || '🍽️'}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900 mr-1">{product.name}</div>
                  {product.featured && <Star size={12} className="text-amber-500" />}
                  {product.wooId && (
                    <span className="ml-1 px-1 py-0.5 text-xxs rounded bg-purple-100 text-purple-800">
                      Woo
                    </span>
                  )}
                </div>
                
                <div className="flex items-center">
                  {/* Status icon instead of text label */}
                  <div className={`w-2.5 h-2.5 rounded-full mr-1 ${
                    product.available !== false 
                      ? 'bg-emerald-500' 
                      : 'bg-gray-400'
                  }`}></div>
                  {expandedProduct === product.id ? 
                    <ChevronUp size={16} onClick={() => setExpandedProduct(null)} className="text-gray-400 cursor-pointer" /> :
                    <ChevronDown size={16} onClick={() => setExpandedProduct(product.id)} className="text-gray-400 cursor-pointer" />
                  }
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium px-1.5 py-0.5">
                  {getCategoryName(product.category)}
                </span>
                <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
              </div>
            </div>
          </div>
          
          {/* Contenido expandible */}
          {expandedProduct === product.id && (
            <div className="mt-2 pl-12 text-xs text-gray-500 space-y-1">
              {product.description && (
                <div className="mb-1">
                  {stripHtml(product.description)}
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Stock:</span>
                <span className={product.stock > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                  {product.stock !== undefined ? product.stock : '—'}
                </span>
              </div>
              
              {product.cost > 0 && (
                <div className="flex justify-between">
                  <span>Costo:</span>
                  <div>
                    {formatPrice(product.cost)}
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
                </div>
              )}
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-1 mt-2">
            {product.wooId && (
              <button 
                title="Ver en WooCommerce"
                className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50"
                onClick={() => window.open(`/wp-admin/post.php?post=${product.wooId}&action=edit`, '_blank')}
              >
                <ExternalLink size={14} />
              </button>
            )}
            <button 
              onClick={() => handleViewProduct(product)}
              title="Ver detalles"
              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
            >
              <Eye size={14} />
            </button>
            <button 
              onClick={() => handleEditProduct(product)}
              title="Editar producto"
              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
            >
              <Edit size={14} />
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
              <Trash size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardItem;