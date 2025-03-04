import React, { useState } from 'react';
import { X, ClipboardList, CreditCard, Trash, Printer, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import useOrderOperations from '../../hooks/useOrderOperations';

/**
 * Modal para gestionar pedidos de una mesa
 */
const OrderModal = () => {
  const { 
    showOrderModal, 
    setShowOrderModal, 
    activeOrderTable, 
    getTableOrders,
    products,
    categories, // Cambiado de productCategories a categories
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
    setActiveTab('current');
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
  
  // Contenido para la pestaña de pedidos actuales
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
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 h-5/6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Pedidos - Mesa {activeOrderTable.number}
          </h3>
          <button 
            onClick={() => setShowOrderModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
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
      </div>
    </div>
  );
};

export default OrderModal;