import React, { useState } from 'react';
import { RefreshCw, Settings, WifiOff, Check, AlertTriangle } from 'lucide-react';
import { useWooCommerceContext } from '../../context/WooCommerceContext';

/**
 * Componente para mostrar y gestionar el estado de sincronización con WooCommerce
 */
const WooSyncStatus = () => {
  const { 
    syncEnabled,
    syncing,
    lastSyncTime,
    performSync,
    toggleSync,
    syncConfig,
    updateSyncConfig,
    checkConnection,
    productsLoading,
    productsError,
    ordersLoading,
    ordersError
  } = useWooCommerceContext();
  
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  
  // Comprobar conexión con WooCommerce
  const handleCheckConnection = async () => {
    setChecking(true);
    const status = await checkConnection();
    setConnectionStatus(status);
    setChecking(false);
  };
  
  // Formatear tiempo de última sincronización
  const formatLastSync = () => {
    if (!lastSyncTime) return 'Nunca';
    
    // Si fue hoy, mostrar la hora
    if (lastSyncTime.toDateString() === new Date().toDateString()) {
      return `Hoy a las ${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Si fue en la última semana, mostrar el día
    const diffDays = Math.round((new Date() - lastSyncTime) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    }
    
    // Si fue hace más de una semana, mostrar la fecha completa
    return lastSyncTime.toLocaleDateString();
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
          <h3 className="text-sm md:text-base font-medium">Sincronización</h3>
          {connectionStatus === true && (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full flex items-center">
              <Check size={10} className="mr-1" />
              Conectado
            </span>
          )}
          {connectionStatus === false && (
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full flex items-center">
              <WifiOff size={10} className="mr-1" />
              Sin conexión
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <Settings size={16} />
          </button>
          
          <button 
            onClick={handleCheckConnection}
            disabled={checking}
            className={`p-1 rounded-full ${
              checking 
                ? 'text-gray-400 bg-gray-100' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <WifiOff size={16} className={checking ? 'animate-pulse' : ''} />
          </button>
          
          <button 
            onClick={performSync}
            disabled={syncing || !syncEnabled}
            className={`p-1 rounded-full ${
              syncing 
                ? 'text-indigo-400 bg-indigo-50' 
                : !syncEnabled 
                  ? 'text-gray-400 bg-gray-100' 
                  : 'text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={() => toggleSync()}
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              syncEnabled 
                ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {syncEnabled ? 'Activado' : 'Desactivado'}
          </button>
        </div>
      </div>
      
      {showSettings && (
        <div className="mt-3 border-t pt-3">
          <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-2">Configuración de sincronización</h4>
          
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-1">
              <input
                type="checkbox"
                id="autoSync"
                checked={syncConfig.autoSync}
                onChange={e => updateSyncConfig({ autoSync: e.target.checked })}
                className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="autoSync" className="ml-1 text-xs md:text-sm text-gray-700">Sincronización automática</label>
              
              {syncConfig.autoSync && (
                <div className="ml-auto flex items-center">
                  <span className="text-xs md:text-sm text-gray-500 mr-1 md:mr-2">Cada</span>
                  <select
                    value={syncConfig.syncInterval}
                    onChange={e => updateSyncConfig({ syncInterval: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded px-1 md:px-2 py-0.5 md:py-1 text-xs md:text-sm"
                  >
                    <option value="1">1 min</option>
                    <option value="5">5 min</option>
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="60">1 hora</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="syncProducts"
                checked={syncConfig.syncProducts}
                onChange={e => updateSyncConfig({ syncProducts: e.target.checked })}
                className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="syncProducts" className="ml-1 text-xs md:text-sm text-gray-700">Sincronizar productos</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="syncCategories"
                checked={syncConfig.syncCategories}
                onChange={e => updateSyncConfig({ syncCategories: e.target.checked })}
                className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="syncCategories" className="ml-1 text-xs md:text-sm text-gray-700">Sincronizar categorías</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="syncOrders"
                checked={syncConfig.syncOrders}
                onChange={e => updateSyncConfig({ syncOrders: e.target.checked })}
                className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="syncOrders" className="ml-1 text-xs md:text-sm text-gray-700">Sincronizar pedidos</label>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-2 flex flex-wrap justify-between text-xs text-gray-500">
        <div>
          {syncing 
            ? 'Sincronizando...' 
            : `Última sincronización: ${formatLastSync()}`
          }
        </div>
        
        {(productsError || ordersError) && (
          <div className="flex items-center text-red-600">
            <AlertTriangle size={12} className="mr-1" />
            Error de sincronización
          </div>
        )}
      </div>
    </div>
  );
};

export default WooSyncStatus;