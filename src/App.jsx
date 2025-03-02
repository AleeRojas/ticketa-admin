import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid,
  UtensilsCrossed, 
  ClipboardList, 
  Package, 
  Users, 
  Clock, 
  Bell, 
  Settings, 
  Search, 
  Plus, 
  Filter, 
  Wifi, 
  Eye, 
  X, 
  Save, 
  Trash, 
  Edit, 
  MapPin, 
  ChevronDown, 
  Utensils, 
  CreditCard, 
  Printer, 
  Check, 
  Minus 
} from 'lucide-react';

// Componente principal que contiene la aplicación
const RestaurantApp = () => {
  const [activeTab, setActiveTab] = useState('mesas');
  const [activeSalon, setActiveSalon] = useState('principal');
  const [viewMode, setViewMode] = useState('salon');
  const [viewType, setViewType] = useState('visual'); // 'visual' o 'esquema'
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showSalonModal, setShowSalonModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [editingSalon, setEditingSalon] = useState(null);
  const [activeOrderTable, setActiveOrderTable] = useState(null);
  const [showSalonMenu, setShowSalonMenu] = useState(false);
  
  // Estado para menú contextual
  const [showContextMenu, setShowContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    table: null
  });
  
  // Productos disponibles (reducido a 3 ejemplos)
  const [products, setProducts] = useState([
    { id: 1, name: 'Café Americano', price: 2.50, category: 'bebidas' },
    { id: 4, name: 'Ensalada César', price: 8.50, category: 'entrantes' },
    { id: 7, name: 'Hamburguesa completa', price: 12.50, category: 'principales' }
  ]);
  
  // Categorías de productos
  const productCategories = [
    { id: 'bebidas', name: 'Bebidas' },
    { id: 'entrantes', name: 'Entrantes' },
    { id: 'principales', name: 'Platos principales' }
  ];
  
  // Pedidos (reducido a 3 ejemplos)
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      tableId: 1, 
      items: [
        { productId: 7, quantity: 2, price: 12.50, name: 'Hamburguesa completa', status: 'servido' }
      ],
      status: 'en curso',
      createdAt: new Date(new Date().getTime() - 45 * 60000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 2, 
      tableId: 3, 
      items: [
        { productId: 4, quantity: 2, price: 8.50, name: 'Ensalada César', status: 'servido' }
      ],
      status: 'en curso',
      createdAt: new Date(new Date().getTime() - 72 * 60000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 3, 
      tableId: 4, 
      items: [
        { productId: 1, quantity: 2, price: 2.50, name: 'Café Americano', status: 'servido' }
      ],
      status: 'pagando',
      createdAt: new Date(new Date().getTime() - 20 * 60000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  
  // Estado de salones
  const [salones, setSalones] = useState([
    { id: 'principal', name: 'Salón Principal', icon: '🍽️' },
    { id: 'terraza', name: 'Terraza', icon: '☀️' }
  ]);
  
  // Estado de mesas (reducido a 3 ejemplos)
  const [tables, setTables] = useState([
    { id: 1, number: 1, status: 'ocupada', time: '00:45', salon: 'principal', x: 20, y: 30, seats: 4, shape: 'circle' },
    { id: 3, number: 3, status: 'ocupada', time: '01:12', salon: 'principal', x: 70, y: 30, seats: 6, shape: 'rect' },
    { id: 4, number: 4, status: 'pagando', time: '00:20', salon: 'principal', x: 70, y: 70, seats: 4, shape: 'circle' }
  ]);

  // Helper function to get orders for a specific table
  const getTableOrders = (tableId) => {
    return orders.filter(order => order.tableId === tableId);
  };
  
  // Helper function to calculate total for a table
  const getTableTotal = (tableId) => {
    const tableOrders = getTableOrders(tableId);
    return tableOrders.reduce((total, order) => {
      return total + order.items.reduce((itemTotal, item) => itemTotal + (item.price * item.quantity), 0);
    }, 0);
  };
  
  // Simulación tiempo real simplificada
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const tablesCopy = [...tables];
        if (tablesCopy.length > 0) {
          const randomIndex = Math.floor(Math.random() * tablesCopy.length);
          const randomTableId = tablesCopy[randomIndex].id;
          const statuses = ['libre', 'ocupada', 'pagando', 'reservada'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          setTables(prev => 
            prev.map(table => 
              table.id === randomTableId 
                ? { 
                    ...table, 
                    status: newStatus,
                    time: newStatus === 'libre' ? '00:00' : `00:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`
                  } 
                : table
            )
          );
          
          setLastUpdate(new Date());
          setIsUpdating(true);
          setTimeout(() => setIsUpdating(false), 1000);
        }
      }
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getTableColor = (status) => {
    switch(status) {
      case 'ocupada': return { bg: 'bg-amber-500', text: 'text-amber-800', ring: 'ring-amber-500', light: 'bg-amber-100' };
      case 'libre': return { bg: 'bg-emerald-500', text: 'text-emerald-800', ring: 'ring-emerald-500', light: 'bg-emerald-100' };
      case 'pagando': return { bg: 'bg-blue-500', text: 'text-blue-800', ring: 'ring-blue-500', light: 'bg-blue-100' };
      case 'reservada': return { bg: 'bg-purple-500', text: 'text-purple-800', ring: 'ring-purple-500', light: 'bg-purple-100' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-800', ring: 'ring-gray-500', light: 'bg-gray-100' };
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'ocupada': 'Ocupada',
      'libre': 'Libre',
      'pagando': 'Pagando',
      'reservada': 'Reservada'
    };
    return statusMap[status] || status;
  };
  
  // Filtrar mesas por salón activo
  const filteredTables = tables.filter(table => table.salon === activeSalon);
  
  // Estadísticas para el salón activo
  const salonStats = {
    total: filteredTables.length,
    occupied: filteredTables.filter(t => t.status === 'ocupada').length,
    free: filteredTables.filter(t => t.status === 'libre').length,
    paying: filteredTables.filter(t => t.status === 'pagando').length,
    reserved: filteredTables.filter(t => t.status === 'reservada').length,
    totalRevenue: filteredTables.reduce((sum, table) => sum + getTableTotal(table.id), 0)
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-indigo-900 text-white flex flex-col items-center py-6 space-y-8">
        <div className="p-2 rounded-lg bg-indigo-700">
          <LayoutGrid size={24} />
        </div>
        <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
          <UtensilsCrossed size={24} />
        </div>
        <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
          <ClipboardList size={24} />
        </div>
        <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
          <Package size={24} />
        </div>
        <div className="p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
          <Users size={24} />
        </div>
        <div className="mt-auto p-2 hover:bg-indigo-700 rounded-lg transition cursor-pointer">
          <Settings size={24} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">YAMENÚ</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              <div className="relative">
                <Bell className="text-gray-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="flex space-x-1 px-4">
            <button 
              onClick={() => setActiveTab('mesas')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'mesas' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Mesas
            </button>
            <button 
              onClick={() => setActiveTab('pedidos')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'pedidos' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Pedidos
            </button>
            <button 
              onClick={() => setActiveTab('productos')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'productos' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Productos
            </button>
            <button 
              onClick={() => setActiveTab('estadisticas')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'estadisticas' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Estadísticas
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'mesas' && (
            <div>
              {/* Salones and actions header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  {salones.map(salon => (
                    <button 
                      key={salon.id}
                      onClick={() => setActiveSalon(salon.id)}
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                        activeSalon === salon.id 
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span>{salon.icon}</span>
                      <span>{salon.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <button 
                      onClick={() => setShowSalonMenu(!showSalonMenu)}
                      className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                    >
                      <MapPin size={16} />
                      <span>Salones</span>
                      <ChevronDown size={16} />
                    </button>
                    
                    {showSalonMenu && (
                      <div className="absolute mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-48">
                        <button 
                          onClick={() => {
                            setShowSalonModal(true);
                            setEditingSalon(null);
                            setShowSalonMenu(false);
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                        >
                          <Plus size={16} className="mr-2" />
                          Crear nuevo salón
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        {salones.map(salon => (
                          <button 
                            key={salon.id}
                            onClick={() => {
                              setEditingSalon(salon);
                              setShowSalonModal(true);
                              setShowSalonMenu(false);
                            }}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center justify-between"
                          >
                            <span className="flex items-center">
                              <span className="mr-2">{salon.icon}</span>
                              {salon.name}
                            </span>
                            <Edit size={14} className="text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1">
                    <Filter size={16} />
                    <span>Filtrar</span>
                  </button>
                  
                  <button 
                    onClick={() => setViewMode(viewMode === 'salon' ? 'lista' : 'salon')}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <Eye size={16} />
                    <span>{viewMode === 'salon' ? 'Ver lista' : 'Ver salón'}</span>
                  </button>
                  
                  {viewMode === 'salon' && (
                    <button 
                      onClick={() => setViewType(viewType === 'visual' ? 'esquema' : 'visual')}
                      className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                    >
                      <LayoutGrid size={16} />
                      <span>{viewType === 'visual' ? 'Vista esquema' : 'Vista visual'}</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      setShowTableModal(true);
                      setEditingTable(null);
                    }}
                    className="bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Añadir Mesa</span>
                  </button>
                </div>
              </div>

              {/* Status indicators and stats */}
              <div className="flex flex-wrap justify-between mb-6">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-600">Libre ({salonStats.free})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-600">Ocupada ({salonStats.occupied})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Pagando ({salonStats.paying})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-600">Reservada ({salonStats.reserved})</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className={`flex items-center space-x-1 ${isUpdating ? 'text-green-600' : 'text-gray-500'}`}>
                    <Wifi size={16} className={isUpdating ? 'animate-pulse' : ''} />
                    <span>Tiempo real</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock size={16} />
                    <span>Última act.: {lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>

              {/* Interactive floor plan view */}
              {viewMode === 'salon' && viewType === 'visual' && (
                <div className="bg-white rounded-lg shadow p-6 mb-6 relative" style={{height: '500px'}}>
                  <h3 className="absolute top-4 left-4 text-lg font-semibold text-gray-800">
                    {salones.find(s => s.id === activeSalon)?.name || 'Salón'}
                  </h3>
                  
                  {/* Salon background elements */}
                  {activeSalon === 'principal' && (
                    <>
                      <div className="absolute left-4 top-16 p-2 text-gray-400 text-sm border border-gray-200 rounded bg-gray-50">Entrada</div>
                      <div className="absolute right-4 top-16 p-2 text-gray-400 text-sm border border-gray-200 rounded bg-gray-50">Cocina</div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-gray-200 rounded-lg pointer-events-none"></div>
                    </>
                  )}
                  
                  {activeSalon === 'terraza' && (
                    <>
                      <div className="absolute left-4 top-16 p-2 text-gray-400 text-sm border border-gray-200 rounded bg-gray-50">Jardín</div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-gray-200 rounded-lg pointer-events-none"></div>
                      <div className="absolute bottom-8 right-8 text-6xl opacity-10 pointer-events-none">☀️</div>
                    </>
                  )}
                  
                  {/* Tables */}
                  {filteredTables.map((table) => {
                    const tableColors = getTableColor(table.status);
                    return (
                      <div 
                        onClick={() => {
                          // Al hacer clic en una mesa, siempre mostrar un menú contextual
                          setActiveOrderTable(table);
                          setShowContextMenu({ 
                            visible: true, 
                            x: window.event.clientX, 
                            y: window.event.clientY,
                            table: table 
                          });
                        }}
                        key={table.id}
                        className={`absolute cursor-pointer transition-all duration-300 transform hover:scale-105 ${isUpdating && 'hover:scale-100'}`}
                        style={{
                          left: `${table.x}%`, 
                          top: `${table.y}%`, 
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Table shape - Circular for 2 and 4 persons, rectangular for 6+ */}
                        {table.seats <= 4 ? (
                          <div 
                            className={`${tableColors.bg} rounded-full shadow-lg flex items-center justify-center ${
                              isUpdating && table.status !== 'libre' ? 'animate-pulse' : ''
                            }`}
                            style={{ 
                              width: `${table.seats * 12 + 20}px`, 
                              height: `${table.seats * 12 + 20}px`
                            }}
                          >
                            <span className="font-bold text-white">{table.number}</span>
                            
                            {/* Add chair indicators for circular tables */}
                            <div className="absolute w-full h-full">
                              {Array.from({ length: table.seats }).map((_, idx) => {
                                const angle = (idx * (360 / table.seats)) * (Math.PI / 180);
                                const radius = (table.seats * 12 + 20) / 2 + 5; // Radius of table + offset
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                
                                return (
                                  <div 
                                    key={idx}
                                    className="absolute w-4 h-4 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ 
                                      left: `50%`,
                                      top: `50%`,
                                      marginLeft: `${x}px`,
                                      marginTop: `${y}px`
                                    }}
                                  />
                                );
                              })}
                            </div>
                            
                            {/* Show order count badge if has orders */}
                            {getTableOrders(table.id).length > 0 && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {getTableOrders(table.id).length}
                              </div>
                            )}
                          </div>
                        ) : (
                          // Rectangular table for larger groups
                          <div 
                            className={`${tableColors.bg} rounded-lg shadow-lg flex items-center justify-center ${
                              isUpdating && table.status !== 'libre' ? 'animate-pulse' : ''
                            }`}
                            style={{ 
                              width: `${table.seats * 10 + 20}px`, 
                              height: `${Math.ceil(table.seats/2) * 15 + 15}px`
                            }}
                          >
                            <span className="font-bold text-white">{table.number}</span>
                            
                            {/* Add chair indicators for rectangular tables */}
                            <div className="absolute w-full h-full">
                              {Array.from({ length: Math.min(table.seats, 8) }).map((_, idx) => {
                                // Calculate positions around rectangular table
                                const positions = [
                                  { top: '-8px', left: '20%' },
                                  { top: '-8px', left: '50%' },
                                  { top: '-8px', left: '80%' },
                                  { bottom: '-8px', left: '20%' },
                                  { bottom: '-8px', left: '50%' },
                                  { bottom: '-8px', left: '80%' },
                                  { left: '-8px', top: '50%' },
                                  { right: '-8px', top: '50%' }
                                ];
                                return (
                                  <div 
                                    key={idx}
                                    className="absolute w-4 h-4 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
                                    style={positions[idx]}
                                  />
                                );
                              })}
                            </div>
                            
                            {/* Show order count badge if has orders */}
                            {getTableOrders(table.id).length > 0 && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {getTableOrders(table.id).length}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 rounded ${tableColors.light} ${tableColors.text} text-xs font-medium shadow-sm whitespace-nowrap z-10`}>
                          {getStatusText(table.status)}
                          {table.status !== 'libre' && table.status !== 'reservada' && (
                            <span> • {table.time}</span>
                          )}
                          <div className="flex mt-1 space-x-1">
                            <button 
                              className="bg-blue-500 text-white text-xs rounded px-2 py-0.5 hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveOrderTable(table);
                                setShowOrderModal(true);
                              }}
                            >
                              {getTableOrders(table.id).length > 0 ? 'Ver pedidos' : 'Nuevo pedido'}
                            </button>
                            <button 
                              className="bg-gray-500 text-white text-xs rounded px-2 py-0.5 hover:bg-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTable(table);
                                setShowTableModal(true);
                              }}
                            >
                              Editar mesa
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Schematic floor plan view */}
              {viewMode === 'salon' && viewType === 'esquema' && (
                <div className="bg-white rounded-lg shadow p-6 mb-6 relative" style={{height: '500px'}}>
                  <h3 className="absolute top-4 left-4 text-lg font-semibold text-gray-800">
                    Esquema: {salones.find(s => s.id === activeSalon)?.name || 'Salón'}
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-4 p-16">
                    {filteredTables.map((table) => {
                      const tableColors = getTableColor(table.status);
                      return (
                        <div 
                          key={table.id}
                          className={`${tableColors.bg} border-2 ${tableColors.bg} rounded-lg p-3 cursor-pointer shadow-lg hover:shadow-xl transition-shadow ${
                            isUpdating && table.status !== 'libre' ? 'animate-pulse' : ''
                          }`}
                          onClick={() => {
                            setEditingTable(table);
                            setShowTableModal(true);
                          }}
                        >
                          <div className="text-white flex justify-between items-start">
                            <div className="text-center relative">
                              <span className="text-3xl font-bold block">{table.number}</span>
                              <span className="text-xs block">{table.seats} pax</span>
                              
                              {/* Show order count badge if has orders */}
                              {getTableOrders(table.id).length > 0 && (
                                <div className="absolute -top-2 -right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {getTableOrders(table.id).length}
                                </div>
                              )}
                            </div>
                            <div className={`px-2 py-1 rounded-full ${tableColors.light} ${tableColors.text} text-xs font-semibold`}>
                              {getStatusText(table.status)}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2 text-white">
                            <div className="flex items-center text-xs">
                              <Clock size={12} className="mr-1" />
                              <span>{table.time || '00:00'}</span>
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveOrderTable(table);
                                  setShowOrderModal(true);
                                }}
                              >
                                <Utensils size={12} className="mr-1" />
                                <span>{getTableOrders(table.id).length > 0 ? 'Pedidos' : 'Crear pedido'}</span>
                              </button>
                              <button 
                                className="bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700 flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTable(table);
                                  setShowTableModal(true);
                                }}
                              >
                                <Edit size={12} className="mr-1" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Only show total if there are orders */}
                          {getTableOrders(table.id).length > 0 && (
                            <div className="mt-2 text-right">
                              <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded text-xs font-medium">
                                {getTableTotal(table.id)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* List view */}
              {viewMode === 'lista' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTables.map(table => {
                        const tableColors = getTableColor(table.status);
                        return (
                          <tr 
                            key={table.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setEditingTable(table);
                              setShowTableModal(true);
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">Mesa {table.number}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tableColors.light} ${tableColors.text}`}>
                                {getStatusText(table.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{table.time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {getTableOrders(table.id).length > 0 ? (
                                  <div className="flex space-x-1">
                                    <button 
                                      className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-100 flex items-center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveOrderTable(table);
                                        setShowOrderModal(true);
                                      }}
                                    >
                                      <span>{getTableOrders(table.id).length} pedidos</span>
                                      <Utensils size={12} className="ml-1" />
                                    </button>
                                    <button 
                                      className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 flex items-center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTable(table);
                                        setShowTableModal(true);
                                      }}
                                    >
                                      <Edit size={12} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex space-x-1">
                                    <button 
                                      className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-100 flex items-center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveOrderTable(table);
                                        setShowOrderModal(true);
                                      }}
                                    >
                                      <Plus size={12} className="mr-1" />
                                      <span>Nuevo pedido</span>
                                    </button>
                                    <button 
                                      className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 flex items-center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTable(table);
                                        setShowTableModal(true);
                                      }}
                                    >
                                      <Edit size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{getTableTotal(table.id) > 0 ? `${getTableTotal(table.id)}` : '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{table.seats} pax</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Simplified Stats Summary */}
              <div className="bg-white p-6 rounded-lg shadow mt-6">
                <h3 className="text-lg font-semibold mb-4">Resumen del {salones.find(s => s.id === activeSalon)?.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Mesas Ocupadas</p>
                    <p className="text-xl font-semibold mt-1">{salonStats.occupied} / {salonStats.total}</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{width: `${(salonStats.occupied / salonStats.total) * 100}%`}}></div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Mesas Libres</p>
                    <p className="text-xl font-semibold mt-1">{salonStats.free} / {salonStats.total}</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(salonStats.free / salonStats.total) * 100}%`}}></div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Pedidos</p>
                    <p className="text-xl font-semibold mt-1">
                      {orders.filter(order => 
                        filteredTables.some(table => table.id === order.tableId)
                      ).length}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Ventas</p>
                    <p className="text-xl font-semibold mt-1">{salonStats.totalRevenue}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'mesas' && (
            <div className="bg-white rounded-lg shadow p-16 text-center">
              <div className="text-6xl mb-4">
                {activeTab === 'pedidos' ? '🧾' : activeTab === 'productos' ? '🍽️' : '📊'}
              </div>
              <h3 className="text-xl font-semibold mb-2">Sección de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <p className="text-gray-500">Esta funcionalidad se implementará en la siguiente fase</p>
            </div>
          )}
        </div>
      </div>

      {/* ContextMenu for table interactions */}
      {showContextMenu.visible && showContextMenu.table && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-lg border overflow-hidden w-48"
          style={{
            left: `${showContextMenu.x}px`,
            top: `${showContextMenu.y}px`,
          }}
        >
          <div className="px-4 py-2 bg-gray-50 font-medium border-b">
            Mesa {showContextMenu.table.number}
          </div>
          <div className="p-1">
            <button
              onClick={() => {
                setActiveOrderTable(showContextMenu.table);
                setShowOrderModal(true);
                setShowContextMenu({...showContextMenu, visible: false});
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center rounded"
            >
              <Utensils size={16} className="mr-2 text-blue-600" />
              {getTableOrders(showContextMenu.table.id).length > 0 ? (
                <span>Ver pedidos <span className="bg-red-100 text-red-800 text-xs rounded-full px-1.5">
                  {getTableOrders(showContextMenu.table.id).length}
                </span></span>
              ) : (
                <span>Nuevo pedido</span>
              )}
            </button>
            
            <button
              onClick={() => {
                setEditingTable(showContextMenu.table);
                setShowTableModal(true);
                setShowContextMenu({...showContextMenu, visible: false});
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center rounded"
            >
              <Edit size={16} className="mr-2 text-gray-600" />
              Editar mesa
            </button>
            
            <div className="border-t my-1"></div>
            
            <div className="px-3 py-2 text-xs text-gray-500">
              Estado: <span className={`px-1.5 py-0.5 rounded-full ${getTableColor(showContextMenu.table.status).light} ${getTableColor(showContextMenu.table.status).text} font-medium`}>
                {getStatusText(showContextMenu.table.status)}
              </span>
            </div>
            
            {getTableOrders(showContextMenu.table.id).length > 0 && (
              <div className="px-3 py-1 text-xs text-gray-500">
                Total: <span className="font-medium">{getTableTotal(showContextMenu.table.id)}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Close context menu when clicking outside */}
      {showContextMenu.visible && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowContextMenu({...showContextMenu, visible: false})}
        ></div>
      )}

      {/* Modals */}
      {showTableModal && (
        <TableModal 
          onClose={() => setShowTableModal(false)} 
          onSave={(tableData) => {
            if (editingTable) {
              // Update existing table
              setTables(tables.map(table => 
                table.id === editingTable.id ? { ...tableData, id: table.id } : table
              ));
            } else {
              // Add new table
              const newId = Math.max(...tables.map(t => t.id), 0) + 1;
              setTables([...tables, { ...tableData, id: newId }]);
            }
            setShowTableModal(false);
            setEditingTable(null);
          }}
          onDelete={editingTable ? () => {
            setTables(tables.filter(table => table.id !== editingTable.id));
            setShowTableModal(false);
            setEditingTable(null);
          } : undefined}
          table={editingTable}
          salones={salones}
        />
      )}
      
      {/* Salon Modal */}
      {showSalonModal && (
        <SalonModal 
          onClose={() => setShowSalonModal(false)} 
          onSave={(salonData) => {
            if (editingSalon) {
              // Update existing salon
              setSalones(salones.map(salon => 
                salon.id === editingSalon.id ? { ...salonData, id: salon.id } : salon
              ));
              
              // If the active salon was edited, update it
              if (activeSalon === editingSalon.id) {
                setActiveSalon(salonData.id);
              }
            } else {
              // Add new salon
              setSalones([...salones, salonData]);
            }
            setShowSalonModal(false);
            setEditingSalon(null);
          }}
          onDelete={editingSalon ? () => {
            // Check if there are tables in this salon
            const tablesInSalon = tables.some(table => table.salon === editingSalon.id);
            
            if (tablesInSalon) {
              alert('No se puede eliminar un salón que contiene mesas. Mueva las mesas a otro salón primero.');
              return;
            }
            
            setSalones(salones.filter(salon => salon.id !== editingSalon.id));
            
            // If the active salon was deleted, switch to the first available salon
            if (activeSalon === editingSalon.id && salones.length > 1) {
              const newActiveSalon = salones.find(s => s.id !== editingSalon.id)?.id;
              if (newActiveSalon) setActiveSalon(newActiveSalon);
            }
            
            setShowSalonModal(false);
            setEditingSalon(null);
          } : undefined}
          salon={editingSalon}
          existingSalones={salones}
        />
      )}

      {/* Order Modal */}
      {showOrderModal && activeOrderTable && (
        <OrderModal 
          onClose={() => setShowOrderModal(false)}
          table={activeOrderTable}
          orders={getTableOrders(activeOrderTable.id)}
          products={products}
          productCategories={productCategories}
          onSaveOrder={(newOrder, existingOrderId) => {
            if (existingOrderId) {
              // Update existing order
              setOrders(orders.map(order => 
                order.id === existingOrderId ? newOrder : order
              ));
            } else {
              // Add new order
              const newId = Math.max(...orders.map(o => o.id), 0) + 1;
              setOrders([...orders, { ...newOrder, id: newId }]);
              
              // Update table status if it was libre
              if (activeOrderTable.status === 'libre') {
                setTables(tables.map(table => 
                  table.id === activeOrderTable.id ? { ...table, status: 'ocupada', time: '00:01' } : table
                ));
              }
            }
            
            // Update last update time
            setLastUpdate(new Date());
          }}
          onDeleteOrder={(orderId) => {
            setOrders(orders.filter(order => order.id !== orderId));
            
            // If no orders left for this table, update status if not reserved
            if (getTableOrders(activeOrderTable.id).length <= 1 && activeOrderTable.status !== 'reservada') {
              setTables(tables.map(table => 
                table.id === activeOrderTable.id ? { ...table, status: 'libre', time: '00:00' } : table
              ));
            }
          }}
          onPayOrder={(orderId) => {
            // Mark order as paid
            setOrders(orders.map(order => 
              order.id === orderId ? { ...order, status: 'pagado' } : order
            ));
            
            // Update table status if all orders are paid
            const tableOrders = getTableOrders(activeOrderTable.id);
            const allPaid = tableOrders.length === 1 || tableOrders.every(order => order.id === orderId || order.status === 'pagado');
            
            if (allPaid) {
              setTables(tables.map(table => 
                table.id === activeOrderTable.id ? { ...table, status: 'pagando' } : table
              ));
            }
          }}
        />
      )}
    </div>
  );
};

// Modal para añadir/editar mesas
const TableModal = ({ onClose, onSave, onDelete, table, salones }) => {
  const [tableData, setTableData] = useState(
    table ? { ...table } : {
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(tableData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {table ? 'Editar Mesa' : 'Añadir Mesa'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de mesa
              </label>
              <input
                type="number"
                name="number"
                value={tableData.number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salón
              </label>
              <select
                name="salon"
                value={tableData.salon}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad (personas)
              </label>
              <input
                type="number"
                name="seats"
                value={tableData.seats}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma
              </label>
              <select
                name="shape"
                value={tableData.shape}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="circle">Circular</option>
                <option value="rect">Rectangular</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posición X (%)
              </label>
              <input
                type="number"
                name="x"
                value={tableData.x}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posición Y (%)
              </label>
              <input
                type="number"
                name="y"
                value={tableData.y}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              value={tableData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="libre">Libre</option>
              <option value="ocupada">Ocupada</option>
              <option value="pagando">Pagando</option>
              <option value="reservada">Reservada</option>
            </select>
          </div>
          
          <div className="flex justify-between mt-6">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Eliminar Mesa
              </button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
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

// Modal para añadir/editar salones
const SalonModal = ({ onClose, onSave, onDelete, salon, existingSalones }) => {
  const [salonData, setSalonData] = useState(
    salon ? { ...salon } : {
      id: '',
      name: '',
      icon: '🍽️'
    }
  );
  
  const availableIcons = ['🍽️', '☀️', '🌙', '🍸', '🍔', '🍕'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalonData({
      ...salonData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el ID no esté duplicado si es un nuevo salón
    if (!salon && existingSalones.some(s => s.id === salonData.id)) {
      alert('Ya existe un salón con este ID. Por favor elija otro.');
      return;
    }
    
    onSave(salonData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {salon ? 'Editar Salón' : 'Añadir Salón'}
          </h3>
          <button 
            onClick={onClose}
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
              disabled={salon !== null}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              required
            />
            {!salon && (
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
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Eliminar Salón
              </button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
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

// Modal para gestionar pedidos de una mesa
const OrderModal = ({ onClose, table, orders, products, productCategories, onSaveOrder, onDeleteOrder, onPayOrder }) => {
  const [activeTab, setActiveTab] = useState(orders.length > 0 ? 'current' : 'new');
  const [activeOrder, setActiveOrder] = useState(orders.length > 0 ? orders[0] : null);
  const [activeCategory, setActiveCategory] = useState(productCategories[0]?.id);
  const [newOrderItems, setNewOrderItems] = useState([]);
  
  // Get filtered products by category
  const filteredProducts = activeCategory ? 
    products.filter(product => product.category === activeCategory) : 
    products;
  
  // Add item to new order
  const addItemToOrder = (product) => {
    const existingItem = newOrderItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setNewOrderItems(newOrderItems.map(item => 
        item.productId === product.id ? 
          { ...item, quantity: item.quantity + 1 } : 
          item
      ));
    } else {
      setNewOrderItems([...newOrderItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        status: 'pendiente'
      }]);
    }
  };
  
  // Remove item from new order
  const removeItemFromOrder = (productId) => {
    const existingItem = newOrderItems.find(item => item.productId === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setNewOrderItems(newOrderItems.map(item => 
        item.productId === productId ? 
          { ...item, quantity: item.quantity - 1 } : 
          item
      ));
    } else {
      setNewOrderItems(newOrderItems.filter(item => item.productId !== productId));
    }
  };
  
  // Calculate total for new order
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  // Create new order
  const createNewOrder = () => {
    if (newOrderItems.length === 0) {
      alert('Por favor, agregue al menos un producto al pedido.');
      return;
    }
    
    const newOrder = {
      tableId: table.id,
      items: newOrderItems,
      status: 'en curso',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSaveOrder(newOrder);
    setNewOrderItems([]);
    setActiveTab('current');
    onClose();
  };
  
  // Update item status in existing order
  const updateItemStatus = (itemIndex, newStatus) => {
    if (!activeOrder) return;
    
    const updatedItems = activeOrder.items.map((item, idx) => 
      idx === itemIndex ? { ...item, status: newStatus } : item
    );
    
    const updatedOrder = {
      ...activeOrder,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };
    
    onSaveOrder(updatedOrder, activeOrder.id);
    setActiveOrder(updatedOrder);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 h-5/6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Pedidos - Mesa {table.number}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b mb-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'current' ? 
                'border-b-2 border-indigo-500 text-indigo-600' : 
                'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pedidos actuales ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'new' ? 
                'border-b-2 border-indigo-500 text-indigo-600' : 
                'text-gray-500 hover:text-gray-700'
              }`}
            >
              Nuevo pedido
            </button>
          </div>
        </div>
        
        {/* Current Orders Tab */}
        {activeTab === 'current' && (
          <div className="flex-1 flex flex-col">
            {orders.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col">
                <ClipboardList size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500">No hay pedidos activos para esta mesa</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Crear nuevo pedido
                </button>
              </div>
            ) : (
              <div className="flex-1 flex h-full">
                {/* Order list */}
                <div className="w-1/3 border-r overflow-auto">
                  {orders.map((order, index) => (
                    <div 
                      key={order.id}
                      className={`p-3 border-b cursor-pointer ${
                        activeOrder?.id === order.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveOrder(order)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="font-medium">Pedido #{index + 1}</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            order.status === 'en curso' ? 'bg-amber-100 text-amber-800' :
                            order.status === 'pagando' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pagado' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} productos
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {calculateTotal(order.items)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order detail */}
                {activeOrder && (
                  <div className="w-2/3 flex flex-col">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Detalles del pedido</h4>
                        <p className="text-sm text-gray-500">
                          Creado: {new Date(activeOrder.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {activeOrder.status !== 'pagado' && (
                          <>
                            <button
                              onClick={() => onPayOrder(activeOrder.id)}
                              className="bg-emerald-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-emerald-700 flex items-center"
                            >
                              <CreditCard size={14} className="mr-1" />
                              Pagar
                            </button>
                            <button
                              onClick={() => onDeleteOrder(activeOrder.id)}
                              className="bg-red-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-red-700 flex items-center"
                            >
                              <Trash size={14} className="mr-1" />
                              Eliminar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            window.print();
                          }}
                          className="bg-gray-200 text-gray-800 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-300 flex items-center"
                        >
                          <Printer size={14} className="mr-1" />
                          Imprimir
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-4">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeOrder.items.map((item, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="py-3 text-sm font-medium">{item.name}</td>
                              <td className="py-3 text-center">
                                <select
                                  value={item.status}
                                  onChange={(e) => updateItemStatus(idx, e.target.value)}
                                  className={`text-xs rounded px-2 py-1 font-medium border ${
                                    item.status === 'pendiente' ? 'bg-gray-100 text-gray-700' :
                                    item.status === 'preparando' ? 'bg-amber-100 text-amber-700' :
                                    item.status === 'servido' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}
                                  disabled={activeOrder.status === 'pagado'}
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="preparando">Preparando</option>
                                  <option value="servido">Servido</option>
                                </select>
                              </td>
                              <td className="py-3 text-center text-sm">{item.quantity}</td>
                              <td className="py-3 text-right text-sm">{item.price}</td>
                              <td className="py-3 text-right text-sm font-medium">{(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-gray-300">
                            <td colSpan="4" className="py-3 text-right font-medium">Total</td>
                            <td className="py-3 text-right font-bold">{calculateTotal(activeOrder.items)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* New Order Tab */}
        {activeTab === 'new' && (
          <div className="flex-1 flex h-full">
            {/* Product categories and list */}
            <div className="w-2/3 border-r flex flex-col">
              {/* Categories */}
              <div className="border-b p-2 flex space-x-2 overflow-auto">
                {productCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      activeCategory === category.id ? 
                      'bg-indigo-100 text-indigo-700' : 
                      'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* Products */}
              <div className="flex-1 overflow-auto p-3">
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => addItemToOrder(product)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{product.name}</h4>
                        <span className="text-sm font-bold">{product.price}</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{
                          productCategories.find(c => c.id === product.category)?.name
                        }</span>
                        <button className="text-indigo-600 hover:text-indigo-800">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* New order summary */}
            <div className="w-1/3 flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h4 className="font-medium">Nuevo pedido - Mesa {table.number}</h4>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleString()}
                </p>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                {newOrderItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>Seleccione productos para añadir al pedido</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newOrderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.price} × {item.quantity}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{(item.price * item.quantity)}</span>
                          <button 
                            onClick={() => removeItemFromOrder(item.productId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">{calculateTotal(newOrderItems)}</span>
                </div>
                <button
                  onClick={createNewOrder}
                  disabled={newOrderItems.length === 0}
                  className={`w-full py-2 rounded-md text-center text-white font-medium ${
                    newOrderItems.length === 0 ? 
                    'bg-gray-400 cursor-not-allowed' : 
                    'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Crear pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantApp;