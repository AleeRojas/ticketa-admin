import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

/**
 * Modal para crear y editar banners
 */
const BannerModal = ({ banner, onClose, onSave }) => {
  const initialFormData = banner || {
    id: null,
    title: '',
    image: null,
    active: true,
    targetUrl: '',
    displayFrom: '',
    displayTo: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  // Actualizar el formulario cuando cambian las props
  useEffect(() => {
    if (banner) {
      setFormData(banner);
    }
  }, [banner]);
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
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
          <h3 className="text-lg font-semibold">{banner ? 'Editar' : 'Nuevo'} Banner</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-500">Haz clic para subir o arrastra una imagen aquí</p>
              </div>
            </div>
            
            {/* URL de destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de destino</label>
              <input 
                type="text" 
                name="targetUrl"
                value={formData.targetUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            {/* Periodo de visualización */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input 
                  type="date" 
                  name="displayFrom"
                  value={formData.displayFrom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input 
                  type="date" 
                  name="displayTo"
                  value={formData.displayTo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            {/* Estado activo */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="banner-active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 rounded"
              />
              <label htmlFor="banner-active" className="ml-2 text-sm text-gray-700">Activo</label>
            </div>
          </div>
          
          {/* Botones de acción */}
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

export default BannerModal;