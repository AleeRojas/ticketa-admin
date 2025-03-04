import React from 'react';
import { Wifi, WifiOff, Cloud, AlertCircle } from 'lucide-react';
import { useWooCommerceContext } from '../../context/WooCommerceContext';

/**
 * Componente que muestra el estado de la conexión a Internet
 * y las operaciones pendientes para sincronizar
 */
const NetworkStatus = () => {
  const { 
    isOnline, 
    syncEnabled, 
    pendingOperations = [],
    performSync
  } = useWooCommerceContext();
  
  // No mostrar si la sincronización está desactivada
  if (!syncEnabled) return null;
  
  // Función para mostrar un resumen de operaciones pendientes
  const getPendingSummary = () => {
    const counts = pendingOperations.reduce((acc, op) => {
      acc[op.entity] = (acc[op.entity] || 0) + 1;
      return acc;
    }, {});
    
    const parts = [];
    if (counts.product) parts.push(`${counts.product} productos`);
    if (counts.category) parts.push(`${counts.category} categorías`);
    if (counts.order) parts.push(`${counts.order} pedidos`);
    
    return parts.join(', ');
  };
  
  return (
    <div className={`fixed bottom-4 right-4 shadow-lg rounded-lg overflow-hidden ${
      isOnline ? 'bg-emerald-50' : 'bg-amber-50'
    }`}>
      {pendingOperations.length > 0 && (
        <div className="px-4 py-2 bg-amber-100 text-amber-800 text-xs font-medium">
          <div className="flex items-center">
            <AlertCircle size={12} className="mr-1" />
            <span>
              {pendingOperations.length} {pendingOperations.length === 1 ? 'cambio' : 'cambios'} pendiente{pendingOperations.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="mt-1 text-xs text-amber-700">
            {getPendingSummary()}
          </div>
        </div>
      )}
      
      <div className="px-4 py-3 flex items-center">
        <div className={`p-2 rounded-full ${
          isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
        }`}>
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        </div>
        
        <div className="ml-3">
          <div className="font-medium text-sm">
            {isOnline ? 'Conectado' : 'Sin conexión'}
          </div>
          <div className="text-xs text-gray-500">
            {isOnline ? 
              pendingOperations.length > 0 ? 
                'Sincronizando en segundo plano...' : 
                'Todos los datos están sincronizados' : 
              'Los cambios se sincronizarán cuando vuelva la conexión'}
          </div>
        </div>
        
        {isOnline && pendingOperations.length > 0 && (
          <button 
            onClick={performSync}
            className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium hover:bg-indigo-200"
          >
            Sincronizar ahora
          </button>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;