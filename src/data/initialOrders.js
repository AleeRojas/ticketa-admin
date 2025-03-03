/**
 * Datos iniciales de pedidos
 */
export const initialOrders = [
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
];