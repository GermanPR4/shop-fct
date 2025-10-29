import React, { useState, useEffect } from 'react';
// Importa los componentes
import HeroSection from './components/HeroSection.jsx';
import PopularCategories from './components/PopularCategories.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import CategoryFilter from './components/CategoryFilter.jsx'; // Asegúrate de que este archivo existe

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

// Navbar (Corregido NavIconButton)
const Navbar = ({ setPage }) => (
 <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo y Categorías */}
        <div className="flex items-center space-x-4">
           <button onClick={() => setPage(PAGES.HOME)} className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">
             OmniStyle
           </button>
           <button className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-indigo-600 bg-gray-100 px-3 py-1.5 rounded-md">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
             <span>Categorías</span>
           </button>
        </div>
        {/* Barra de Búsqueda */}
        <div className="flex-1 px-4 hidden md:block">
          <input type="text" placeholder="Buscar productos..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"/>
        </div>
        {/* Iconos Derecha */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <NavIconButton icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} label="Buscar" className="md:hidden" />
          <NavIconButton onClick={() => setPage(PAGES.CART)} icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} label="Bolsa" count={0} />
          <NavIconButton onClick={() => setPage(PAGES.LOGIN)} icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} label="Cuenta" />
        </div>
      </div>
      {/* Enlaces secundarios */}
      <div className="hidden md:flex justify-center space-x-8 py-2 border-t border-gray-100">
         <SecondaryNavLink label="Novedades" />
         <SecondaryNavLink label="Rebajas" active={true} />
         <SecondaryNavLink label="Hombre" />
         <SecondaryNavLink label="Mujer" />
         <SecondaryNavLink label="Zapatillas" />
      </div>
    </div>
  </nav>
);

// Componente para botones de icono en Navbar (Corregido)
const NavIconButton = ({ icon, label, count, onClick, className = '' }) => (
  <button onClick={onClick} className={`relative p-1 text-gray-500 hover:text-indigo-600 transition ${className}`}>
    {icon}
    {count !== undefined && (
      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{count}</span>
    )}
    {/* Usamos el label para accesibilidad */}
    <span className="sr-only">{label}</span>
  </button>
);

// Componente para enlaces secundarios en Navbar
const SecondaryNavLink = ({ label, active = false }) => (
   <button className={`text-sm font-medium ${active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'} transition`}>
     {label}
   </button>
);


// Componente Tarjeta de Producto
const ProductCard = ({ product, setPage, setSelectedProduct }) => {
  const defaultDetail = product.details && product.details.length > 0 ? product.details[0] : null;

  const handleViewDetails = () => {
    setSelectedProduct(product);
    setPage(PAGES.PRODUCT);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden group transition hover:shadow-md cursor-pointer" onClick={handleViewDetails}>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
        <img src={defaultDetail?.image_url || 'https://placehold.co/400x400/E5E7EB/4B5563?text=OmniStyle'} alt={product.name} className="w-full h-full object-center object-cover group-hover:opacity-75" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/E5E7EB/4B5563?text=OmniStyle'}}/>
      </div>
      <div className="p-4 text-left">
        <h3 className="text-sm font-medium text-gray-700 mb-1 truncate">{product.name}</h3>
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span className="text-gray-300">⭐</span>
          <span className="ml-1">(1.2k)</span>
        </div>
        <p className="text-md font-semibold text-gray-900">{product.price.toFixed(2)}€</p>
      </div>
    </div>
  );
};

// --- PÁGINAS PRINCIPALES ---

// Página de Catálogo / Home
const HomePage = ({ products, loading, categories, onSelectCategory, setPage, setSelectedProduct, selectedCategoryId }) => ( // Renombrado a selectedCategoryId
  <div className="px-4 sm:px-0 py-8">
    <HeroSection />
    {/* Pasamos selectedCategoryId directamente a CategoryFilter */}
    <PopularCategories categories={categories} onSelectCategory={onSelectCategory} />
    <CategoryFilter categories={categories} onSelectCategory={onSelectCategory} selectedCategoryId={selectedCategoryId} />


    <div className="mb-12">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold text-gray-800">Las Mejores Ofertas Para Ti</h2>
         <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Ver Todas &rarr;</button>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {loading ? (
           <p className="col-span-full text-center py-10 text-gray-500">Cargando ofertas...</p>
         ) : (
           products.slice(0, 4).map(product => (
             <ProductCard key={product.id} product={product} setPage={setPage} setSelectedProduct={setSelectedProduct} />
           ))
         )}
       </div>
    </div>
  </div>
);

// Página de Detalle de Producto (Corregida)
const ProductDetailPage = ({ product }) => {
  // --- CORRECCIÓN: useState DEBE ir ANTES del return condicional ---
  // Usamos optional chaining (?.) para seguridad si product es null inicialmente
  const [selectedColor, setSelectedColor] = useState(product?.details?.[0]?.color);
  const [selectedSize, setSelectedSize] = useState(product?.details?.[0]?.size);
  // --- FIN CORRECCIÓN ---

  // --- CORRECCIÓN: useEffect DEBE ir ANTES del return condicional ---
  useEffect(() => {
      // Solo ejecutar si hay detalles y tallas disponibles
      if (product && product.details) {
          const availableSizesForColor = [...new Set(product.details.filter(d => d.color === selectedColor).map(d => d.size))];
          // Solo actualiza si hay tallas disponibles para ese color y la actual no está incluida
          if (availableSizesForColor.length > 0 && !availableSizesForColor.includes(selectedSize)) {
              setSelectedSize(availableSizesForColor[0]); // Selecciona la primera talla disponible
          }
      }
  }, [product, selectedColor, selectedSize]); // Añadimos 'product' a las dependencias
  // --- FIN CORRECCIÓN ---


  // Early return si no hay producto o detalles
  if (!product || !product.details || product.details.length === 0) {
      // Asegurarse de que los hooks se llamaron antes si product es null inicialmente
      // Si product pudiera ser null al principio, necesitaríamos inicializar los useState con null
      // Pero como llegamos aquí desde una ProductCard, asumimos que product tiene datos.
      return <p className="text-center py-10 text-gray-500">Detalles del producto no disponibles.</p>;
  }

  // Ahora podemos calcular esto de forma segura
  const currentDetail = product.details.find(d => d.color === selectedColor && d.size === selectedSize) || product.details[0];
  const availableColors = [...new Set(product.details.map(d => d.color))];
  const availableSizes = [...new Set(product.details.filter(d => d.color === selectedColor).map(d => d.size))];

  return (
    <div className="p-4 sm:p-8 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      {/* Columna Izquierda: Imágenes */}
      <div className="md:w-1/2">
        <img src={currentDetail?.image_url || 'https://placehold.co/600x600/E5E7EB/4B5563?text=OmniStyle'} alt={product.name} className="w-full rounded-lg shadow-lg mb-4 aspect-square object-cover" />
        <div className="flex space-x-2 overflow-x-auto">
          {/* Muestra miniaturas únicas por color */}
          {[...new Map(product.details.map(item => [item['color'], item])).values()].map(detail => (
             <img key={detail.id} src={detail.image_url || 'https://placehold.co/100x100/E5E7EB/4B5563?text=Var'} alt={`${product.name} ${detail.color}`} className={`w-16 h-16 rounded object-cover cursor-pointer border-2 ${selectedColor === detail.color ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'}`} onClick={() => setSelectedColor(detail.color)}/>
          ))}
        </div>
      </div>

      {/* Columna Derecha: Información y Compra */}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center mb-4">
          <span className="text-xs text-yellow-500">⭐⭐⭐⭐⭐</span> <span className="text-xs text-gray-500 ml-1">(50)</span>
        </div>
        <p className="text-3xl font-semibold text-indigo-600 mb-6">{product.price.toFixed(2)}€</p>
        <p className="text-gray-600 mb-6">{product.short_description}</p>

        {/* Selector de Color */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Color: <span className="font-semibold">{selectedColor}</span></h3>
          <div className="flex space-x-2">
            {availableColors.map(color => (
              <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${selectedColor === color ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-gray-300'}`} style={{ backgroundColor: color.toLowerCase() }} title={color}></button>
            ))}
          </div>
        </div>

        {/* Selector de Talla */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Talla: <span className="font-semibold">{selectedSize}</span></h3>
          <div className="flex flex-wrap gap-2">
            {/* Mostrar solo las tallas disponibles para el color seleccionado */}
            {availableSizes.map(size => (
              <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedSize === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad y Añadir al Carrito */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center border rounded">
             <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50" >-</button>
             <span className="px-4 py-2 font-medium">1</span> {/* Cantidad (pendiente) */}
             <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
          </div>
          <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-75" disabled={!currentDetail || currentDetail.stock <= 0}>
            {currentDetail && currentDetail.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
          </button>
        </div>

        {/* Acordeones */}
        <div className="border-t pt-4">
           <h4 className="font-medium mb-1">Descripción</h4>
           <p className="text-sm text-gray-600">{product.long_description || product.short_description}</p>
        </div>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL (LAYOUT) ---

export default function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto para la página de detalle

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Carga inicial de catálogo
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await fetch(`${API_URL}/api/categories`);
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const productsResponse = await fetch(`${API_URL}/api/products`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setAllProducts(productsData);
        // Inicialmente, mostrar todos los productos
        setProducts(productsData); 

      } catch (error) {
        console.error('Error al obtener el catálogo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [API_URL]); // Dependencia correcta

  // Aplicar filtro cuando cambie la categoría seleccionada o los productos base
  useEffect(() => {
    // Si no hay productos base cargados, no hacer nada
    if (!allProducts || allProducts.length === 0) return; 

    if (selectedCategory) {
      const filtered = allProducts.filter(p => p.categories.some(c => c.id === selectedCategory));
      setProducts(filtered);
    } else {
      // Si no hay categoría seleccionada, mostrar todos
      setProducts(allProducts); 
    }
  }, [selectedCategory, allProducts]); // Dependencias correctas


  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Navegar a la página de catálogo si estamos en otra página
    if (currentPage !== PAGES.CATALOG && currentPage !== PAGES.HOME) {
      setCurrentPage(PAGES.CATALOG);
    }
  };

  const renderPage = () => {
    switch (currentPage) { // Se usa currentPage aquí
        case PAGES.PRODUCT:
            // Asegurarse de que selectedProduct tenga datos antes de renderizar
            return selectedProduct ? <ProductDetailPage product={selectedProduct} /> : <p>Cargando producto...</p>;
        case PAGES.LOGIN:
            return <h2 className="text-2xl text-center py-20">Página de Login (PENDIENTE)</h2>;
        case PAGES.CART:
            return <h2 className="text-2xl text-center py-20">Página del Carrito (PENDIENTE)</h2>;
        case PAGES.CATALOG: // CATALOG y HOME muestran lo mismo por ahora
        case PAGES.HOME:
        default:
            return (
                <HomePage
                    products={products}
                    loading={loading}
                    categories={categories}
                    onSelectCategory={handleCategorySelect} // Usamos la nueva función
                    setPage={setCurrentPage}
                    setSelectedProduct={setSelectedProduct}
                    // Pasamos el ID de la categoría seleccionada aquí
                    selectedCategoryId={selectedCategory} 
                />
            );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar setPage={setCurrentPage} />

      <main className="flex-grow w-full mx-auto py-6 sm:px-6 lg:px-8">
        {renderPage()}
      </main>

      {/* Widget de Chat Flotante */}
      <ChatWidget />

      <footer className="w-full text-center p-4 text-xs text-gray-500 border-t border-gray-200">
        &copy; {new Date().getFullYear()} OmniStyle - Desarrollado por Germán Peña Ruiz.
      </footer>
    </div>
  );
}

