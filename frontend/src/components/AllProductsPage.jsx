import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllProductsPage = ({ products, setSelectedProduct, addToCart, toggleFavorite, favorites = [] }) => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        navigate(`/product/${product.id}`);
    };

    // Función para ordenar productos
    const sortProducts = (productsToSort) => {
        return [...productsToSort].sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = parseFloat(a.price);
                    bValue = parseFloat(b.price);
                    break;
                case 'rating':
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                default:
                    return 0;
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    };

    if (!products || products.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Volver</span>
                        </button>
                        <h1 className="text-3xl font-bold text-white">Todos los Productos</h1>
                        <div></div>
                    </div>
                    
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-xl text-gray-400">No hay productos disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    const sortedProducts = sortProducts(products);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Volver</span>
                    </button>
                    <h1 className="text-3xl font-bold text-white">Todos los Productos</h1>
                    <div></div>
                </div>

                {/* Contador y controles de ordenación */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <p className="text-gray-400">
                        {products.length} {products.length === 1 ? 'producto disponible' : 'productos disponibles'}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-400 text-sm">Ordenar por:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
                        >
                            <option value="name">Nombre</option>
                            <option value="price">Precio</option>
                            <option value="rating">Rating</option>
                        </select>
                        
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                            <svg 
                                className={`w-4 h-4 text-white transform ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform duration-200`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Grid de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {currentProducts.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product}
                            onProductClick={handleProductClick}
                            addToCart={addToCart}
                            toggleFavorite={toggleFavorite}
                            isFavorite={favorites.includes(product.id)}
                        />
                    ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Anterior
                        </button>
                        
                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                                        currentPage === pageNum
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente ProductCard reutilizable
const ProductCard = ({ product, onProductClick, addToCart, toggleFavorite, isFavorite }) => {
    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (addToCart) {
            addToCart(product);
        }
    };

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (toggleFavorite) {
            toggleFavorite(product.id);
        }
    };

    return (
        <div 
            onClick={() => onProductClick(product)}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
        >
            <div className="aspect-square overflow-hidden relative">
                <img
                    src={product.image_url || '/api/placeholder/300/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {toggleFavorite && (
                    <button
                        onClick={handleToggleFavorite}
                        className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-200"
                    >
                        <svg
                            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                )}
            </div>
            
            <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-emerald-400">
                        ${parseFloat(product.price).toFixed(2)}
                    </span>
                    
                    {product.rating && (
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-gray-400 text-sm">{product.rating}</span>
                        </div>
                    )}
                </div>
                
                {addToCart && (
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Agregar al Carrito</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default AllProductsPage;
