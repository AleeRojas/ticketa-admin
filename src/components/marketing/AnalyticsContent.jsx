import React from 'react';
import { TrendingUp, CreditCard, Clock, AlertCircle } from 'lucide-react';

/**
 * Componente para la pestaña de Analíticas
 */
const AnalyticsContent = () => {
  // Datos de ejemplo para las gráficas
  const viewsData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    values: [120, 135, 90, 105, 180, 230, 245]
  };
  
  const popularItemsData = [
    { name: 'Paella de Mariscos', views: 156, orders: 42 },
    { name: 'Lomo a la Pimienta', views: 124, orders: 38 },
    { name: 'Gin Tonic Especial', views: 98, orders: 31 },
    { name: 'Tiramisú', views: 87, orders: 29 },
    { name: 'Ensalada César', views: 76, orders: 18 }
  ];
  
  return (
    <div className="space-y-8">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Visitas al menú</h4>
          <p className="text-2xl font-bold mt-1">1,245</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+12.5%</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Pedidos desde QR</h4>
          <p className="text-2xl font-bold mt-1">248</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+8.3%</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Interacciones promocionales</h4>
          <p className="text-2xl font-bold mt-1">325</p>
          <div className="flex items-center text-red-600 text-xs mt-1">
            <span>-3.1%</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Tiempo medio en menú</h4>
          <p className="text-2xl font-bold mt-1">3:24</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+0:18</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
      </div>
      
      {/* Gráfico de visitas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Visitas al Menú QR</h3>
          <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Este mes</option>
            <option>Personalizado</option>
          </select>
        </div>
        
        <div className="h-64">
          {/* Representación visual de la gráfica */}
          <div className="h-full flex items-end space-x-1">
            {viewsData.values.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-all"
                  style={{ height: `${(value / Math.max(...viewsData.values)) * 85}%` }}
                ></div>
                <div className="text-xs text-gray-600 mt-1">{viewsData.labels[index]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Elementos más populares */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Elementos más populares</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vistas</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tasa de conversión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {popularItemsData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-center">{item.views}</td>
                  <td className="px-4 py-3 text-sm text-center">{item.orders}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                      {Math.round((item.orders / item.views) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Rendimiento de campañas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rendimiento de campañas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-medium">Promoción de Verano</h4>
                <p className="text-xs text-gray-500">Banner principal</p>
              </div>
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Activo</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="text-center">
                <p className="text-sm font-bold">245</p>
                <p className="text-xs text-gray-500">Impresiones</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">68</p>
                <p className="text-xs text-gray-500">Clics</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">27.8%</p>
                <p className="text-xs text-gray-500">CTR</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">65% de objetivo cumplido</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-medium">Descuento 15%</h4>
                <p className="text-xs text-gray-500">Popup promocional</p>
              </div>
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Activo</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="text-center">
                <p className="text-sm font-bold">187</p>
                <p className="text-xs text-gray-500">Impresiones</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">42</p>
                <p className="text-xs text-gray-500">Clics</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">22.5%</p>
                <p className="text-xs text-gray-500">CTR</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">40% de objetivo cumplido</p>
          </div>
        </div>
      </div>
      
      {/* Insights y recomendaciones */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Insights y Recomendaciones</h3>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <h4 className="font-medium text-amber-800">Oportunidad detectada</h4>
            <p className="text-sm text-amber-700 mt-1">
              La tasa de conversión para postres es más alta los fines de semana. Considera crear una promoción específica para postres en estos días.
            </p>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h4 className="font-medium text-green-800">Buena práctica</h4>
            <p className="text-sm text-green-700 mt-1">
              Las fotos de los platos aumentan las conversiones en un 38%. Asegúrate de que todos tus productos tengan imágenes de alta calidad.
            </p>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-medium text-blue-800">Recomendación</h4>
            <p className="text-sm text-blue-700 mt-1">
              El 75% de los clientes escanea el QR entre las 18:00 y 21:00. Este es el mejor momento para mostrar promociones de alta visibilidad.
            </p>
          </div>
        </div>
      </div>
      
      {/* Enlaces a herramientas externas */}
      <div className="bg-indigo-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4">Herramientas adicionales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">Google Analytics</h4>
            <p className="text-sm text-gray-600 mb-4">
              Conecta tu menú con Google Analytics para un análisis más profundo del comportamiento de tus clientes.
            </p>
            <button className="w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md">
              Conectar
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">Exportar datos</h4>
            <p className="text-sm text-gray-600 mb-4">
              Exporta todos los datos de rendimiento en formatos CSV o Excel para análisis personalizados.
            </p>
            <button className="w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md">
              Exportar
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">Informes programados</h4>
            <p className="text-sm text-gray-600 mb-4">
              Recibe informes semanales o mensuales directamente en tu correo electrónico.
            </p>
            <button className="w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md">
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContent;