import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal para crear y editar popups promocionales
 */
const PopupModal = ({ popup, onClose, onSave }) => {
  // Estado inicial del formulario
  const initialState = popup || {
    id: null,
    title: '',
    content: '',
    active: true,
    displayFrom: '',
    displayTo: ''
  };
  
  // Estado del formulario
  const [formData, setFormData] = useState(initialState);
  
  // Actualizar formulario cuando cambia el popup en edición
  useEffect(() => {
    if (popup) {
      setFormData({ ...popup });
    } else {
      setFormData(initialState);
    }
  }, [popup]);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{popup ? 'Editar' : 'Nuevo'} Popup</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input 
                type="text" 
                name="title"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea 
                name="content"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input 
                  type="date" 
                  name="displayFrom"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.displayFrom}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input 
                  type="date" 
                  name="displayTo"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.displayTo}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="popup-active" 
                name="active"
                className="h-4 w-4 text-indigo-600 rounded"
                checked={formData.active}
                onChange={handleChange}
              />
              <label htmlFor="popup-active" className="ml-2 text-sm text-gray-700">Activo</label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            
            <button 
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupModal;