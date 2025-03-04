import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { useWooCommerceContext } from '../../context/WooCommerceContext';

/**
 * Modal para resolver conflictos de datos entre versiones locales y de WooCommerce
 */
const ConflictResolutionModal = () => {
  const { 
    conflicts, 
    showConflictModal, 
    setShowConflictModal, 
    resolveConflicts 
  } = useWooCommerceContext();
  
  // Opciones de resolución para cada conflicto
  const [resolutions, setResolutions] = useState([]);
  
  // Actualizar las resoluciones cuando cambian los conflictos
  useEffect(() => {
    setResolutions(conflicts.map(conflict => ({
      id: conflict.id,
      entityType: conflict.entityType,
      useLocal: true // Por defecto, mantener los cambios locales
    })));
  }, [conflicts]);
  
  // Manejar cambio de la opción de resolución
  const handleResolutionChange = (index, useLocal) => {
    const newResolutions = [...resolutions];
    newResolutions[index].useLocal = useLocal;
    setResolutions(newResolutions);
  };
  
  // Aplicar las resoluciones
  const handleApply = () => {
    resolveConflicts(resolutions);
    setShowConflictModal(false);
  };
  
  // Si no hay modal abierto, no mostrar nada
  if (!showConflictModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div className="flex items-center">
            <AlertTriangle size={24} className="text-amber-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Conflictos de sincronización
            </h3>
          </div>
          <button 
            onClick={() => setShowConflictModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4 bg-amber-50 p-3 rounded-md text-sm text-amber-800">
          Se han detectado diferencias entre tus datos locales y los datos en WooCommerce.
          Por favor, elige qué versión deseas conservar para cada elemento.
        </div>
        
        {conflicts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay conflictos para resolver
          </div>
        ) : (
          <div className="space-y-4">
            {conflicts.map((conflict, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {conflict.entityType === 'product' ? 'Producto' :
                       conflict.entityType === 'order' ? 'Pedido' :
                       conflict.entityType === 'category' ? 'Categoría' : 'Elemento'}: {conflict.name || conflict.id}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {
                        conflict.localData && conflict.remoteData
                          ? `Local (${new Date(conflict.localUpdated).toLocaleString()}) vs WooCommerce (${new Date(conflict.remoteUpdated).toLocaleString()})`
                          : conflict.localData 
                            ? 'Existe localmente pero no en WooCommerce' 
                            : 'Existe en WooCommerce pero no localmente'
                      }
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleResolutionChange(index, true)}
                      className={`px-3 py-1 text-xs font-medium rounded flex items-center ${
                        resolutions[index]?.useLocal 
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      {resolutions[index]?.useLocal && (
                        <Check size={12} className="mr-1" />
                      )}
                      Usar local
                    </button>
                    
                    <button
                      onClick={() => handleResolutionChange(index, false)}
                      className={`px-3 py-1 text-xs font-medium rounded flex items-center ${
                        !resolutions[index]?.useLocal 
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      {!resolutions[index]?.useLocal && (
                        <Check size={12} className="mr-1" />
                      )}
                      Usar WooCommerce
                    </button>
                  </div>
                </div>
                
                {/* Mostrar diferencias */}
                {conflict.differences && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    <p className="font-medium mb-2">Diferencias:</p>
                    <ul className="space-y-1 text-xs">
                      {Object.entries(conflict.differences).map(([field, values]) => (
                        <li key={field} className="flex">
                          <span className="w-1/3 font-medium">{field}:</span>
                          <div className="w-2/3 flex">
                            <span className="w-1/2 px-2 py-1 bg-red-50 text-red-800 rounded mr-1">
                              {typeof values.local === 'object' 
                                ? JSON.stringify(values.local) 
                                : String(values.local)}
                            </span>
                            <span className="w-1/2 px-2 py-1 bg-green-50 text-green-800 rounded">
                              {typeof values.remote === 'object' 
                                ? JSON.stringify(values.remote) 
                                : String(values.remote)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => setShowConflictModal(false)}
            className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 mr-2"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleApply}
            className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Aplicar resoluciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;