import React, { useState } from 'react';
import { Download, Printer } from 'lucide-react';

/**
 * Componente para la personalización del QR del menú
 */
const QRContent = ({ settings, setSettings }) => {
  // Estado local para el formulario de personalización
  const [formData, setFormData] = useState(settings);
  
  // Función para actualizar la configuración
  const handleSave = () => {
    setSettings(formData);
  };
  
  // Función para restablecer los cambios
  const handleReset = () => {
    setFormData(settings);
  };
  
  return (
    <div className="space-y-8">
      {/* Configuración del QR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalización del QR</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color principal
              </label>
              <div className="flex space-x-2">
                <input 
                  type="color" 
                  value={formData.primaryColor} 
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                  className="h-10 w-10 border-0 p-0"
                />
                <input 
                  type="text" 
                  value={formData.primaryColor} 
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje de bienvenida
              </label>
              <input 
                type="text" 
                value={formData.welcomeMessage}
                onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este mensaje se mostrará cuando los clientes escaneen el QR
              </p>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="show-logo" 
                checked={formData.logoEnabled}
                onChange={(e) => setFormData({...formData, logoEnabled: e.target.checked})}
                className="h-4 w-4 text-indigo-600 rounded"
              />
              <label htmlFor="show-logo" className="ml-2 text-sm text-gray-700">
                Mostrar logo en el centro del QR
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="show-promos" 
                checked={formData.showPromotions}
                onChange={(e) => setFormData({...formData, showPromotions: e.target.checked})}
                className="h-4 w-4 text-indigo-600 rounded"
              />
              <label htmlFor="show-promos" className="ml-2 text-sm text-gray-700">
                Mostrar promociones activas en el menú
              </label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button 
                onClick={handleReset}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md"
              >
                Restablecer
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
        
        {/* Vista previa del QR */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista previa</h3>
          
          <div className="flex flex-col items-center justify-center">
            <div 
              className="w-64 h-64 border border-gray-200 rounded-lg flex items-center justify-center bg-white p-4"
              style={{ color: formData.primaryColor }}
            >
              <div className="relative">
                <div className="text-8xl opacity-10">QR</div>
                {formData.logoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">🍽️</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-sm font-medium" style={{ color: formData.primaryColor }}>
                Escanéame para ver el menú
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {formData.welcomeMessage}
              </p>
            </div>
            
            <div className="mt-6 space-y-3 w-full">
              <button className="w-full px-4 py-2 text-sm bg-indigo-600 text-white rounded-md flex items-center justify-center">
                <Download size={16} className="mr-1" />
                Descargar QR
              </button>
              <button className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md flex items-center justify-center">
                <Printer size={16} className="mr-1" />
                Imprimir QR
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instrucciones y consejos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Instrucciones y consejos</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">¿Cómo usar el QR en tu restaurante?</h4>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Descarga el código QR personalizado</li>
              <li>Imprímelo en tamaño adecuado para tus mesas</li>
              <li>Colócalo en un marco o soporte resistente</li>
              <li>Ponlo en un lugar visible en cada mesa</li>
              <li>Asegúrate de que tenga buena iluminación para facilitar el escaneo</li>
            </ol>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tamaño recomendado</h4>
              <p className="text-sm text-gray-500">
                Para obtener mejores resultados, imprime el QR en un tamaño mínimo de 5x5 cm.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Material resistente</h4>
              <p className="text-sm text-gray-500">
                Utiliza materiales laminados o resistentes a líquidos para mayor durabilidad.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Actualización automática</h4>
              <p className="text-sm text-gray-500">
                El menú se actualiza automáticamente cuando realizas cambios en tus productos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRContent;