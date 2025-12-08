import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext.jsx';
import HeroSection from './components/HeroSection.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import AllCategoriesPage from './components/AllCategoriesPage.jsx';
import AllProductsPage from './components/AllProductsPage.jsx';

const PAGES = {
  HOME: 'HOME',
  CATALOG: 'CATALOG',
  PRODUCT: 'PRODUCT',
  CART: 'CART',
  CHECKOUT: 'CHECKOUT',
  ADMIN: 'ADMIN',
  LOGIN: 'LOGIN',
  PROFILE: 'PROFILE',
  ORDERS: 'ORDERS',
  FAVORITES: 'FAVORITES',
  SETTINGS: 'SETTINGS',
};

/**
 * Barra de navegación principal con búsqueda, categorías y menú de usuario.
 * Gestiona el dropdown de categorías, la búsqueda de productos y atajos de teclado.
 */
const Navbar = ({ setPage, cartItemCount, user, onLogout, onOpenCartSidebar, categories, selectedCategory, onCategorySelect }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Atajo de teclado Cmd/Ctrl + K para enfocar la búsqueda
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.categories-dropdown')) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="nav-gradient sticky top-0 z-50 shadow-adapted-xl backdrop-blur-sm">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-18 py-2">
        {/* Logo y Categorías */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setPage(PAGES.HOME)} 
            className="group flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 transition-all duration-500 transform hover:scale-105 border-0 shadow-none hover:border-0 hover:shadow-none focus:border-0 focus:shadow-none outline-none"
          >
            <svg className="h-8 w-8 text-purple-500 group-hover:text-emerald-500 transition-colors duration-500 transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7L12 2z"/>
              <circle cx="12" cy="12" r="3" style={{ fill: 'var(--circle-color, #fff)' }} className="[--circle-color:#fff] dark:[--circle-color:#000]"/>
            </svg>
            <span>OmniStyle</span>
          </button>
          
          <div className="relative categories-dropdown">
            <button 
              onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
              className="btn-category hidden lg:flex items-center space-x-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8M4 18h16" />
              </svg>
              <span>{selectedCategory ? categories.find(cat => cat.id === selectedCategory)?.name || 'Categorías' : 'Categorías'}</span>
              <svg className={`h-4 w-4 transform transition-transform duration-300 ${showCategoriesDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown de Categorías */}
            {showCategoriesDropdown && (
              <div className="dropdown-bg absolute left-0 mt-2 w-72 rounded-2xl shadow-adapted-xl py-2 z-50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 overflow-hidden">
                {/* Header del dropdown */}
                <div className="settings-card-header px-4 py-3">
                  <h3 className="text-sm font-semibold text-adapted flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Explora nuestras categorías
                  </h3>
                </div>

                {/* Opción para mostrar todas las categorías */}
                <button
                  onClick={() => {
                    onCategorySelect(null);
                    setShowCategoriesDropdown(false);
                    setPage(PAGES.CATALOG);
                  }}
                  className={`dropdown-item-base group flex items-center w-full px-4 py-3 text-sm transition-all duration-200 transform hover:translate-x-1 ${
                    !selectedCategory ? 'active' : ''
                  }`}
                >
                  <div className={`category-icon-bg w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
                    !selectedCategory ? 'active' : ''
                  }`}>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Todas las categorías</div>
                    <div className="text-xs text-adapted-tertiary">Ver todos los productos</div>
                  </div>
                  {!selectedCategory && (
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Lista de categorías */}
                <div className="max-h-64 overflow-y-auto overflow-x-hidden custom-scrollbar">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          onCategorySelect(category.id);
                          setShowCategoriesDropdown(false);
                          setPage(PAGES.CATALOG);
                        }}
                        className={`dropdown-item-base group flex items-center w-full px-4 py-3 text-sm transition-all duration-200 transform hover:translate-x-1 ${
                          selectedCategory === category.id ? 'active' : ''
                        }`}
                      >
                        <div className={`category-icon-bg w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
                          selectedCategory === category.id ? 'active' : ''
                        }`}>
                          <span className="text-xs font-bold text-adapted-secondary group-hover:text-emerald-400">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-adapted-tertiary">
                            {category.description || 'Explora esta categoría'}
                          </div>
                        </div>
                        {selectedCategory === category.id && (
                          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <svg className="mx-auto w-8 h-8 icon-color mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm text-adapted-tertiary">No hay categorías disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barra de Búsqueda Funcional Mejorada */}
        <div className="flex-1 max-w-xl mx-6 hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 icon-color group-focus-within:text-emerald-400 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descubre productos increíbles..." 
              className="search-input w-full pl-12 pr-20 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 icon-color rounded-full hover:bg-dark-adapted transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={!searchTerm.trim()}
                className="p-1.5 icon-color hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-emerald-900/30 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-adapted-tertiary bg-dark-adapted border border-adapted rounded">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>

        {/* Iconos Derecha Mejorados */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <NavIconButton 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            icon={
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            } 
            label="Buscar" 
            className="md:hidden" 
          />
          
          <NavIconButton 
            onClick={onOpenCartSidebar} 
            icon={
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            } 
            label="Carrito" 
            count={cartItemCount} 
          />
          
          <div className="hidden sm:block w-px h-8 bg-gray-600"></div>
          
          {user ? (
            <>
              {user.role === 'employee' && (
                <NavIconButton 
                  onClick={() => setPage(PAGES.ADMIN)} 
                  icon={
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
                    </svg>
                  } 
                  label="Panel de Admin" 
                  className="ring-2 ring-yellow-500/30 text-yellow-400 hover:text-yellow-300"
                />
              )}
              <UserDropdown user={user} onLogout={onLogout} setPage={setPage} />
            </>
          ) : (
            <NavIconButton 
              onClick={() => setPage(PAGES.LOGIN)} 
              icon={
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              } 
              label="Iniciar Sesión" 
            />
          )}
        </div>
      </div>
      
      {/* Barra de búsqueda móvil */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-4 border-t border-slate-100">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar productos..." 
              className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-slate-400"
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={!searchTerm.trim()}
                className="p-1.5 text-emerald-600 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg hover:bg-emerald-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Enlaces secundarios mejorados */}
      {/* <div className="hidden lg:flex justify-center items-center space-x-6 py-4 border-t border-slate-100/50 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent">
        <SecondaryNavLink label="✨ Novedades" />
        <SecondaryNavLink label="🔥 Rebajas" />
        <SecondaryNavLink label="👔 Hombre" />
        <SecondaryNavLink label="👗 Mujer" />
        <SecondaryNavLink label="👟 Zapatillas" />
      </div> */}
    </div>
  </nav>
  );
};

// Componente para botones de icono en Navbar (Corregido)
const NavIconButton = ({ icon, label, count, onClick, className = '' }) => (
  <button 
    onClick={onClick} 
    className={`group relative p-3 text-gray-300 hover:text-emerald-400 hover:bg-gradient-to-br hover:from-emerald-900/30 hover:to-green-900/30 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-md border border-transparent hover:border-emerald-500/30 ${className}`}
  >
    <div className="transform transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    {count !== undefined && count > 0 && (
      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg animate-pulse border-2 border-gray-900">
        {count > 99 ? '99+' : count}
      </span>
    )}
    {/* Tooltip mejorado */}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
      {label}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rotate-45"></div>
    </div>
    <span className="sr-only">{label}</span>
  </button>
);

// Componente para enlaces secundarios en Navbar mejorado
const SecondaryNavLink = ({ label, active = false }) => (
  <button className={`group relative text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
    active 
      ? 'text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg border border-emerald-400' 
      : 'text-slate-600 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 border border-transparent hover:border-emerald-200 hover:shadow-md'
  }`}>
    <span className="relative z-10">{label}</span>
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    )}
  </button>
);

// Componente Sidebar del Carrito
const CartSidebar = ({ isOpen, onClose, cartItems, setCartItems, setPage }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const goToCart = () => {
    setPage(PAGES.CART);
    onClose();
  };

  const goToCheckout = () => {
    setPage(PAGES.CHECKOUT);
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-700 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-transparent">
            <h2 className="text-base font-semibold text-white">
              Mi Carrito ({cartItems.length})
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Tu carrito está vacío</h3>
                <p className="text-sm text-gray-400 mb-6">¡Descubre productos increíbles!</p>
                <button
                  onClick={() => {
                    setPage(PAGES.HOME);
                    onClose();
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explorar productos
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-xl border border-gray-700/50 shadow-sm hover:bg-gray-700/50 transition-all duration-200 p-4">
                    <div className="flex gap-4">
                      {/* Imagen */}
                      <img
                        src={item.image || 'https://placehold.co/80x80/374151/9CA3AF?text=P'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md flex-shrink-0 ring-2 ring-gray-700"
                      />
                      
                      {/* Contenido */}
                      <div className="flex-1 flex flex-col gap-2">
                        {/* Nombre y botón eliminar */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-white leading-tight flex-1">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-lg transition-all duration-200 flex-shrink-0"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Color y talla */}
                        <div className="text-[10px] text-gray-400">
                          <span className="bg-gray-700 px-2 py-0.5 rounded-md">{item.color} • {item.size}</span>
                        </div>
                        
                        {/* Precio y controles de cantidad */}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-bold text-emerald-400">
                            {item.price.toFixed(2)}€
                          </span>
                          
                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-0.5 bg-gray-700/50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-white font-bold hover:bg-gray-600 rounded-md transition-colors text-lg"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold min-w-[2rem] text-center text-white px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-white font-bold hover:bg-gray-600 rounded-md transition-colors text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer con total y botones */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-700 space-y-3 bg-gradient-to-t from-gray-800 to-transparent">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">Subtotal:</span>
                <span className="text-lg font-bold text-emerald-400">{subtotal.toFixed(2)}€</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={goToCheckout}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  💳 Finalizar Compra
                </button>
                <button
                  onClick={goToCart}
                  className="w-full bg-gray-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-gray-500"
                >
                  🛍️ Ver Carrito Completo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Componente dropdown para usuario logueado
const UserDropdown = ({ user, onLogout, setPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative user-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-3 p-3 text-gray-200 hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-900/30 hover:to-green-900/30 rounded-xl transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-emerald-500/30 hover:shadow-lg"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-800 group-hover:ring-emerald-500/50 transition-all duration-300">
            <span className="text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full"></div>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors duration-300">
            {user.name.split(' ')[0]}
          </div>
          <div className="text-xs text-gray-400">Mi cuenta</div>
        </div>
        <svg
          className={`w-4 h-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600/50 py-2 z-50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 overflow-hidden">
          {/* Header del usuario mejorado */}
          <div className="px-5 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-700 to-transparent">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-gray-400 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-1">
            <button
              onClick={() => {
                setPage(PAGES.PROFILE);
                setIsOpen(false);
              }}
              className="group flex items-center w-full px-5 py-3 text-sm text-gray-200 hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-900/30 hover:to-green-900/30 transition-all duration-200 transform hover:translate-x-1"
            >
              <div className="w-8 h-8 bg-purple-800/50 group-hover:bg-purple-700/60 rounded-lg flex items-center justify-center mr-3 transition-all duration-200">
                <svg className="w-4 h-4 dark:text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Mi Perfil</div>
                <div className="text-xs text-gray-400">Datos personales</div>
              </div>
            </button>

            <button
              onClick={() => {
                setPage(PAGES.ORDERS);
                setIsOpen(false);
              }}
              className="group flex items-center w-full px-5 py-3 text-sm text-gray-200 hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-900/30 hover:to-green-900/30 transition-all duration-200 transform hover:translate-x-1"
            >
              <div className="w-8 h-8 bg-indigo-800/50 group-hover:bg-indigo-700/60 rounded-lg flex items-center justify-center mr-3 transition-all duration-200">
                <svg className="w-4 h-4 dark:text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Mis Pedidos</div>
                <div className="text-xs text-gray-400">Historial de compras</div>
              </div>
            </button>

            <button
              onClick={() => {
                setPage(PAGES.FAVORITES);
                setIsOpen(false);
              }}
              className="group flex items-center w-full px-5 py-3 text-sm text-gray-200 hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-900/30 hover:to-green-900/30 transition-all duration-200 transform hover:translate-x-1"
            >
              <div className="w-8 h-8 bg-pink-800/50 group-hover:bg-pink-700/60 rounded-lg flex items-center justify-center mr-3 transition-all duration-200">
                <svg className="w-4 h-4 dark:text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Favoritos</div>
                <div className="text-xs text-gray-400">Lista de deseos</div>
              </div>
            </button>

            <hr className="my-2 mx-3 border-gray-700" />

            <button
              onClick={() => {
                setPage(PAGES.SETTINGS);
                setIsOpen(false);
              }}
              className="group flex items-center w-full px-5 py-3 text-sm text-gray-200 hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-900/30 hover:to-green-900/30 transition-all duration-200 transform hover:translate-x-1"
            >
              <div className="w-8 h-8 bg-amber-800/50 group-hover:bg-amber-700/60 rounded-lg flex items-center justify-center mr-3 transition-all duration-200">
                <svg className="w-4 h-4 dark:text-black-4 00" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Configuración</div>
                <div className="text-xs text-gray-400">Ajustes de cuenta</div>
              </div>
            </button>

            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="group flex items-center w-full px-5 py-3 text-sm text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:translate-x-1 border-t border-gray-700 mt-2"
            >
              <div className="w-8 h-8 bg-red-800/50 group-hover:bg-red-700/60 rounded-lg flex items-center justify-center mr-3 transition-all duration-200">
                <svg className="w-4 h-4 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Cerrar Sesión</div>
                <div className="text-xs text-gray-400 group-hover:text-red-200">Salir de mi cuenta</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// Componente Tarjeta de Producto
const ProductCard = ({ product, setPage, setSelectedProduct }) => {
  const defaultDetail = product.details && product.details.length > 0 ? product.details[0] : null;

  const handleViewDetails = () => {
    setSelectedProduct(product);
    setPage(PAGES.PRODUCT, product.id);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden group transition hover:shadow-xl hover:border-emerald-500/30 cursor-pointer" onClick={handleViewDetails}>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-700">
        <img src={defaultDetail?.image_url || 'https://placehold.co/400x400/374151/9CA3AF?text=OmniStyle'} alt={product.name} className="w-full h-full object-center object-contain group-hover:opacity-75" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/374151/9CA3AF?text=OmniStyle' }} />
      </div>
      <div className="p-4 text-left">
        <h3 className="text-sm font-medium text-white mb-1 truncate">{product.name}</h3>
        <div className="flex items-center text-xs text-gray-400 mb-1">
          <span className="text-yellow-400">⭐</span><span className="text-yellow-400">⭐</span><span className="text-yellow-400">⭐</span><span className="text-yellow-400">⭐</span><span className="text-gray-600">⭐</span>
          <span className="ml-1">(1.2k)</span>
        </div>
        <p className="text-md font-semibold text-emerald-400">{product.price.toFixed(2)}€</p>
      </div>
    </div>
  );
};

/**
 * Página principal con ofertas destacadas y filtros de categoría
 */
const HomePage = ({ products, loading, categories, onSelectCategory, setPage, setSelectedProduct, selectedCategoryId }) => {
  const navigate = useNavigate();

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  return (
    <div className="px-4 sm:px-0 py-8">
      <HeroSection products={products} />
      <CategoryFilter categories={categories} onSelectCategory={onSelectCategory} selectedCategoryId={selectedCategoryId} />


      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Las Mejores Ofertas Para Ti</h2>
          <button 
            onClick={handleViewAllProducts}
            className="group text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-all duration-200 flex items-center space-x-2 bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-2 rounded-lg border border-emerald-400/30 hover:border-emerald-400/50"
          >
            <span>Ver Productos</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="col-span-full text-center py-10 text-gray-500">Cargando ofertas...</p>
          ) : (
            products
              .sort(() => Math.random() - 0.5)
              .slice(0, 4)
              .map(product => (
                <ProductCard key={product.id} product={product} setPage={setPage} setSelectedProduct={setSelectedProduct} />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Página de detalle del producto con selector de variantes y botón de compra.
 * Los hooks se declaran antes de any early return para cumplir las reglas de React.
 */
const ProductDetailPage = ({ product, addToCart, toggleFavorite, isFavorite }) => {
  /**
   * IMPORTANTE: Los hooks deben declararse antes de cualquier early return.
   * Usamos optional chaining para manejar casos donde product es null.
   */
  const [selectedColor, setSelectedColor] = useState(product?.details?.[0]?.color);
  const [selectedSize, setSelectedSize] = useState(product?.details?.[0]?.size);
  const [quantity, setQuantity] = useState(1);

  // Actualiza las tallas disponibles cuando cambia el color seleccionado
  useEffect(() => {
    if (product && product.details) {
      const availableSizesForColor = [...new Set(product.details.filter(d => d.color === selectedColor).map(d => d.size))];
      if (availableSizesForColor.length > 0 && !availableSizesForColor.includes(selectedSize)) {
        setSelectedSize(availableSizesForColor[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);


  if (!product || !product.details || product.details.length === 0) {
    return <p className="text-center py-10 text-gray-500">Detalles del producto no disponibles.</p>;
  }

  // Ahora podemos calcular esto de forma segura
  const currentDetail = product.details.find(d => d.color === selectedColor && d.size === selectedSize) || product.details[0];
  const availableColors = [...new Set(product.details.map(d => d.color))];
  const availableSizes = [...new Set(product.details.filter(d => d.color === selectedColor).map(d => d.size))];

  return (
    <div className="p-4 sm:p-8 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-md border border-gray-700">
      {/* Columna Izquierda: Imágenes */}
      <div className="md:w-1/2">
        <div className="relative group bg-gray-700 rounded-2xl">
          <img 
            src={currentDetail?.image_url || 'https://placehold.co/600x600/374151/9CA3AF?text=OmniStyle'} 
            alt={product.name} 
            className="w-full rounded-2xl shadow-2xl mb-6 aspect-square object-contain p-4 border border-gray-700 group-hover:shadow-blue-500/20 transition-all duration-300" 
          />
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            ✨ Nuevo
          </div>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {/* Muestra miniaturas únicas por color */}
          {[...new Map(product.details.map(item => [item['color'], item])).values()].map(detail => (
            <div key={detail.id} className="relative flex-shrink-0">
              <img 
                src={detail.image_url || 'https://placehold.co/100x100/374151/9CA3AF?text=Var'} 
                alt={`${product.name} ${detail.color}`} 
                className={`w-20 h-20 rounded-xl object-contain cursor-pointer border-3 transition-all duration-200 ${selectedColor === detail.color ? 'border-blue-400 shadow-md' : 'border-gray-600 hover:border-gray-400'}`} 
                onClick={() => setSelectedColor(detail.color)} 
              />
              {selectedColor === detail.color && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Columna Derecha: Información y Compra */}
      <div className="md:w-1/2">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-white leading-tight">{product.name}</h1>
          <button
            onClick={() => toggleFavorite(product.id)}
            className="p-2 rounded-full hover:bg-gray-700 transition-all duration-300 group"
          >
            <svg 
              className={`w-6 h-6 transition-colors duration-300 ${isFavorite(product.id) ? 'text-red-400 fill-current' : 'text-gray-400 group-hover:text-red-400'}`} 
              fill={isFavorite(product.id) ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center bg-yellow-500/20 px-2 py-1 rounded-lg">
            <span className="text-sm text-yellow-400">⭐⭐⭐⭐⭐</span> 
            <span className="text-sm text-gray-300 ml-2">(50 reseñas)</span>
          </div>
        </div>
        <div className="mb-6">
          {/* Verificar si tiene ofertas activas */}
          {product.offers && product.offers.length > 0 ? (
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-emerald-400">
                {(parseFloat(product.price) * (1 - parseFloat(product.offers[0].discount_percentage) / 100)).toFixed(2)}€
              </p>
              <p className="text-2xl text-gray-500 line-through">
                {product.price.toFixed(2)}€
              </p>
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                -{product.offers[0].discount_percentage}% OFF
              </span>
            </div>
          ) : (
            <p className="text-4xl font-bold text-emerald-400 mb-2">{product.price.toFixed(2)}€</p>
          )}
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <p className="text-gray-200 leading-relaxed">{product.short_description}</p>
        </div>

        {/* Selector de Color */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Color: <span className="text-blue-400">{selectedColor}</span></h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map(color => (
              <button 
                key={color} 
                onClick={() => setSelectedColor(color)} 
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${selectedColor === color ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-gray-700 text-gray-200 border-gray-600 hover:border-gray-400'}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Talla */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Talla: <span className="text-emerald-400">{selectedSize}</span></h3>
          <div className="grid grid-cols-4 gap-3">
            {/* Mostrar solo las tallas disponibles para el color seleccionado */}
            {availableSizes.map(size => (
              <button key={size} onClick={() => setSelectedSize(size)} className={`py-3 px-4 border-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${selectedSize === size ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/30' : 'bg-gray-700 text-white border-gray-600 hover:bg-emerald-700/20 hover:border-emerald-500'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad y Añadir al Carrito */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">Cantidad:</span>
            <div className="flex items-center gap-1 border-2 border-gray-600 rounded-lg p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-white font-bold hover:bg-gray-600 disabled:opacity-50 rounded-md transition-colors text-xl"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="px-6 py-2 font-bold text-white min-w-[3rem] text-center text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-white font-bold hover:bg-gray-600 rounded-md transition-colors text-xl"
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (currentDetail && currentDetail.stock > 0) {
                addToCart(product, selectedColor, selectedSize, quantity);
              }
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-green-600 active:from-emerald-700 active:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed transform" 
            disabled={!currentDetail || currentDetail.stock <= 0}
          >
            {currentDetail && currentDetail.stock > 0 ? '🛒 Añadir al Carrito' : '❌ Agotado'}
          </button>
        </div>

        {/* Información adicional */}
        <div className="border-t border-gray-700 pt-6">
          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Descripción del Producto
              </h4>
              <p className="text-gray-200 leading-relaxed">{product.long_description || product.short_description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h5 className="font-semibold text-emerald-400 mb-2">📦 Envío Gratis</h5>
                <p className="text-sm text-gray-300">En pedidos superiores a 50€</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h5 className="font-semibold text-emerald-400 mb-2">↩️ Devoluciones</h5>
                <p className="text-sm text-gray-300">30 días para cambios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Página del Carrito
const CartPage = ({ cartItems, setCartItems, setPage, clearCart }) => {
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-semibold text-white mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-400 mb-6">¡Descubre nuestros productos y añade algunos a tu carrito!</p>
          <button 
            onClick={() => setPage(PAGES.HOME)}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Mi Carrito de Compras</h1>
        <button 
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
              clearCart();
            }
          }}
          className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-300"
        >
          Vaciar carrito
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <img 
                  src={item.image || 'https://placehold.co/150x150/E5E7EB/4B5563?text=Producto'} 
                  alt={item.name}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {item.color && (
                    <p className="text-sm text-slate-600 mb-1">Color: {item.color}</p>
                  )}
                  {item.size && (
                    <p className="text-sm text-slate-600 mb-3">Talla: {item.size}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-slate-300 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 transition-colors duration-300"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-medium text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 transition-colors duration-300"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Precio unitario: {item.price.toFixed(2)}€</p>
                      <p className="text-lg font-semibold text-emerald-600">
                        {(item.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-24 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Productos ({getItemCount()})</span>
                <span>{getTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío</span>
                <span className="text-emerald-600 font-medium">Gratis</span>
              </div>
              <hr className="border-slate-300" />
              <div className="flex justify-between text-lg font-semibold text-white">
                <span>Total</span>
                <span className="text-emerald-600">{getTotal().toFixed(2)}€</span>
              </div>
            </div>

            <button 
              onClick={() => setPage(PAGES.CHECKOUT)}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-300 shadow-md hover:shadow-lg mb-3"
            >
              Proceder al Pago
            </button>
            
            <button 
              onClick={() => setPage(PAGES.HOME)}
              className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-300"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de Checkout (Proceso de Pago)
const CheckoutPage = ({ cartItems, user, setPage, clearCart, setNotification }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    country: 'España'
  });
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular totales
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.21; // IVA 21%
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      // Preparar datos del pedido
      const orderData = {
        // Información de envío
        shipping_name: shippingData.name,
        shipping_email: shippingData.email,
        shipping_phone: shippingData.phone,
        shipping_address: shippingData.address,
        shipping_city: shippingData.city,
        shipping_postal_code: shippingData.postalCode,
        shipping_country: shippingData.country,
        
        // Método de pago
        payment_method: paymentData.method,
        
        // Productos del carrito
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        
        // Totales
        subtotal: subtotal,
        shipping_cost: shipping,
        tax: tax,
        total: total
      };

      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pedido');
      }
      
      // Limpiar carrito después del éxito
      clearCart();
      
      // Mostrar notificación de éxito
      setNotification({
        title: '¡Pedido realizado con éxito!',
        message: `Tu pedido #${data.order?.id || 'N/A'} por ${total.toFixed(2)}€ ha sido procesado correctamente. Recibirás un email de confirmación.`,
        product: null
      });

      // Redirigir a pedidos
      setPage(PAGES.ORDERS);
      
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      setNotification({
        title: 'Error en el pedido',
        message: error.message || 'Ha ocurrido un error al procesar tu pedido. Por favor, inténtalo de nuevo.',
        product: null
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            step <= currentStep 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-200 text-slate-500'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 ${
              step < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderShippingStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Información de Envío</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Nombre completo *</label>
          <input
            type="text"
            name="name"
            value={shippingData.name}
            onChange={handleShippingChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={shippingData.email}
            onChange={handleShippingChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Teléfono *</label>
          <input
            type="tel"
            name="phone"
            value={shippingData.phone}
            onChange={handleShippingChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">País</label>
          <select
            name="country"
            value={shippingData.country}
            onChange={handleShippingChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="España">España</option>
            <option value="Portugal">Portugal</option>
            <option value="Francia">Francia</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-200 mb-2">Dirección *</label>
          <input
            type="text"
            name="address"
            value={shippingData.address}
            onChange={handleShippingChange}
            required
            placeholder="Calle, número, piso..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Ciudad *</label>
          <input
            type="text"
            name="city"
            value={shippingData.city}
            onChange={handleShippingChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Código Postal *</label>
          <input
            type="text"
            name="postalCode"
            value={shippingData.postalCode}
            onChange={handleShippingChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Método de Pago</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="card"
            name="method"
            value="card"
            checked={paymentData.method === 'card'}
            onChange={handlePaymentChange}
            className="w-4 h-4 text-emerald-600"
          />
          <label htmlFor="card" className="text-sm font-medium text-gray-200">
            💳 Tarjeta de Crédito/Débito
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="paypal"
            name="method"
            value="paypal"
            checked={paymentData.method === 'paypal'}
            onChange={handlePaymentChange}
            className="w-4 h-4 text-emerald-600"
          />
          <label htmlFor="paypal" className="text-sm font-medium text-gray-200">
            🅿️ PayPal
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="transfer"
            name="method"
            value="transfer"
            checked={paymentData.method === 'transfer'}
            onChange={handlePaymentChange}
            className="w-4 h-4 text-emerald-600"
          />
          <label htmlFor="transfer" className="text-sm font-medium text-gray-200">
            🏦 Transferencia Bancaria
          </label>
        </div>
      </div>
      
      {paymentData.method === 'card' && (
        <div className="mt-6 space-y-4 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Número de Tarjeta *</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Titular *</label>
              <input
                type="text"
                name="cardName"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
                placeholder="Como aparece en la tarjeta"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Expiración *</label>
              <input
                type="text"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handlePaymentChange}
                placeholder="MM/AA"
                maxLength="5"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CVV *</label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handlePaymentChange}
                placeholder="123"
                maxLength="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="saveCard"
              checked={paymentData.saveCard}
              onChange={handlePaymentChange}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <label className="text-sm text-slate-700">
              Guardar esta tarjeta para futuras compras (seguro)
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Revisar Pedido</h2>
      
      {/* Productos */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Productos ({cartItems.length})</h3>
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.image || 'https://placehold.co/50x50/E5E7EB/4B5563?text=IMG'} 
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-slate-800">{(item.price * item.quantity).toFixed(2)}€</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dirección de envío */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Dirección de Envío</h3>
        <div className="text-gray-200">
          <p className="font-medium">{shippingData.name}</p>
          <p>{shippingData.address}</p>
          <p>{shippingData.postalCode} {shippingData.city}</p>
          <p>{shippingData.country}</p>
          <p className="mt-2">
            📞 {shippingData.phone}<br />
            ✉️ {shippingData.email}
          </p>
        </div>
      </div>
      
      {/* Método de pago */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Método de Pago</h3>
        <div className="text-gray-200">
          {paymentData.method === 'card' && (
            <div>
              <p>💳 Tarjeta terminada en ****{paymentData.cardNumber.slice(-4)}</p>
              <p>Titular: {paymentData.cardName}</p>
            </div>
          )}
          {paymentData.method === 'paypal' && <p>🅿️ PayPal</p>}
          {paymentData.method === 'transfer' && <p>🏦 Transferencia Bancaria</p>}
        </div>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Resumen del Pedido</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({cartItems.length} productos)</span>
          <span>{subtotal.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Envío</span>
          <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
            {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)}€`}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>IVA (21%)</span>
          <span>{tax.toFixed(2)}€</span>
        </div>
        <hr className="border-slate-300" />
        <div className="flex justify-between text-lg font-semibold text-slate-800">
          <span>Total</span>
          <span className="text-emerald-600">{total.toFixed(2)}€</span>
        </div>
      </div>
      
      {subtotal < 50 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 ¡Añade {(50 - subtotal).toFixed(2)}€ más para envío gratis!
          </p>
        </div>
      )}
    </div>
  );

  // Verificar si el usuario está autenticado
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Iniciar Sesión Requerido</h1>
        <p className="text-slate-600 mb-8">Necesitas iniciar sesión para proceder al pago.</p>
        <button 
          onClick={() => setPage(PAGES.LOGIN)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300 mr-4"
        >
          Iniciar Sesión
        </button>
        <button 
          onClick={() => setPage(PAGES.CART)}
          className="bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-400 transition-colors duration-300"
        >
          Volver al Carrito
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Checkout</h1>
        <p className="text-slate-600 mb-8">No hay productos en tu carrito para proceder al pago.</p>
        <button 
          onClick={() => setPage(PAGES.HOME)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300"
        >
          Ir a Comprar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Finalizar Pedido</h1>
        <button 
          onClick={() => setPage(PAGES.CART)}
          className="text-slate-600 hover:text-slate-800 transition-colors duration-300"
        >
          ← Volver al carrito
        </button>
      </div>

      {renderStepIndicator()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && renderShippingStep()}
          {currentStep === 2 && renderPaymentStep()}
          {currentStep === 3 && renderReviewStep()}
          
          {/* Botones de navegación */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentStep === 1 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
              }`}
            >
              Anterior
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmitOrder}
                disabled={isProcessing}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isProcessing
                    ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  'Confirmar Pedido'
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Sidebar con resumen */}
        <div className="lg:col-span-1">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

// Componente de Notificación Toast
const Toast = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.product ? 4000 : 3000); // Más tiempo para notificaciones con producto

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  // Determinar el icono y color según el tipo de notificación
  const getIconAndColor = () => {
    if (notification.title.includes('restaurado')) {
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        )
      };
    }
    // Por defecto (añadido al carrito)
    return {
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      )
    };
  };

  const { bgColor, textColor, borderColor, icon } = getIconAndColor();

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`bg-gray-800 border ${borderColor} rounded-lg shadow-lg p-4 max-w-md w-full backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
              <div className={textColor}>
                {icon}
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{notification.title}</p>
            <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
            
            {notification.product && (
              <div className="flex items-center mt-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/30">
                <img 
                  src={notification.product.image || 'https://placehold.co/40x40/374151/9CA3AF?text=P'} 
                  alt={notification.product.name}
                  className="w-12 h-12 rounded-md object-cover flex-shrink-0 ring-2 ring-gray-600"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white mb-1">{notification.product.name}</p>
                  <p className="text-xs text-gray-400">
                    {notification.product.color} • {notification.product.size} • Cantidad: {notification.product.quantity}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="flex-shrink-0 ml-4 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Página de Login
const LoginPage = ({ setPage, setNotification, setUser }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = registro
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'El nombre es requerido';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      if (isLogin) {
        // Llamada API para login
        const response = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Manejar errores específicos de la API
          if (response.status === 401) {
            setErrors({ general: 'Credenciales incorrectas. Verifica tu email y contraseña.' });
          } else if (data.errors) {
            setErrors(data.errors);
          } else {
            setErrors({ general: data.message || 'Error al iniciar sesión.' });
          }
          return;
        }

        // Login exitoso
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          phone: data.user.phone || '',
          address: data.user.address || '',
          birthDate: data.user.birth_date || '',
          token: data.token,
          loginTime: new Date().toISOString()
        };

        setUser(userData);
        
        setNotification({
          title: '¡Bienvenido!',
          message: `Bienvenido de vuelta, ${userData.name}!`,
          product: null
        });

      } else {
        // Llamada API para registro
        const response = await fetch(`${API_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            // Transformar errores de Laravel al formato del frontend
            const transformedErrors = {};
            Object.keys(data.errors).forEach(key => {
              if (key === 'password_confirmation') {
                transformedErrors.confirmPassword = data.errors[key][0];
              } else {
                transformedErrors[key] = data.errors[key][0];
              }
            });
            setErrors(transformedErrors);
          } else {
            setErrors({ general: data.message || 'Error al crear la cuenta.' });
          }
          return;
        }

        // Registro exitoso
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          phone: data.user.phone || '',
          address: data.user.address || '',
          birthDate: data.user.birth_date || '',
          token: data.token,
          loginTime: new Date().toISOString()
        };

        setUser(userData);
        
        setNotification({
          title: '¡Cuenta creada!',
          message: 'Tu cuenta ha sido creada exitosamente. ¡Bienvenido!',
          product: null
        });
      }

      // Redirigir al home
      setPage('HOME');
      
    } catch (error) {
      console.error('Error en la autenticación:', error);
      setErrors({ general: 'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={toggleMode}
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Tu nombre completo"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-emerald-500 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>

            <button
              type="button"
              onClick={() => setPage('HOME')}
              className="w-full flex justify-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
            >
              Volver al inicio
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">O continúa con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors duration-300">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>

            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors duration-300">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para añadir/editar producto
const AddProductModal = ({ isOpen, onClose, onProductAdded, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    long_description: '',
    price: '',
    is_active: true,
    categories: [],
    details: [{ color: '', size: '', stock: '', image_url: '' }],
    offer: {
      enabled: false,
      name: '',
      discount_percentage: '',
      start_date: '',
      end_date: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Resetear formulario cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        short_description: '',
        long_description: '',
        price: '',
        is_active: true,
        categories: [],
        details: [{ color: '', size: '', stock: '', image_url: '' }],
        offer: {
          enabled: false,
          name: '',
          discount_percentage: '',
          start_date: '',
          end_date: ''
        }
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setFormData(prev => {
      const newDetails = [...prev.details];
      newDetails[index][field] = value;
      return { ...prev, details: newDetails };
    });
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, { color: '', size: '', stock: '', image_url: '' }]
    }));
  };

  const removeDetail = (index) => {
    if (formData.details.length > 1) {
      setFormData(prev => ({
        ...prev,
        details: prev.details.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOfferChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      offer: { ...prev.offer, [field]: value }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (formData.categories.length === 0) newErrors.categories = 'Selecciona al menos una categoría';
    
    formData.details.forEach((detail, index) => {
      if (!detail.color.trim()) newErrors[`detail_${index}_color`] = 'El color es obligatorio';
      if (!detail.size.trim()) newErrors[`detail_${index}_size`] = 'La talla es obligatoria';
      if (!detail.stock || parseInt(detail.stock) < 0) newErrors[`detail_${index}_stock`] = 'Stock inválido';
      if (!detail.image_url.trim()) newErrors[`detail_${index}_image_url`] = 'La URL de imagen es obligatoria';
    });

    if (formData.offer.enabled) {
      if (!formData.offer.name.trim()) newErrors.offer_name = 'Nombre de oferta obligatorio';
      if (!formData.offer.discount_percentage || parseFloat(formData.offer.discount_percentage) <= 0 || parseFloat(formData.offer.discount_percentage) > 100) {
        newErrors.offer_discount = 'Descuento debe estar entre 1 y 100';
      }
      if (!formData.offer.start_date) newErrors.offer_start = 'Fecha inicio obligatoria';
      if (!formData.offer.end_date) newErrors.offer_end = 'Fecha fin obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Verificar token
      const userString = localStorage.getItem('omnistyle-user');
      const userData = userString ? JSON.parse(userString) : null;
      const token = userData?.token;

      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión nuevamente.');
      }

      // Asegurar que stock sea número entero y limpiar offer si está deshabilitado
      const dataToSend = {
        ...formData,
        details: formData.details.map(detail => ({
          ...detail,
          stock: parseInt(detail.stock) || 0
        })),
        // Limpiar campos de offer si está deshabilitado
        offer: formData.offer.enabled ? {
          ...formData.offer,
          discount_percentage: parseFloat(formData.offer.discount_percentage) || 0
        } : {
          enabled: false,
          id: null,
          name: null,
          discount_percentage: null,
          start_date: null,
          end_date: null
        }
      };

      const response = await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        // Si es error 401, el token no es válido - hacer logout
        if (response.status === 401) {
          console.log('Token inválido (401), limpiando localStorage y redirigiendo...');
          localStorage.removeItem('omnistyle-user');
          // Recargar la página para forzar logout
          window.location.reload();
          return;
        }
        
        if (data.errors) {
          setErrors(data.errors);
        } else {
          throw new Error(data.message || 'Error al crear el producto');
        }
        return;
      }

      // Devolver el producto creado (viene en data.product según el backend)
      onProductAdded(data.product || data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Añadir Nuevo Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {errors.general && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ej: Nike Air Max 270"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción Corta
              </label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Breve descripción del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción Larga
              </label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Descripción detallada del producto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio Base * (€)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Producto Activo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">Categorías *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(category => (
                <label
                  key={category.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                    formData.categories.includes(category.id)
                      ? 'bg-cyan-900/50 border-2 border-cyan-500'
                      : 'bg-gray-700 border-2 border-gray-600 hover:border-cyan-500/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-cyan-500 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm text-white">{category.name}</span>
                </label>
              ))}
            </div>
            {errors.categories && <p className="text-red-400 text-sm">{errors.categories}</p>}
          </div>

          {/* Variantes (Detalles) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cyan-400">Variantes (Color, Talla, Stock) *</h3>
              <button
                type="button"
                onClick={addDetail}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Añadir Variante</span>
              </button>
            </div>

            {formData.details.map((detail, index) => (
              <div key={index} className="bg-gray-700/50 p-4 rounded-lg space-y-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-300">Variante #{index + 1}</h4>
                  {formData.details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetail(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-white font-medium mb-1">Color *</label>
                    <input
                      type="text"
                      value={detail.color}
                      onChange={(e) => handleDetailChange(index, 'color', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Ej: Negro"
                    />
                    {errors[`detail_${index}_color`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_color`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-white font-medium mb-1">Talla *</label>
                    <input
                      type="text"
                      value={detail.size}
                      onChange={(e) => handleDetailChange(index, 'size', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Ej: M, 42"
                    />
                    {errors[`detail_${index}_size`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_size`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-white font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      value={detail.stock}
                      onChange={(e) => handleDetailChange(index, 'stock', e.target.value)}
                      min="0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0"
                    />
                    {errors[`detail_${index}_stock`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_stock`]}</p>
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-4">
                    <label className="block text-xs text-white font-medium mb-1">URL de Imagen *</label>
                    <input
                      type="text"
                      value={detail.image_url}
                      onChange={(e) => handleDetailChange(index, 'image_url', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {errors[`detail_${index}_image_url`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_image_url`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Oferta opcional */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.offer.enabled}
                onChange={(e) => handleOfferChange('enabled', e.target.checked)}
                className="w-5 h-5 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <h3 className="text-lg font-semibold text-purple-400">Añadir Oferta (Opcional)</h3>
            </div>

            {formData.offer.enabled && (
              <div className="bg-purple-900/20 p-4 rounded-lg space-y-3 border border-purple-500/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre de la Oferta *
                    </label>
                    <input
                      type="text"
                      value={formData.offer.name}
                      onChange={(e) => handleOfferChange('name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Black Friday"
                    />
                    {errors.offer_name && <p className="text-red-400 text-sm mt-1">{errors.offer_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descuento (%) *
                    </label>
                    <input
                      type="number"
                      value={formData.offer.discount_percentage}
                      onChange={(e) => handleOfferChange('discount_percentage', e.target.value)}
                      min="1"
                      max="100"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="15.00"
                    />
                    {errors.offer_discount && <p className="text-red-400 text-sm mt-1">{errors.offer_discount}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha Inicio *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.offer.start_date}
                      onChange={(e) => handleOfferChange('start_date', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.offer_start && <p className="text-red-400 text-sm mt-1">{errors.offer_start}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha Fin *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.offer.end_date}
                      onChange={(e) => handleOfferChange('end_date', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.offer_end && <p className="text-red-400 text-sm mt-1">{errors.offer_end}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Crear Producto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Función para ordenar tallas correctamente
const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const sortDetailsBySize = (details) => {
  return [...details].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.size.toUpperCase());
    const indexB = sizeOrder.indexOf(b.size.toUpperCase());
    // Si la talla no está en el orden predefinido, ponerla al final
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

// Modal para editar producto
const EditProductModal = ({ isOpen, onClose, onProductUpdated, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    long_description: '',
    price: '',
    is_active: true,
    categories: [],
    details: [],
    offer: {
      enabled: false,
      id: null,
      name: '',
      discount_percentage: '',
      start_date: '',
      end_date: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (isOpen && product) {
      // Formatear fechas para datetime-local
      const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      // Verificar si tiene oferta activa
      const activeOffer = product.offers && product.offers.length > 0 ? product.offers[0] : null;

      setFormData({
        name: product.name || '',
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        price: product.price || '',
        is_active: product.is_active ?? true,
        categories: product.categories ? product.categories.map(cat => cat.id) : [],
        details: product.details && product.details.length > 0 
          ? sortDetailsBySize(product.details).map(detail => ({
              id: detail.id,
              color: detail.color || '',
              size: detail.size || '',
              stock: detail.stock || 0,
              image_url: detail.image_url || ''
            }))
          : [{ color: '', size: '', stock: '', image_url: '' }],
        offer: activeOffer ? {
          enabled: true,
          id: activeOffer.id,
          name: activeOffer.name || '',
          discount_percentage: activeOffer.discount_percentage || '',
          start_date: formatDateTime(activeOffer.start_date),
          end_date: formatDateTime(activeOffer.end_date)
        } : {
          enabled: false,
          id: null,
          name: '',
          discount_percentage: '',
          start_date: '',
          end_date: ''
        }
      });
      setErrors({});
    }
  }, [isOpen, product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setFormData(prev => {
      const newDetails = [...prev.details];
      newDetails[index][field] = value;
      return { ...prev, details: newDetails };
    });
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, { color: '', size: '', stock: '', image_url: '' }]
    }));
  };

  const removeDetail = (index) => {
    if (formData.details.length > 1) {
      setFormData(prev => ({
        ...prev,
        details: prev.details.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOfferChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      offer: { ...prev.offer, [field]: value }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (formData.categories.length === 0) newErrors.categories = 'Selecciona al menos una categoría';
    
    formData.details.forEach((detail, index) => {
      if (!detail.color.trim()) newErrors[`detail_${index}_color`] = 'El color es obligatorio';
      if (!detail.size.trim()) newErrors[`detail_${index}_size`] = 'La talla es obligatoria';
      if (detail.stock === '' || parseInt(detail.stock) < 0) newErrors[`detail_${index}_stock`] = 'Stock inválido';
      if (!detail.image_url.trim()) newErrors[`detail_${index}_image_url`] = 'La URL de imagen es obligatoria';
    });

    if (formData.offer.enabled) {
      if (!formData.offer.name.trim()) newErrors.offer_name = 'Nombre de oferta obligatorio';
      if (!formData.offer.discount_percentage || parseFloat(formData.offer.discount_percentage) <= 0 || parseFloat(formData.offer.discount_percentage) > 100) {
        newErrors.offer_discount = 'Descuento debe estar entre 1 y 100';
      }
      if (!formData.offer.start_date) newErrors.offer_start = 'Fecha inicio obligatoria';
      if (!formData.offer.end_date) newErrors.offer_end = 'Fecha fin obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Verificar token
      const userString = localStorage.getItem('omnistyle-user');
      const userData = userString ? JSON.parse(userString) : null;
      const token = userData?.token;

      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión nuevamente.');
      }

      // Debug: Log datos enviados
      console.log('Datos enviados al backend:', formData);

      // Asegurar que stock sea número entero y limpiar offer si está deshabilitado
      const dataToSend = {
        ...formData,
        details: formData.details.map(detail => ({
          ...detail,
          stock: parseInt(detail.stock) || 0
        })),
        // Limpiar campos de offer si está deshabilitado
        offer: formData.offer.enabled ? {
          ...formData.offer,
          discount_percentage: parseFloat(formData.offer.discount_percentage) || 0
        } : {
          enabled: false,
          id: formData.offer.id || null,
          name: null,
          discount_percentage: null,
          start_date: null,
          end_date: null
        }
      };

      const response = await fetch(`${API_URL}/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        // Si es error 401, el token no es válido - hacer logout
        if (response.status === 401) {
          console.log('Token inválido (401), limpiando localStorage y redirigiendo...');
          localStorage.removeItem('omnistyle-user');
          // Recargar la página para forzar logout
          window.location.reload();
          return;
        }
        
        if (data.errors) {
          console.log('Errores de validación:', JSON.stringify(data.errors, null, 2));
          console.log('Objeto completo de respuesta:', JSON.stringify(data, null, 2));
          setErrors(data.errors);
        } else {
          console.log('Error del servidor:', data);
          throw new Error(data.message || 'Error al actualizar el producto');
        }
        return;
      }

      onProductUpdated(data.product || data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Editar Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {errors.general && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ej: Nike Air Max 270"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción Corta
              </label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Breve descripción del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción Larga
              </label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Descripción detallada del producto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio Base * (€)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Producto Activo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">Categorías *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(category => (
                <label
                  key={category.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                    formData.categories.includes(category.id)
                      ? 'bg-cyan-900/50 border-2 border-cyan-500'
                      : 'bg-gray-700 border-2 border-gray-600 hover:border-cyan-500/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-cyan-500 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm text-white">{category.name}</span>
                </label>
              ))}
            </div>
            {errors.categories && <p className="text-red-400 text-sm">{errors.categories}</p>}
          </div>

          {/* Variantes (Detalles) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cyan-400">Variantes (Color, Talla, Stock) *</h3>
              <button
                type="button"
                onClick={addDetail}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Añadir Variante</span>
              </button>
            </div>

            {formData.details.map((detail, index) => (
              <div key={index} className="bg-gray-700/50 p-4 rounded-lg space-y-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-300">
                    Variante #{index + 1} {detail.id && <span className="text-xs text-gray-500">(ID: {detail.id})</span>}
                  </h4>
                  {formData.details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetail(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-white font-medium mb-1">Color *</label>
                    <input
                      type="text"
                      value={detail.color}
                      onChange={(e) => handleDetailChange(index, 'color', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Ej: Negro"
                    />
                    {errors[`detail_${index}_color`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_color`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-white font-medium mb-1">Talla *</label>
                    <input
                      type="text"
                      value={detail.size}
                      onChange={(e) => handleDetailChange(index, 'size', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Ej: M, 42"
                    />
                    {errors[`detail_${index}_size`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_size`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-white font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      value={detail.stock}
                      onChange={(e) => handleDetailChange(index, 'stock', e.target.value)}
                      min="0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0"
                    />
                    {errors[`detail_${index}_stock`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_stock`]}</p>
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-4">
                    <label className="block text-xs text-white font-medium mb-1">URL de Imagen *</label>
                    <input
                      type="text"
                      value={detail.image_url}
                      onChange={(e) => handleDetailChange(index, 'image_url', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {errors[`detail_${index}_image_url`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`detail_${index}_image_url`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Oferta opcional */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.offer.enabled}
                onChange={(e) => handleOfferChange('enabled', e.target.checked)}
                className="w-5 h-5 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <h3 className="text-lg font-semibold text-purple-400">
                {formData.offer.id ? 'Editar Oferta' : 'Añadir Oferta'} (Opcional)
              </h3>
            </div>

            {formData.offer.enabled && (
              <div className="bg-purple-900/20 p-4 rounded-lg space-y-3 border border-purple-500/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre de la Oferta *
                    </label>
                    <input
                      type="text"
                      value={formData.offer.name}
                      onChange={(e) => handleOfferChange('name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Black Friday"
                    />
                    {errors.offer_name && <p className="text-red-400 text-sm mt-1">{errors.offer_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descuento (%) *
                    </label>
                    <input
                      type="number"
                      value={formData.offer.discount_percentage}
                      onChange={(e) => handleOfferChange('discount_percentage', e.target.value)}
                      min="1"
                      max="100"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="15.00"
                    />
                    {errors.offer_discount && <p className="text-red-400 text-sm mt-1">{errors.offer_discount}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha Inicio *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.offer.start_date}
                      onChange={(e) => handleOfferChange('start_date', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.offer_start && <p className="text-red-400 text-sm mt-1">{errors.offer_start}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha Fin *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.offer.end_date}
                      onChange={(e) => handleOfferChange('end_date', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.offer_end && <p className="text-red-400 text-sm mt-1">{errors.offer_end}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Actualizar Producto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Página de Administración / Panel de Admin
const AdminPage = ({ user, onProductAdded, onProductUpdated, onProductDeleted }) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'offers' o 'users'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Cargar productos y categorías
  useEffect(() => {
    if (user?.role !== 'employee') return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/categories`)
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setNotification({ type: 'error', message: 'Error al cargar los datos' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL, user]);

  // Cargar usuarios cuando se selecciona la pestaña de usuarios
  const fetchUsers = async () => {
    if (!user || !['employee', 'admin'].includes(user.role)) {
      return;
    }
    
    setLoading(true);
    try {
      // Obtener token del localStorage o del objeto usuario
      let token = localStorage.getItem('omnistyle-token');
      if (!token && user?.token) {
        token = user.token;
      }
      
      if (!token) {
        setNotification({ type: 'error', message: 'Error de autenticación: no se encontró token' });
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData.users || []);
      } else {
        setNotification({ type: 'error', message: `Error al cargar usuarios: ${response.status}` });
      }
    } catch {
      setNotification({ type: 'error', message: 'Error de conexión al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios cuando se cambia a la pestaña de usuarios
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleProductAddedSuccess = (newProduct) => {
    onProductAdded();
    setNotification({ type: 'success', message: 'Producto creado exitosamente' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProductUpdatedSuccess = (updatedProduct) => {
    onProductUpdated();
    setNotification({ type: 'success', message: 'Producto actualizado exitosamente' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // Verificar que el usuario sea empleado
  if (user?.role !== 'employee') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-8 px-4">
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-in slide-in-from-top-2`}>
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-gray-400">Gestiona productos, ofertas y usuarios de la tienda</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 rounded-t-lg ${
              activeTab === 'products'
                ? 'text-blue-400 border-blue-400 bg-blue-900/30'
                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Productos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 rounded-t-lg ${
              activeTab === 'offers'
                ? 'text-blue-400 border-blue-400 bg-blue-900/30'
                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Ofertas</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 rounded-t-lg ${
              activeTab === 'users'
                ? 'text-blue-400 border-blue-400 bg-blue-900/30'
                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Usuarios</span>
            </div>
          </button>
        </div>

        {/* Contenido según tab activo */}
        {activeTab === 'products' && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Gestión de Productos</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Añadir Producto</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-gray-400 mt-4">Cargando productos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Producto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoría</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Precio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {products.map((product) => {
                      const defaultDetail = product.details && product.details.length > 0 ? product.details[0] : null;
                      const totalStock = product.details?.reduce((sum, detail) => sum + (detail.stock || 0), 0) || 0;
                      const categoryNames = product.categories?.map(cat => cat.name).join(', ') || 'Sin categoría';
                      
                      return (
                      <tr key={product.id} className="hover:bg-blue-900/20 hover:border-l-4 hover:border-blue-500 transition-all duration-200">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={defaultDetail?.image_url || 'https://placehold.co/50x50/374151/9CA3AF?text=No+Image'}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.src = 'https://placehold.co/50x50/374151/9CA3AF?text=No+Image' 
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-white">{product.name}</div>
                              <div className="text-xs text-gray-400">{defaultDetail?.color || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          {categoryNames}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-emerald-400">
                          ${product.price?.toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            totalStock === 0 ? 'bg-red-900/50 text-red-400' :
                            totalStock < 40 ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-green-900/50 text-green-400'
                          }`}>
                            {totalStock} unidades
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Gestión de Ofertas</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Crear Oferta</span>
              </button>
            </div>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-gray-400">Funcionalidad de ofertas próximamente...</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Total: {users.length} usuarios
                </span>
                <button 
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Actualizar</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-gray-400 mt-4">Cargando usuarios...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <p className="text-gray-400">No hay usuarios registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Nombre</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Rol</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Fecha de registro</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                        <td className="py-3 px-4 text-gray-200">#{userItem.id}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {userItem.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-white font-medium">{userItem.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{userItem.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userItem.role === 'employee' 
                              ? 'bg-yellow-900 text-yellow-300' 
                              : 'bg-blue-900 text-blue-300'
                          }`}>
                            {userItem.role === 'employee' ? 'Empleado' : 'Cliente'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString('es-ES') : 'No disponible'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-green-400 text-sm">Activo</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para añadir producto */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductAdded={handleProductAddedSuccess}
        categories={categories}
      />

      {/* Modal para editar producto */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProductUpdated={handleProductUpdatedSuccess}
        product={selectedProduct}
        categories={categories}
      />
    </div>
  );
};

// Página de Mi Perfil
const ProfilePage = ({ user, setUser, setNotification }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          birth_date: formData.birthDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotification({
          title: 'Error',
          message: data.message || 'Error al actualizar el perfil.',
          product: null
        });
        return;
      }

      // Actualizar el usuario local con los datos del servidor
      const updatedUser = {
        ...user,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        address: data.user.address || '',
        birthDate: data.user.birth_date || '',
      };
      
      setUser(updatedUser);
      setIsEditing(false);
      setNotification({
        title: '¡Perfil actualizado!',
        message: 'Tus datos se han guardado correctamente.',
        product: null
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        title: 'Error',
        message: 'Error de conexión. Inténtalo más tarde.',
        product: null
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthDate: user?.birthDate || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Mi Perfil</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Información Personal</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
            >
              Editar Perfil
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="bg-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-400 transition-colors duration-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre completo</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{user?.name || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{user?.email || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej: +34 600 123 456"
              />
            ) : (
              <p className="text-slate-900 py-2">{user?.phone || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de nacimiento</label>
            {isEditing ? (
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{user?.birthDate || 'No especificado'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Calle, número, ciudad, código postal..."
              />
            ) : (
              <p className="text-slate-900 py-2">{user?.address || 'No especificado'}</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Estadísticas de cuenta</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-emerald-600 font-medium">Miembro desde</p>
              <p className="text-lg font-semibold text-emerald-700">
                {user?.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'Hoy'}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Pedidos realizados</p>
              <p className="text-lg font-semibold text-blue-700">0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Productos favoritos</p>
              <p className="text-lg font-semibold text-purple-700">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de Mis Pedidos
const OrdersPage = () => {
  // Datos de ejemplo para pedidos (esto vendría de la API)
  const orders = [
    {
      id: 1,
      date: '2024-10-15',
      status: 'Entregado',
      total: 89.99,
      items: [
        { name: 'Camiseta Básica', quantity: 2, price: 24.99 },
        { name: 'Pantalones Chinos', quantity: 1, price: 39.99 }
      ]
    },
    {
      id: 2,
      date: '2024-10-28',
      status: 'En tránsito',
      total: 156.50,
      items: [
        { name: 'Zapatillas Deportivas', quantity: 1, price: 89.99 },
        { name: 'Sudadera Premium', quantity: 1, price: 66.51 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado': return 'bg-green-100 text-green-800';
      case 'En tránsito': return 'bg-blue-100 text-blue-800';
      case 'Procesando': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Mis Pedidos</h1>
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">Aún no tienes pedidos</h2>
          <p className="text-gray-400">¡Explora nuestros productos y realiza tu primer pedido!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Mis Pedidos</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Pedido #{order.id}</h3>
                <p className="text-sm text-slate-600">Realizado el {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <p className="text-lg font-semibold text-slate-800 mt-1">{order.total.toFixed(2)}€</p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <h4 className="font-medium text-slate-700 mb-2">Productos:</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{item.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300 text-sm">
                Ver detalles
              </button>
              {order.status === 'Entregado' && (
                <button className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm">
                  Recomprar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Página de Favoritos
const FavoritesPage = ({ favorites, allProducts, toggleFavorite, setPage, setSelectedProduct }) => {
  const favoriteProducts = allProducts.filter(product => favorites.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Mis Favoritos</h1>
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">No tienes productos favoritos</h2>
          <p className="text-gray-400 mb-6">¡Explora nuestros productos y marca los que más te gusten!</p>
          <button 
            onClick={() => setPage(PAGES.HOME)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
          >
            Explorar productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Mis Favoritos ({favoriteProducts.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favoriteProducts.map(product => (
          <div key={product.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden group relative">
            {/* Botón de eliminar favorito */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>

            <div 
              className="cursor-pointer"
              onClick={() => {
                setSelectedProduct(product);
                setPage(PAGES.PRODUCT, product.id);
              }}
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-100">
                <img 
                  src={product.details?.[0]?.image_url || 'https://placehold.co/400x400/E5E7EB/4B5563?text=OmniStyle'} 
                  alt={product.name} 
                  className="w-full h-48 object-center object-cover group-hover:opacity-75 transition-opacity duration-300" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-slate-700 mb-1 truncate">{product.name}</h3>
                <div className="flex items-center text-xs text-slate-500 mb-1">
                  <span>⭐⭐⭐⭐⭐</span>
                  <span className="ml-1">(1.2k)</span>
                </div>
                <p className="text-lg font-semibold text-emerald-600">{product.price.toFixed(2)}€</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Página de Configuración
const SettingsPage = ({ handleLogout, setNotification }) => {
  const { themeMode, setThemeMode } = useTheme();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    language: 'es'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setNotification({
      title: 'Configuración actualizada',
      message: 'Tus preferencias se han guardado correctamente.',
      product: null
    });
  };

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
    setNotification({
      title: 'Tema actualizado',
      message: `Tema cambiado a: ${newTheme === 'light' ? 'Claro' : newTheme === 'dark' ? 'Oscuro' : 'Automático'}`,
      product: null
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      handleLogout();
      setNotification({
        title: 'Cuenta eliminada',
        message: 'Tu cuenta ha sido eliminada correctamente.',
        product: null
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-adapted mb-8">Configuración</h1>
      
      <div className="space-y-6">
        {/* Notificaciones */}
        <div className="settings-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-adapted mb-4">Notificaciones</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-adapted">Notificaciones por email</h3>
                <p className="text-sm text-adapted-tertiary">Recibe actualizaciones de pedidos por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-adapted">Notificaciones SMS</h3>
                <p className="text-sm text-adapted-tertiary">Recibe actualizaciones por SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-adapted">Emails de marketing</h3>
                <p className="text-sm text-adapted-tertiary">Recibe ofertas especiales y novedades</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="settings-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-adapted mb-4">Preferencias</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-adapted-secondary mb-2">Idioma</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="input-themed"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-adapted-secondary mb-2">Tema</label>
              <select
                value={themeMode}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="input-themed"
              >
                <option value="light">☀️ Claro</option>
                <option value="dark">🌙 Oscuro</option>
                <option value="auto">🔄 Automático</option>
              </select>
            </div>
          </div>
        </div>

        {/* Zona peligrosa */}
        <div className="settings-card rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Zona peligrosa</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-adapted mb-2">Eliminar cuenta</h3>
              <p className="text-sm text-adapted-tertiary mb-4">
                Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. 
                No se puede deshacer.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Eliminar mi cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (LAYOUT) ---

// Componente de Layout principal que contiene toda la lógica de estado
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchFilter, _setSearchFilter] = useState('');
  const [_selectedProduct, setSelectedProduct] = useState(null); // Producto para la página de detalle
  const [user, setUser] = useState(() => {
    // Cargar usuario desde localStorage al inicializar
    try {
      const savedUser = localStorage.getItem('omnistyle-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage:', error);
      return null;
    }
  }); // Estado de autenticación

  const [cartItems, setCartItems] = useState(() => {
    // Cargar carrito según el usuario inicial
    try {
      const savedUser = localStorage.getItem('omnistyle-user');
      const initialUser = savedUser ? JSON.parse(savedUser) : null;
      const cartKey = initialUser?.id ? `omnistyle-cart-user-${initialUser.id}` : 'omnistyle-cart-guest';
      const savedCart = localStorage.getItem(cartKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito inicial:', error);
      return [];
    }
  }); // Estado del carrito con carga inicial

  const [isInitialized, setIsInitialized] = useState(false); // Flag para controlar la inicialización
  const [notification, setNotification] = useState(null); // Estado para notificaciones
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false); // Estado del sidebar del carrito
  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos desde localStorage al inicializar
    try {
      const savedFavorites = localStorage.getItem('omnistyle-favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error('Error al cargar favoritos desde localStorage:', error);
      return [];
    }
  }); // Estado de favoritos

  // Función para navegar usando React Router en lugar del estado interno
  const setPage = (page, productId = null) => {
    switch (page) {
      case PAGES.HOME:
        navigate('/');
        break;
      case PAGES.PRODUCT:
        if (productId) {
          navigate(`/product/${productId}`);
        }
        break;
      case PAGES.CART:
        navigate('/cart');
        break;
      case PAGES.CHECKOUT:
        navigate('/checkout');
        break;
      case PAGES.LOGIN:
        navigate('/login');
        break;
      case PAGES.PROFILE:
        navigate('/profile');
        break;
      case PAGES.ORDERS:
        navigate('/orders');
        break;
      case PAGES.FAVORITES:
        navigate('/favorites');
        break;
      case PAGES.SETTINGS:
        navigate('/settings');
        break;
      case PAGES.ADMIN:
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Función para obtener la clave del carrito específica del usuario
  const getCartKey = useCallback((userId) => {
    return userId ? `omnistyle-cart-user-${userId}` : 'omnistyle-cart-guest';
  }, []);

  // Función para cargar carrito del usuario
  const loadUserCart = useCallback((userId) => {
    try {
      const cartKey = getCartKey(userId);
      const savedCart = localStorage.getItem(cartKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito del usuario:', error);
      return [];
    }
  }, [getCartKey]);

  // Función para guardar carrito del usuario
  const saveUserCart = useCallback((userId, cart) => {
    try {
      const cartKey = getCartKey(userId);
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito del usuario:', error);
    }
  }, [getCartKey]);

  // Marcar como inicializado después de la primera carga
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Cargar carrito cuando cambie el usuario (login/logout) - pero no en la inicialización
  useEffect(() => {
    if (isInitialized) {
      const userCart = loadUserCart(user?.id);
      setCartItems(userCart);
    }
  }, [user?.id, loadUserCart, isInitialized]);

  // Guardar carrito en localStorage cada vez que cambie (vinculado al usuario)
  useEffect(() => {
    saveUserCart(user?.id, cartItems);
  }, [cartItems, user?.id, saveUserCart]);

  // Guardar usuario en localStorage cada vez que cambie
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('omnistyle-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('omnistyle-user');
      }
    } catch (error) {
      console.error('Error al guardar usuario en localStorage:', error);
    }
  }, [user]);

  // Guardar favoritos en localStorage cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem('omnistyle-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error al guardar favoritos en localStorage:', error);
    }
  }, [favorites]);

  // Migración única: mover carrito de la clave antigua a la nueva estructura
  useEffect(() => {
    const migrateOldCart = () => {
      const oldCart = localStorage.getItem('omnistyle-cart');
      if (oldCart) {
        try {
          // Si no hay usuario logueado, mover el carrito a la clave de invitado
          const guestCartKey = getCartKey(null);
          if (!localStorage.getItem(guestCartKey)) {
            localStorage.setItem(guestCartKey, oldCart);
          }
          // Eliminar la clave antigua
          localStorage.removeItem('omnistyle-cart');
        } catch (error) {
          console.error('Error al migrar carrito existente:', error);
        }
      }
    };
    
    migrateOldCart();
  }, [getCartKey]); // Solo ejecutar una vez al montar el componente



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

  // Funciones para manejar productos desde el admin panel
  const handleProductAdded = async () => {
    // Forzar recarga de todos los productos para asegurar sincronización
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const productsData = await response.json();
      setProducts(productsData);
      setAllProducts(productsData); // También actualizar allProducts
    } catch (error) {
      console.error('Error al recargar productos:', error);
    }
  };

  const handleProductUpdated = async () => {
    // Forzar recarga de todos los productos para asegurar sincronización
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const productsData = await response.json();
      setProducts(productsData);
      setAllProducts(productsData); // También actualizar allProducts
    } catch (error) {
      console.error('Error al recargar productos:', error);
    }
  };

  const handleProductDeleted = () => {
    // Forzar recarga de todos los productos para asegurar sincronización  
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const productsData = await response.json();
        setProducts(productsData);
        setAllProducts(productsData);
      } catch (error) {
        console.error('Error al recargar productos:', error);
      }
    };
    fetchProducts();
  };

  // Aplicar filtros cuando cambien la categoría seleccionada, búsqueda o los productos base
  useEffect(() => {
    // Si no hay productos base cargados, no hacer nada
    if (!allProducts || allProducts.length === 0) return;

    let filtered = allProducts;

    // Filtrar por categoría si hay una seleccionada
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categories.some(c => c.id === selectedCategory));
    }

    // Filtrar por búsqueda si hay un término de búsqueda
    if (searchFilter && searchFilter.trim()) {
      const searchTerm = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm) ||
        p.categories.some(c => c.name.toLowerCase().includes(searchTerm))
      );
    }

    setProducts(filtered);
  }, [selectedCategory, searchFilter, allProducts]); // Dependencias correctas


  const handleCategorySelect = (categoryId) => {
    console.log('handleCategorySelect called with:', categoryId);
    setSelectedCategory(categoryId);
    // Navegar a la página principal si estamos en otra página
    if (location.pathname !== '/' && location.pathname !== '/catalog') {
      navigate('/');
    }
  };

  // Funciones del carrito
  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      image: product.details?.find(d => d.color === selectedColor && d.size === selectedSize)?.image_url || product.details?.[0]?.image_url
    };

    const existingItemIndex = cartItems.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex >= 0) {
      // Si el item ya existe, actualizar cantidad
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // Si no existe, añadir nuevo item
      setCartItems([...cartItems, cartItem]);
    }

    // Mostrar notificación
    setNotification({
      title: '¡Producto añadido!',
      message: 'El producto se ha añadido correctamente a tu carrito.',
      product: {
        name: product.name,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
        image: cartItem.image
      }
    });
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Función para limpiar el carrito (útil para después de completar compra)
  const clearCart = () => {
    setCartItems([]);
    // Limpiar el carrito del usuario actual de localStorage
    const cartKey = getCartKey(user?.id);
    localStorage.removeItem(cartKey);
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    try {
      // Llamar al endpoint de logout si hay un token
      if (user?.token) {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar estado local independientemente del resultado de la API
      setUser(null);
      localStorage.removeItem('omnistyle-user');
      setNotification({
        title: '¡Hasta pronto!',
        message: 'Has cerrado sesión correctamente.',
        product: null
      });
      navigate('/');
    }
  };

  // Funciones para manejar favoritos
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(productId);
      const newFavorites = isFavorite 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      // Mostrar notificación
      setNotification({
        title: isFavorite ? 'Eliminado de favoritos' : '¡Añadido a favoritos!',
        message: isFavorite 
          ? 'El producto se ha eliminado de tus favoritos.' 
          : 'El producto se ha añadido a tus favoritos.',
        product: null
      });
      
      return newFavorites;
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar 
        setPage={setPage} 
        cartItemCount={getCartItemCount()} 
        user={user} 
        onLogout={handleLogout}
        onOpenCartSidebar={() => setCartSidebarOpen(true)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Sidebar del Carrito */}
      <CartSidebar 
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        setPage={setPage}
      />

      {/* --- CORRECCIÓN DE ANCHO --- */}
      {/* Se han eliminado 'max-w-screen-xl' y 'mx-auto' para que ocupe todo el ancho */}
      <main className="flex-grow w-full py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={
            <HomePage
              products={products}
              loading={loading}
              categories={categories}
              onSelectCategory={handleCategorySelect}
              setPage={setPage}
              setSelectedProduct={setSelectedProduct}
              selectedCategoryId={selectedCategory}
            />
          } />
          <Route path="/product/:id" element={<ProductDetailPageWrapper />} />
          <Route path="/cart" element={
            <CartPage 
              cartItems={cartItems} 
              setCartItems={setCartItems} 
              setPage={setPage} 
              clearCart={clearCart} 
            />
          } />
          <Route path="/checkout" element={
            <CheckoutPage 
              cartItems={cartItems} 
              user={user} 
              setPage={setPage} 
              clearCart={clearCart} 
              setNotification={setNotification} 
            />
          } />
          <Route path="/login" element={
            <LoginPage 
              setPage={setPage} 
              setNotification={setNotification} 
              setUser={setUser} 
            />
          } />
          <Route path="/profile" element={
            user ? (
              <ProfilePage 
                user={user} 
                setUser={setUser} 
                setNotification={setNotification} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/orders" element={
            user ? <OrdersPage /> : <Navigate to="/login" replace />
          } />
          <Route path="/favorites" element={
            <FavoritesPage 
              favorites={favorites} 
              allProducts={allProducts} 
              toggleFavorite={toggleFavorite}
              setPage={setPage}
              setSelectedProduct={setSelectedProduct}
            />
          } />
          <Route path="/settings" element={
            user ? (
              <SettingsPage 
                handleLogout={handleLogout} 
                setNotification={setNotification} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/admin" element={
            user?.role === 'employee' ? (
              <AdminPage 
                user={user}
                onProductAdded={handleProductAdded}
                onProductUpdated={handleProductUpdated}
                onProductDeleted={handleProductDeleted}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/categories" element={
            <AllCategoriesPage 
              allProducts={allProducts}
            />
          } />
          <Route path="/products" element={
            <AllProductsPage 
              products={allProducts}
              setSelectedProduct={setSelectedProduct}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          } />
        </Routes>
      </main>

      {/* Widget de Chat Flotante */}
      <ChatWidget />

      {/* Notificación Toast */}
      <Toast 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />

      <footer className="w-full text-center p-4 text-xs footer-text border-t border-adapted">
        &copy; {new Date().getFullYear()} OmniStyle - Desarrollado por Germán Peña Ruiz.
      </footer>
    </div>
  );

  // Componente wrapper para ProductDetailPage que obtiene el producto por ID de la URL
  function ProductDetailPageWrapper() {
    const { id } = useParams();
    const navigate = useNavigate();
    const productId = parseInt(id);
    const product = allProducts.find(p => p.id === productId);

    useEffect(() => {
      if (product) {
        setSelectedProduct(product);
      }
    }, [product]);

    if (!product) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Producto no encontrado</h1>
          <p className="text-gray-400 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return (
      <ProductDetailPage 
        product={product} 
        addToCart={addToCart} 
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />
    );
  }
}

// Componente principal que envuelve todo con el Router
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}