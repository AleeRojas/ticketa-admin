import React, { useState } from 'react';
import { Globe, Share2, Image, BarChart3 } from 'lucide-react';
import WebContent from './WebContent';
import SocialContent from './SocialContent';
import QRContent from './QRContent';
import AnalyticsContent from './AnalyticsContent';
import BannerModal from './modals/BannerModal';
import PopupModal from './modals/PopupModal';
import PostModal from './modals/PostModal';

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
  
  // Renderizado condicional según la pestaña activa
  const renderTabContent = () => {
    switch(activeTab) {
      case 'web':
        return <WebContent 
          banners={banners} 
          popups={popups}
          setBanners={setBanners}
          setPopups={setPopups}
          setEditingBanner={setEditingBanner}
          setEditingPopup={setEditingPopup}
          setShowBannerModal={setShowBannerModal}
          setShowPopupModal={setShowPopupModal}
        />;
      case 'social':
        return <SocialContent 
          posts={socialPosts}
          setPosts={setSocialPosts}
          setEditingPost={setEditingPost}
          setShowPostModal={setShowPostModal}
        />;
      case 'qr':
        return <QRContent 
          settings={qrSettings}
          setSettings={setQrSettings}
        />;
      case 'analytics':
        return <AnalyticsContent />;
      default:
        return <WebContent />;
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
            Web / Menú QR
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
            onClick={() => setActiveTab('qr')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'qr' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image size={16} className="mr-2" />
            Personalizar QR
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