import React, { useState, useEffect } from 'react';
import { X, Save, Trash } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Modal para crear y editar mesas
 */
const TableModal = () => {
  const { 
    showTableModal, 
    setShowTableModal, 
    editingTable, 
    salones,
    handleSaveTable,
    handleDeleteTable
  } = useAppContext();
  
  // Estado local del formulario
  const [tableData, setTableData] = useState(
    editingTable ? { ...editingTable } : {
      number: '', 
      status: 'libre', 
      time: '00:00',
      salon: salones[0]?.id || '',
      x: 50,
      y: 50,
      seats: 4,
      shape: 'circle'
    }
  );
  
  // Actualizar estado local cuando cambia la mesa en edición
  useEffect(() => {
    if (editingTable) {
      setTableData({ ...editingTable });
    } else {
      setTableData({
        number: '', 
        status: 'libre', 
        time: '00:00',
        salon: salones[0]?.id || '',
        x: 50,
        y: 50,
        seats: 4,
        shape: 'circle'
      });
    }
  }, [editingTable, salones]);
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTableData({
      ...tableData,
      [name]: name === 'number' || name === 'seats' ? 
        parseInt(value, 10) || 0 : 
        name === 'x' || name === 'y' ? 
          parseInt(value, 10) || 0 : 
          value
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveTable(tableData);
  };
  
  // Manejar eliminación de mesa
  const handleDelete = () => {
    if (editingTable && confirm('¿Está seguro de que desea eliminar esta mesa?')) {
      handleDeleteTable(editingTable.id);
    }
  };
  
  // Si el modal no está visible, no renderizar nada
  if (!showTableModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            {editingTable ? 'Editar Mesa' : 'Añadir Mesa'}
          </h3>
          <button 
            onClick={() => setShowTableModal(false)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Número de mesa
              </label>
              <input
                type="number"
                name="number"
                value={tableData.number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Salón
              </label>
              <select
                name="salon"
                value={tableData.salon}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {salones.map(salon => (
                  <option key={salon.id} value={salon.id}>
                    {salon.icon} {salon.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Capacidad (personas)
              </label>
              <input
                type="number"
                name="seats"
                value={tableData.seats}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Forma
              </label>
              <select
                name="shape"
                value={tableData.shape}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="circle">Circular</option>
                <option value="rect">Rectangular</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Posición X (%)
              </label>
              <input
                type="number"
                name="x"
                value={tableData.x}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Posición Y (%)
              </label>
              <input
                type="number"
                name="y"
                value={tableData.y}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              value={tableData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="libre">Libre</option>
              <option value="ocupada">Ocupada</option>
              <option value="pagando">Pagando</option>
              <option value="reservada">Reservada</option>
            </select>
          </div>
          
          <div className="flex flex-col-reverse md:flex-row md:justify-between mt-4 md:mt-6 gap-2">
            {editingTable && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white rounded-md px-4 py-2 text-xs md:text-sm font-medium hover:bg-red-700 flex items-center justify-center md:justify-start"
              >
                <Trash size={14} className="mr-1 md:mr-2" />
                Eliminar Mesa
              </button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-md px-4 py-2 text-xs md:text-sm font-medium hover:bg-indigo-700 flex items-center justify-center flex-1 md:flex-initial"
              >
                <Save size={14} className="mr-1 md:mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableModal;
