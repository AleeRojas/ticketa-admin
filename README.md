# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


src/
├── App.js                    # Componente raíz de la aplicación
├── components/               # Componentes reutilizables
│   ├── layout/               # Componentes de estructura
│   │   ├── Header.jsx        # Encabezado de la aplicación
│   │   ├── Sidebar.jsx       # Barra lateral con navegación
│   │   └── AppTabs.jsx       # Pestañas de navegación principal
│   ├── tables/               # Componentes relacionados con mesas
│   │   ├── TableGrid.jsx     # Vista en cuadrícula de mesas
│   │   ├── TableList.jsx     # Vista en lista de mesas
│   │   ├── TableItem.jsx     # Elemento individual de mesa
│   │   └── TableContextMenu.jsx # Menú contextual para mesas
│   ├── salons/               # Componentes relacionados con salones
│   │   ├── SalonSelector.jsx # Selector de salones
│   │   └── SalonStats.jsx    # Estadísticas del salón activo
│   ├── orders/               # Componentes relacionados con pedidos
│   │   ├── OrderList.jsx     # Lista de pedidos
│   │   ├── OrderDetail.jsx   # Detalle de un pedido
│   │   └── ProductCatalog.jsx # Catálogo de productos para pedidos
│   └── modals/               # Componentes de modal
│       ├── TableModal.jsx    # Modal para editar/crear mesas
│       ├── SalonModal.jsx    # Modal para editar/crear salones
│       └── OrderModal.jsx    # Modal para gestionar pedidos
├── hooks/                    # Hooks personalizados
│   ├── useTableManagement.js # Gestión de mesas
│   ├── useOrderManagement.js # Gestión de pedidos
│   ├── useSalonManagement.js # Gestión de salones
│   └── useRealTimeUpdates.js # Simulación de actualizaciones en tiempo real
├── utils/                    # Utilidades y funciones auxiliares
│   ├── statusHelpers.js      # Funciones para manejar estados
│   ├── calculateTotals.js    # Cálculos financieros
│   └── formatters.js         # Formateo de datos (fechas, moneda, etc.)
├── context/                  # Contextos React
│   ├── AppContext.jsx        # Contexto global de la aplicación
│   ├── TableContext.jsx      # Contexto para mesas
│   └── OrderContext.jsx      # Contexto para pedidos
└── data/                     # Datos simulados
    ├── initialTables.js      # Datos iniciales de mesas
    ├── initialOrders.js      # Datos iniciales de pedidos
    └── products.js           # Catálogo de productos