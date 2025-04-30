import React from 'react';
import { Plus, Edit, Trash, Eye, Globe, Image } from 'lucide-react';

/**
 * Componente para la pestaña Web/Menú QR
 */
const WebContent = ({ 
  banners, 
  popups, 
  setBanners, 
  setPopups,
  setEditingBanner,
  setEditingPopup, 
  setShowBannerModal,
  setShowPopupModal
}) => {
  return (
    <div className="space-y-8">
      {/* Sección Banners */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Banners</h3>
          <button 
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
            onClick={() => {
              setEditingBanner(null);
              setShowBannerModal(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Nuevo Banner
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.map(banner => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{banner.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {banner.displayFrom} - {banner.displayTo}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setEditingBanner(banner);
                          setShowBannerModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setBanners(banners.filter(b => b.id !== banner.id))}
                      >
                        <Trash size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No hay banners creados. ¡Crea tu primer banner!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Sección Popups */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Popup / Notificaciones</h3>
          <button 
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
            onClick={() => {
              setEditingPopup(null);
              setShowPopupModal(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Nuevo Popup
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {popups.map(popup => (
                <tr key={popup.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{popup.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      popup.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {popup.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {popup.displayFrom} - {popup.displayTo}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setEditingPopup(popup);
                          setShowPopupModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setPopups(popups.filter(p => p.id !== popup.id))}
                      >
                        <Trash size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {popups.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No hay popups creados. ¡Crea tu primer popup!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Vista previa de Menú QR */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Vista Previa del Menú</h3>
          <a
            href="https://yamenu.cl/zbar" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
          >
            Ver menú online
            <Globe size={16} className="ml-1" />
          </a>
        </div>
        
        <div className="border border-gray-200 rounded-lg aspect-[9/16] max-w-xs mx-auto bg-gray-50 flex items-center justify-center">
          <div className="text-center p-4">
            <Image size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm">Vista previa del menú QR</p>
            <p className="text-gray-400 text-xs mt-2">Aquí se muestra cómo verán tus clientes el menú</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebContent;