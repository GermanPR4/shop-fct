import React, { useState, useEffect } from 'react';
import './App.css';

// --- CONFIGURACIÓN DE NAVEGACIÓN ---
const PAGES = {
  HOME: 'HOME',
  CATALOG: 'CATALOG',
  PRODUCT: 'PRODUCT',
  CART: 'CART',
  ADMIN: 'ADMIN',
  LOGIN: 'LOGIN',
};

// --- COMPONENTES AUXILIARES ---

// Componente para la barra de navegación
const Navbar = ({ setPage }) => (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <button onClick={() => setPage(PAGES.HOME)} className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition">
            Store IA
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <NavLink label="Catálogo" onClick={() => setPage(PAGES.CATALOG)} />
          <NavLink label="Ofertas" onClick={() => {}} />
          <NavLink label="Login" onClick={() => setPage(PAGES.LOGIN)} />
          <button onClick={() => setPage(PAGES.CART)} className="relative p-2 rounded-full text-gray-500 hover:text-indigo-600 transition">
            {/* Icono de Carrito (Shopping Cart) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">0</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const NavLink = ({ label, onClick }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">
    {label}
  </button>
);

// Componente para la página principal
const HomePage = ({ products, loading }) => (
  <div className="p-8">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 pb-2">Bienvenido a Store IA</h1>
    <p className="text-gray-600 mb-8">Tu asistente de moda personalizado te espera. Explora nuestro catálogo:</p>

    <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos en Catálogo</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
      {!loading && products.length === 0 && <p className="col-span-4 text-gray-500">No hay productos disponibles para mostrar.</p>}
    </div>
  </div>
);

// Componente de la tarjeta de producto
const ProductCard = ({ product }) => {
  const defaultDetail = product.details && product.details.length > 0 ? product.details[0] : null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-[1.02]">
      <img 
        src={defaultDetail?.image_url || 'https://placehold.co/600x400/312e81/ffffff?text=Prenda+IA'} 
        alt={product.name} 
        className="w-full h-48 object-cover" 
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/312e81/ffffff?text=Prenda+IA' }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.categories.map(c => c.name).join(', ')}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">{product.price.toFixed(2)}€</span>
          <button className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600 transition">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Usamos la variable de entorno de producción o local para la URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'; 

  // Hook para cargar los productos al inicio
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // La URL de tu API de Laravel
        const response = await fetch(`${API_URL}/api/products`); 
        
        if (!response.ok) {
          throw new Error('Error al cargar productos desde la API de Laravel');
        }
        
        const data = await response.json();
        setProducts(data);
        
      } catch (error) {
        console.error('Error al obtener el catálogo:', error);
        // Puedes mostrar un mensaje de error en la UI si lo deseas
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // Lógica simple de enrutamiento (Routing)
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.HOME:
        return <HomePage products={products} loading={loading} />;
      case PAGES.CATALOG:
        return <HomePage products={products} loading={loading} />;
      default:
        return <HomePage products={products} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setPage={setCurrentPage} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
      
      {/* Footer simple (Puedes completarlo después) */}
      <footer className="w-full text-center p-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Tienda FCT - Desarrollado por Germán Peña Ruiz.
      </footer>
    </div>
  );
}
