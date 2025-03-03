import React from 'react';
import { Tag } from 'lucide-react';

/**
 * Componente para filtrar productos por categoría
 */
const ProductCategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          selectedCategory === 'all'
            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Todas las categorías
      </button>
      
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
            selectedCategory === category.id
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Tag size={14} className="mr-1" />
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default ProductCategoryFilter;
