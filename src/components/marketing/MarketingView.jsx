import React, { useState } from 'react';
import { Globe, Share2, Ticket, BarChart3, Download, Printer } from 'lucide-react';
import WebContent from './WebContent';
import SocialContent from './SocialContent';
import AnalyticsContent from './AnalyticsContent';
import BannerModal from './modals/BannerModal';
import PopupModal from './modals/PopupModal';
import PostModal from './modals/PostModal';
import PromoContent from './PromoContent'; // Nuevo componente que crearemos para concursos y cupones

/**
 * Componente principal para la vista de Marketing
 */
const MarketingView = () => {
  // Estados para los diferentes elementos de marketing
  const [activeTab, setActiveTab] = useState('web');
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Promoción de Verano',
      image: null,
      active: true,
      targetUrl: '/promocion-verano',
      displayFrom: '2025-06-01',
      displayTo: '2025-08-31'
    },
    {
      id: 2,
      title: 'Happy Hour',
      image: null,
      active: false,
      targetUrl: '/happy-hour',
      displayFrom: '2025-05-01',
      displayTo: '2025-12-31'
    }
  ]);
  
  const [popups, setPopups] = useState([
    {
      id: 1,
      title: 'Descuento 15%',
      content: 'Utiliza el código YAMENU15 para obtener un 15% de descuento en tu próxima visita.',
      active: true,
      displayFrom: '2025-05-01',
      displayTo: '2025-05-31'
    }
  ]);
  
  const [socialPosts, setSocialPosts] = useState([
    {
      id: 1,
      title: 'Nuevo menú de temporada',
      content: 'Descubre nuestros nuevos platos de temporada. ¡Sabores que no querrás perderte!',
      image: null,
      platforms: ['instagram', 'facebook'],
      scheduled: '2025-05-10T18:00:00',
      status: 'draft'
    }
  ]);
  
  const [qrSettings, setQrSettings] = useState({
    primaryColor: '#646cff',
    logoEnabled: true,
    welcomeMessage: '¡Bienvenido a nuestro restaurante!',
    showPromotions: true
  });

  // Estados para los modales
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingPopup, setEditingPopup] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  // Sección integrada de personalización QR y vista previa
  const QRMenuSection = () => {
    // Estado local para el formulario de personalización
    const [formData, setFormData] = useState(qrSettings);
    
    // Función para actualizar la configuración
    const handleSave = () => {
      setQrSettings(formData);
    };
    
    // Función para restablecer los cambios
    const handleReset = () => {
      setFormData(qrSettings);
    };

    return (
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalización y Vista Previa del Menú QR</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuración QR */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Configuración del QR</h4>
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
          
          {/* Vista previa del QR y el menú */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Vista previa</h4>
            <div className="flex flex-col items-center">
              <div 
                className="w-48 h-48 border border-gray-200 rounded-lg flex items-center justify-center bg-white p-4 mb-4"
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
              
              <span className="text-sm font-medium mb-1" style={{ color: formData.primaryColor }}>
                Escanéame para ver el menú
              </span>
              <p className="text-xs text-gray-500 mb-4">
                {formData.welcomeMessage}
              </p>
              
              <a
                href="https://yamenu.cl/zbar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center mb-2"
              >
                <Globe size={15} className="mr-1" />
                yamenu.cl/zbar
              </a>
              
              <div className="space-y-2 w-full mt-2">
                <button className="w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded-md flex items-center justify-center">
                  <Download size={14} className="mr-1" />
                  Descargar QR
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md flex items-center justify-center">
                  <Printer size={14} className="mr-1" />
                  Imprimir QR
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Estadísticas básicas del QR */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-3">Rendimiento del QR</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="text-xs font-medium text-gray-500">Escaneos este mes</h5>
              <p className="text-xl font-bold mt-1">458</p>
              <div className="flex items-center text-green-600 text-xs mt-1">
                <span>+23%</span>
                <span className="text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="text-xs font-medium text-gray-500">Convertidos a pedidos</h5>
              <p className="text-xl font-bold mt-1">126</p>
              <div className="flex items-center text-green-600 text-xs mt-1">
                <span>+8%</span>
                <span className="text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="text-xs font-medium text-gray-500">Tasa de conversión</h5>
              <p className="text-xl font-bold mt-1">27.5%</p>
              <div className="flex items-center text-red-600 text-xs mt-1">
                <span>-2.1%</span>
                <span className="text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="text-xs font-medium text-gray-500">Valor medio pedido</h5>
              <p className="text-xl font-bold mt-1">$18.45</p>
              <div className="flex items-center text-green-600 text-xs mt-1">
                <span>+$1.20</span>
                <span className="text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Modificar el renderizado condicional para incluir la sección integrada QR
  const renderTabContent = () => {
    switch(activeTab) {
      case 'web':
        return (
          <>
            <WebContent 
              banners={banners} 
              popups={popups}
              setBanners={setBanners}
              setPopups={setPopups}
              setEditingBanner={setEditingBanner}
              setEditingPopup={setEditingPopup}
              setShowBannerModal={setShowBannerModal}
              setShowPopupModal={setShowPopupModal}
            />
            <QRMenuSection />
          </>
        );
      case 'social':
        return <SocialContent 
          posts={socialPosts}
          setPosts={setSocialPosts}
          setEditingPost={setEditingPost}
          setShowPostModal={setShowPostModal}
        />;
      case 'promo':
        return <PromoContent />;
      case 'analytics':
        return <AnalyticsContent />;
      default:
        return (
          <>
            <WebContent 
              banners={banners} 
              popups={popups}
              setBanners={setBanners}
              setPopups={setPopups}
              setEditingBanner={setEditingBanner}
              setEditingPopup={setEditingPopup}
              setShowBannerModal={setShowBannerModal}
              setShowPopupModal={setShowPopupModal}
            />
            <QRMenuSection />
          </>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Marketing y Promoción
        </h2>
      </div>
      
      {/* Pestañas */}
      <div className="mb-6 bg-white rounded-lg shadow">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'web' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe size={16} className="mr-2" />
            Web / QR
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'social' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Share2 size={16} className="mr-2" />
            Redes Sociales
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'promo' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Ticket size={16} className="mr-2" />
            Promos
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'analytics' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 size={16} className="mr-2" />
            Analíticas
          </button>
        </div>
      </div>
      
      {/* Contenido de la pestaña seleccionada */}
      {renderTabContent()}
      
      {/* Modales */}
      {showBannerModal && (
        <BannerModal 
          banner={editingBanner} 
          onClose={() => setShowBannerModal(false)}
          onSave={(bannerData) => {
            if (editingBanner) {
              setBanners(banners.map(b => b.id === editingBanner.id ? bannerData : b));
            } else {
              setBanners([...banners, { ...bannerData, id: banners.length + 1 }]);
            }
            setShowBannerModal(false);
          }}
        />
      )}
      
      {showPopupModal && (
        <PopupModal 
          popup={editingPopup} 
          onClose={() => setShowPopupModal(false)}
          onSave={(popupData) => {
            if (editingPopup) {
              setPopups(popups.map(p => p.id === editingPopup.id ? popupData : p));
            } else {
              setPopups([...popups, { ...popupData, id: popups.length + 1 }]);
            }
            setShowPopupModal(false);
          }}
        />
      )}
      
      {showPostModal && (
        <PostModal 
          post={editingPost} 
          onClose={() => setShowPostModal(false)}
          onSave={(postData) => {
            if (editingPost) {
              setSocialPosts(socialPosts.map(p => p.id === editingPost.id ? postData : p));
            } else {
              setSocialPosts([...socialPosts, { ...postData, id: socialPosts.length + 1 }]);
            }
            setShowPostModal(false);
          }}
        />
      )}
    </div>
  );
};

export default MarketingView;