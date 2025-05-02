import React, { useState, useEffect } from 'react';
import { X, ClipboardList, CreditCard, Trash, Printer, Plus, Minus, ChevronLeft, ChevronRight, Clock, Check, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import useOrderOperations from '../../hooks/useOrderOperations';

/**
 * Modal para gestionar pedidos de una mesa con interfaz mejorada para móvil
 */
const OrderModal = () => {
  const { 
    showOrderModal, 
    setShowOrderModal, 
    activeOrderTable, 
    getTableOrders,
    products,
    categories,
  } = useAppContext();
  
  // Usar el hook de operaciones de pedidos
  const {
    saveOrder,
    deleteOrder,
    payOrder,
    updateItemStatus
  } = useOrderOperations();
  
  // Si no hay tabla activa, no mostrar nada
  if (!activeOrderTable) return null;
  
  // Obtener los pedidos de la mesa activa
  const orders = getTableOrders(activeOrderTable.id);
  
  // Estado local
  const [activeTab, setActiveTab] = useState(orders.length > 0 ? 'current' : 'new');
  const [activeOrder, setActiveOrder] = useState(orders.length > 0 ? orders[0] : null);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [newOrderItems, setNewOrderItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileView, setMobileView] = useState('list'); // 'list', 'detail', 'new'
  
  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Filtrar productos por categoría
  const filteredProducts = activeCategory ? 
    products.filter(product => product.category === activeCategory) : 
    products;
  
  // Añadir producto al nuevo pedido
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
  
  // Eliminar producto del nuevo pedido
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
  
  // Calcular total del pedido
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  // Crear nuevo pedido
  const createNewOrder = () => {
    if (newOrderItems.length === 0) {
      alert('Por favor, agregue al menos un producto al pedido.');
      return;
    }
    
    const newOrder = {
      tableId: activeOrderTable.id,
      items: newOrderItems,
      status: 'en curso',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveOrder(newOrder);
    setNewOrderItems([]);
    
    if (isMobile) {
      setMobileView('list');
    } else {
      setActiveTab('current');
    }
    
    setShowOrderModal(false);
  };
  
  // Actualizar estado de un producto en el pedido
  const handleUpdateItemStatus = (itemIndex, newStatus) => {
    if (!activeOrder) return;
    
    const updatedItems = activeOrder.items.map((item, idx) => 
      idx === itemIndex ? { ...item, status: newStatus } : item
    );
    
    const updatedOrder = {
      ...activeOrder,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };
    
    saveOrder(updatedOrder, activeOrder.id);
    setActiveOrder(updatedOrder);
  };
  
  // Vista de lista de pedidos para móvil
  const renderMobileOrdersList = () => {
    if (orders.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center flex-col p-4">
          <ClipboardList size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">No hay pedidos activos para esta mesa</p>
          <button
            onClick={() => setMobileView('new')}
            className="mt-4 bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Crear nuevo pedido
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h4 className="text-lg font-medium mb-3">Pedidos activos</h4>
          <div className="grid gap-3">
            {orders.map((order, index) => (
              <div 
                key={order.id}
                className="border rounded-lg overflow-hidden shadow-sm"
                onClick={() => {
                  setActiveOrder(order);
                  setMobileView('detail');
                }}
              >
                <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex items-center">
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
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className="p-3">
                  <div className="mb-3">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            item.status === 'pendiente' ? 'bg-gray-400' :
                            item.status === 'preparando' ? 'bg-amber-400' :
                            'bg-emerald-400'
                          }`}></div>
                          <span className="text-sm">{item.quantity}x {item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{(item.price * item.quantity)} </span>
                      </div>
                    ))}
                    
                    {order.items.length > 2 && (
                      <div className="text-xs text-indigo-600 mt-1">
                        + {order.items.length - 2} productos más
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-500">{order.items.length} productos</span>
                    <span className="font-bold">{calculateTotal(order.items)} </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setMobileView('new')}
            className="mt-4 w-full bg-indigo-600 text-white rounded-md px-4 py-3 text-sm font-medium hover:bg-indigo-700 flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Nuevo pedido
          </button>
        </div>
      </div>
    );
  };
  
  // Vista de detalle de pedido para móvil
  const renderMobileOrderDetail = () => {
    if (!activeOrder) return null;
    
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-3 bg-white border-b flex items-center sticky top-0 z-10">
          <button 
            onClick={() => setMobileView('list')}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h4 className="font-medium">Detalles del pedido</h4>
            <p className="text-xs text-gray-500">
              {new Date(activeOrder.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium">Estado del pedido</h5>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeOrder.status === 'en curso' ? 'bg-amber-100 text-amber-800' :
                activeOrder.status === 'pagando' ? 'bg-blue-100 text-blue-800' :
                activeOrder.status === 'pagado' ? 'bg-emerald-100 text-emerald-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {activeOrder.status}
              </span>
            </div>
            
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  activeOrder.status === 'en curso' ? 'bg-amber-500 w-1/3' :
                  activeOrder.status === 'pagando' ? 'bg-blue-500 w-2/3' :
                  activeOrder.status === 'pagado' ? 'bg-emerald-500 w-full' :
                  'w-0'
                }`}
              ></div>
            </div>
          </div>
          
          <h5 className="font-medium mb-3">Productos</h5>
          <div className="space-y-3 mb-6">
            {activeOrder.items.map((item, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <div className="p-3 flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.price}  × {item.quantity}</div>
                  </div>
                  <span className="font-medium">{(item.price * item.quantity)} </span>
                </div>
                
                <div className="px-3 pb-3 pt-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Estado</span>
                    <select
                      value={item.status || 'pendiente'}
                      onChange={(e) => handleUpdateItemStatus(idx, e.target.value)}
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
                  </div>
                  
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        item.status === 'pendiente' ? 'bg-gray-400 w-1/3' :
                        item.status === 'preparando' ? 'bg-amber-400 w-2/3' :
                        'bg-emerald-400 w-full'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Subtotal</span>
              <span>{calculateTotal(activeOrder.items)} </span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold">{calculateTotal(activeOrder.items)} </span>
            </div>
          </div>
        </div>
        
        <div className="p-3 border-t bg-white sticky bottom-0">
          <div className="grid grid-cols-2 gap-2">
            {activeOrder.status !== 'pagado' && (
              <>
                <button
                  onClick={() => payOrder(activeOrder.id)}
                  className="bg-emerald-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-emerald-700 flex items-center justify-center"
                >
                  <CreditCard size={16} className="mr-2" />
                  Pagar
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
                      deleteOrder(activeOrder.id);
                      setMobileView('list');
                    }
                  }}
                  className="bg-red-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-red-700 flex items-center justify-center"
                >
                  <Trash size={16} className="mr-2" />
                  Eliminar
                </button>
              </>
            )}
            {activeOrder.status === 'pagado' && (
              <button
                onClick={() => setMobileView('list')}
                className="col-span-2 bg-gray-200 text-gray-800 rounded-md py-2.5 text-sm font-medium hover:bg-gray-300 flex items-center justify-center"
              >
                <Check size={16} className="mr-2" />
                Completado
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Vista de nuevo pedido para móvil
  const renderMobileNewOrder = () => {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-3 bg-white border-b flex items-center sticky top-0 z-10">
          <button 
            onClick={() => setMobileView('list')}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h4 className="font-medium">Nuevo pedido</h4>
            <p className="text-xs text-gray-500">
              Mesa {activeOrderTable.number}
            </p>
          </div>
        </div>
        
        {/* Categorías */}
        <div className="border-b bg-white sticky top-14 z-10">
          <div className="p-2 flex space-x-2 overflow-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${
                  activeCategory === category.id ? 
                  'bg-indigo-100 text-indigo-700' : 
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {/* Productos */}
          <div className="p-3">
            <div className="grid grid-cols-1 gap-2">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="border rounded-lg p-3 shadow-sm flex justify-between items-center"
                  onClick={() => addItemToOrder(product)}
                >
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 inline-block mt-1">{
                      categories.find(c => c.id === product.category)?.name
                    }</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-3">{product.price} </span>
                    <button className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Carrito flotante */}
        <div className={`fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-lg transition-transform transform ${
          newOrderItems.length > 0 ? 'translate-y-0' : 'translate-y-32'
        }`}>
          <div className="p-3 flex justify-between items-center">
            <div>
              <div className="text-sm font-medium">{newOrderItems.length} productos en el carrito</div>
              <div className="text-xs text-gray-500">
                {newOrderItems.reduce((total, item) => total + item.quantity, 0)} unidades
              </div>
            </div>
            <div className="font-bold">{calculateTotal(newOrderItems)} </div>
          </div>
        </div>
        
        {/* Barra inferior */}
        <div className="p-3 border-t bg-white sticky bottom-0">
          <div className="flex space-x-3">
            <button
              onClick={() => setMobileView('cart')}
              className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2.5 text-sm font-medium hover:bg-gray-300 flex items-center justify-center"
              disabled={newOrderItems.length === 0}
            >
              <ClipboardList size={16} className="mr-2" />
              Ver carrito ({newOrderItems.length})
            </button>
            <button
              onClick={createNewOrder}
              disabled={newOrderItems.length === 0}
              className={`flex-1 py-2.5 rounded-md text-center text-white font-medium flex items-center justify-center ${
                newOrderItems.length === 0 ? 
                'bg-gray-400 cursor-not-allowed' : 
                'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Check size={16} className="mr-2" />
              Finalizar pedido
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Vista del carrito para móvil
  const renderMobileCart = () => {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-3 bg-white border-b flex items-center sticky top-0 z-10">
          <button 
            onClick={() => setMobileView('new')}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h4 className="font-medium">Resumen del pedido</h4>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {newOrderItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClipboardList size={32} className="mx-auto mb-2 text-gray-300" />
              <p>No hay productos en el carrito</p>
            </div>
          ) : (
            <div className="space-y-3">
              {newOrderItems.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.price} </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => removeItemFromOrder(item.productId)}
                      className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="mx-2 font-medium w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => addItemToOrder(products.find(p => p.id === item.productId))}
                      className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Subtotal</span>
              <span>{calculateTotal(newOrderItems)} </span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold">{calculateTotal(newOrderItems)} </span>
            </div>
          </div>
        </div>
        
        <div className="p-3 border-t bg-white sticky bottom-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setMobileView('new')}
              className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2.5 text-sm font-medium hover:bg-gray-300 flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" />
              Añadir más
            </button>
            <button
              onClick={createNewOrder}
              disabled={newOrderItems.length === 0}
              className={`flex-1 py-2.5 rounded-md text-center text-white font-medium flex items-center justify-center ${
                newOrderItems.length === 0 ? 
                'bg-gray-400 cursor-not-allowed' : 
                'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Check size={16} className="mr-2" />
              Crear pedido
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizado móvil según la vista activa
  const renderMobileContent = () => {
    switch (mobileView) {
      case 'list':
        return renderMobileOrdersList();
      case 'detail':
        return renderMobileOrderDetail();
      case 'new':
        return renderMobileNewOrder();
      case 'cart':
        return renderMobileCart();
      default:
        return renderMobileOrdersList();
    }
  };
  
  // Versiones desktop
  const renderCurrentOrdersTab = () => {
    if (orders.length === 0) {
      return (
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
      );
    }
    
    return (
      <div className="flex-1 flex h-full">
        {/* Lista de pedidos */}
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
        
        {/* Detalle del pedido */}
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
                      onClick={() => payOrder(activeOrder.id)}
                      className="bg-emerald-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-emerald-700 flex items-center"
                    >
                      <CreditCard size={14} className="mr-1" />
                      Pagar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
                          deleteOrder(activeOrder.id);
                          setActiveOrder(null);
                        }
                      }}
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
                          value={item.status || 'pendiente'}
                          onChange={(e) => handleUpdateItemStatus(idx, e.target.value)}
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
                      <td className="py-3 text-right text-sm">{item.price} </td>
                      <td className="py-3 text-right text-sm font-medium">{(item.price * item.quantity)} </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-300">
                    <td colSpan="4" className="py-3 text-right font-medium">Total</td>
                    <td className="py-3 text-right font-bold">{calculateTotal(activeOrder.items)} </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Contenido para la pestaña de nuevo pedido
  const renderNewOrderTab = () => {
    return (
      <div className="flex-1 flex h-full">
        {/* Catálogo de productos */}
        <div className="w-2/3 border-r flex flex-col">
          {/* Categorías */}
          <div className="border-b p-2 flex space-x-2 overflow-auto">
            {categories.map(category => (
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
          
          {/* Productos */}
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
                    <span className="text-sm font-bold">{product.price} </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{
                      categories.find(c => c.id === product.category)?.name
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
        
        {/* Resumen del nuevo pedido */}
        <div className="w-1/3 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h4 className="font-medium">Nuevo pedido - Mesa {activeOrderTable.number}</h4>
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
                      <div className="text-sm text-gray-500">{item.price}  × {item.quantity}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{(item.price * item.quantity)} </span>
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
              <span className="text-xl font-bold">{calculateTotal(newOrderItems)} </span>
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
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl md:p-6 h-full md:h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-3 md:p-0 md:mb-4 bg-white md:bg-transparent border-b md:border-b-0">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Pedidos - Mesa {activeOrderTable.number}
          </h3>
          <button 
            onClick={() => setShowOrderModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {isMobile ? (
          renderMobileContent()
        ) : (
          <>
            {/* Pestañas */}
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
            
            {/* Contenido según pestaña activa */}
            {activeTab === 'current' ? renderCurrentOrdersTab() : renderNewOrderTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderModal;