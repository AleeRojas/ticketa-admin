import React, { useState, useEffect } from 'react';
import { X, Save, Trash } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Modal para crear y editar salones
 */
const SalonModal = () => {
  const { 
    showSalonModal, 
    setShowSalonModal, 
    editingSalon, 
    salones,
    handleSaveSalon,
    handleDeleteSalon
  } = useAppContext();
  
  // Estado local del formulario
  const [salonData, setSalonData] = useState(
    editingSalon ? { ...editingSalon } : {
      id: '',
      name: '',
      icon: '🍽️'
    }
  );
  
  // Iconos disponibles
  const availableIcons = ['🍽️', '☀️', '🌙', '🍸', '🍔', '🍕'];
  
  // Actualizar estado local cuando cambia el salón en edición
  useEffect(() => {
    if (editingSalon) {
      setSalonData({ ...editingSalon });
    } else {
      setSalonData({
        id: '',
        name: '',
        icon: '🍽️'
      });
    }
  }, [editingSalon]);
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalonData({
      ...salonData,
      [name]: value
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el ID no esté duplicado si es un nuevo salón
    if (!editingSalon && salones.some(s => s.id === salonData.id)) {
      alert('Ya existe un salón con este ID. Por favor elija otro.');
      return;
    }
    
    handleSaveSalon(salonData);
  };
  
  // Manejar eliminación del salón
  const handleDelete = () => {
    if (editingSalon) {
      handleDeleteSalon(editingSalon.id);
    }
  };
  
  // Si el modal no está visible, no renderizar nada
  if (!showSalonModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingSalon ? 'Editar Salón' : 'Añadir Salón'}
          </h3>
          <button 
            onClick={() => setShowSalonModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID del salón
            </label>
            <input
              type="text"
              name="id"
              value={salonData.id}
              onChange={handleChange}
              disabled={editingSalon !== null}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              required
            />
            {!editingSalon && (
              <p className="text-xs text-gray-500 mt-1">
                Identificador único para el salón. No se podrá cambiar después.
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del salón
            </label>
            <input
              type="text"
              name="name"
              value={salonData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icono
            </label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSalonData({ ...salonData, icon })}
                  className={`h-10 w-10 flex items-center justify-center text-xl rounded-md ${
                    salonData.icon === icon ? 'bg-indigo-100 border-2 border-indigo-500' : 'border border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            {editingSalon && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Eliminar Salón
              </button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={() => setShowSalonModal(false)}
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

export default SalonModal;
