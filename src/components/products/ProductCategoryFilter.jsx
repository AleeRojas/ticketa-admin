import React, { useState, useRef, useEffect } from 'react';
import { Tag, ChevronDown } from 'lucide-react';

/**
 * Componente para filtrar productos por categoría usando un menú desplegable
 */
const ProductCategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener el nombre de la categoría seleccionada
  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') {
      return 'Todas las categorías';
    }
    
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.name : 'Todas las categorías';
  };

  return (
    <div className="relative mb-6" ref={dropdownRef}>
      {/* Botón principal del desplegable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-64 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <div className="flex items-center">
          <Tag size={16} className="mr-2 text-indigo-500" />
          <span className="text-sm font-medium truncate">
            {getSelectedCategoryName()}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute z-10 w-full md:w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {/* Opción para todas las categorías */}
          <button
            onClick={() => {
              onCategoryChange('all');
              setIsOpen(false);
            }}
            className={`flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
              selectedCategory === 'all' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
            }`}
          >
            Todas las categorías
          </button>
          
          {/* Separador */}
          <div className="border-t border-gray-100 my-1"></div>
          
          {/* Lista de categorías */}
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                selectedCategory === category.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
              }`}
            >
              <Tag size={14} className="mr-2" />
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategoryFilter;