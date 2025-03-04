import React from 'react';
import { Edit, Trash, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente que muestra la lista de productos
 */
const ProductList = ({ products, categories, onEditProduct }) => {
  const { handleDeleteProduct } = useAppContext();
  
  // Función para obtener el nombre de la categoría a partir de su ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin categoría';
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                    {product.emoji || '🍽️'}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500">{product.description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {getCategoryName(product.category)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">{product.price} </div>
                {product.cost && (
                  <div className="text-xs text-gray-500">
                    Coste: {product.cost}  
                    <span className="ml-1 text-emerald-600">
                      ({(((product.price - product.cost) / product.price) * 100).toFixed(0)}% margen)
                    </span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.available ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.available !== false ? 'Disponible' : 'No disponible'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('¿Está seguro de que desea eliminar este producto?')) {
                        handleDeleteProduct(product.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
