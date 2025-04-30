import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

/**
 * Modal para crear y editar publicaciones en redes sociales
 */
const PostModal = ({ post, onClose, onSave }) => {
  // Estado inicial del formulario
  const initialState = post || {
    id: null,
    title: '',
    content: '',
    image: null,
    platforms: [],
    scheduled: '',
    status: 'draft'
  };
  
  // Estado del formulario
  const [formData, setFormData] = useState(initialState);
  
  // Actualizar formulario cuando cambia el post en edición
  useEffect(() => {
    if (post) {
      setFormData({ ...post });
    } else {
      setFormData(initialState);
    }
  }, [post]);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'platform') {
      // Manejar checkboxes de plataformas
      const platform = e.target.value;
      let updatedPlatforms = [...formData.platforms];
      
      if (checked) {
        // Añadir plataforma si no existe
        if (!updatedPlatforms.includes(platform)) {
          updatedPlatforms.push(platform);
        }
      } else {
        // Eliminar plataforma
        updatedPlatforms = updatedPlatforms.filter(p => p !== platform);
      }
      
      setFormData({
        ...formData,
        platforms: updatedPlatforms
      });
    } else {
      // Manejar otros campos
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
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
          <h3 className="text-lg font-semibold">{post ? 'Editar' : 'Nueva'} Publicación</h3>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-500">Haz clic para subir o arrastra una imagen aquí</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plataformas</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="platform-instagram" 
                    name="platform"
                    value="instagram"
                    className="h-4 w-4 text-indigo-600 rounded"
                    checked={formData.platforms.includes('instagram')}
                    onChange={handleChange}
                  />
                  <label htmlFor="platform-instagram" className="ml-2 text-sm text-gray-700">Instagram</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="platform-facebook" 
                    name="platform"
                    value="facebook"
                    className="h-4 w-4 text-indigo-600 rounded"
                    checked={formData.platforms.includes('facebook')}
                    onChange={handleChange}
                  />
                  <label htmlFor="platform-facebook" className="ml-2 text-sm text-gray-700">Facebook</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="platform-twitter" 
                    name="platform"
                    value="twitter"
                    className="h-4 w-4 text-indigo-600 rounded"
                    checked={formData.platforms.includes('twitter')}
                    onChange={handleChange}
                  />
                  <label htmlFor="platform-twitter" className="ml-2 text-sm text-gray-700">Twitter</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programado para</label>
              <input 
                type="datetime-local" 
                name="scheduled"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.scheduled}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Borrador</option>
                <option value="scheduled">Programado</option>
                <option value="published">Publicado</option>
              </select>
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
              {formData.status === 'draft' ? 'Guardar borrador' : 
               formData.status === 'scheduled' ? 'Programar publicación' : 
               'Publicar ahora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;