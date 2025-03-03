import React, { useState, useEffect } from 'react';
import { X, Save, Trash } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Modal para crear y editar categorías de productos
 */
const ProductCategoryModal = ({ onClose, category }) => {
  const { handleSaveCategory, handleDeleteCategory } = useAppContext();
  
  // Estado inicial del formulario
  const initialState = category ? { ...category } : {
    id: '',
    name: '',
    description: '',
    icon: '🍽️'
  };
  
  // Estado del formulario
  const [formData, setFormData] = useState(initialState);
  
  // Lista de iconos para categorías
  const categoryIcons = ['🍽️', '🍗', '🥗', '🍕', '🍰', '🍹', '☕', '🍷', '🍺', '🍴', '🥘', '🍲', '🍛', '🍱'];
  
  // Resetear el formulario cuando cambia la categoría
  useEffect(() => {
    if (category) {
      setFormData({ ...category });
    } else {
      setFormData(initialState);
    }
  }, [category]);
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Generar ID a partir del nombre (solo para nuevas categorías)
  const generateId = (name) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
  
  // Manejar cambio en el nombre (generar ID)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      name: newName,
      // Solo generar nuevo ID si es una nueva categoría
      ...(category ? {} : { id: generateId(newName) })
    });
  };
  
  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveCategory(formData);
    onClose();
  };
  
  // Manejar la eliminación de la categoría
  const handleDelete = () => {
    if (category && confirm('¿Está seguro de que desea eliminar esta categoría? Esta acción también podría afectar a los productos asociados.')) {
      handleDeleteCategory(category.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          {!category && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID (generado automáticamente)
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Este identificador se usa internamente y no se puede cambiar una vez creado.
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icono
            </label>
            <div className="grid grid-cols-7 gap-2">
              {categoryIcons.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`h-10 w-10 flex items-center justify-center text-xl rounded-md ${
                    formData.icon === icon 
                      ? 'bg-indigo-100 border-2 border-indigo-500' 
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            {category && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Eliminar Categoría
              </button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center"
              >
                <Save size={16} className="mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCategoryModal;