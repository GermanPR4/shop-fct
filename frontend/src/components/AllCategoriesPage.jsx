import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mapeo completo de categorías a iconos y colores
const categoryMap = {
    'casual': { icon: '👕', bgColor: 'bg-gradient-to-br from-orange-800/30 to-orange-700/20 hover:from-orange-700/40 hover:to-orange-600/30 border-orange-600/30' },
    'deportivo': { icon: '⚽', bgColor: 'bg-gradient-to-br from-red-800/30 to-red-700/20 hover:from-red-700/40 hover:to-red-600/30 border-red-600/30' },
    'zapatillas': { icon: '👟', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
    'zapatos': { icon: '👞', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
    'calzado': { icon: '🥿', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
    'invierno': { icon: '❄️', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
    'abrigos': { icon: '🧥', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
    'veraniego': { icon: '🌴', bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/20 hover:from-yellow-700/40 hover:to-yellow-600/30 border-yellow-600/30' },
    'accesorios': { icon: '💼', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
    'vestidos': { icon: '👗', bgColor: 'bg-gradient-to-br from-pink-800/30 to-pink-700/20 hover:from-pink-700/40 hover:to-pink-600/30 border-pink-600/30' },
    'complementos': { icon: '🎒', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
    'mujer': { icon: '👗', bgColor: 'bg-gradient-to-br from-pink-800/30 to-pink-700/20 hover:from-pink-700/40 hover:to-pink-600/30 border-pink-600/30' },
    'hombre': { icon: '🤵', bgColor: 'bg-gradient-to-br from-gray-700/30 to-gray-600/20 hover:from-gray-600/40 hover:to-gray-500/30 border-gray-500/30' },
    'premium': { icon: '✨', bgColor: 'bg-gradient-to-br from-indigo-800/30 to-indigo-700/20 hover:from-indigo-700/40 hover:to-indigo-600/30 border-indigo-600/30' },
    'formal': { icon: '🎩', bgColor: 'bg-gradient-to-br from-slate-700/30 to-slate-600/20 hover:from-slate-600/40 hover:to-slate-500/30 border-slate-500/30' },
    'jeans': { icon: '👖', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
    'pantalones': { icon: '🩳', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
    'gorras': { icon: '🧢', bgColor: 'bg-gradient-to-br from-green-800/30 to-green-700/20 hover:from-green-700/40 hover:to-green-600/30 border-green-600/30' },
    'sombreros': { icon: '🎩', bgColor: 'bg-gradient-to-br from-amber-800/30 to-amber-700/20 hover:from-amber-700/40 hover:to-amber-600/30 border-amber-600/30' },
    'camisetas': { icon: '👕', bgColor: 'bg-gradient-to-br from-teal-800/30 to-teal-700/20 hover:from-teal-700/40 hover:to-teal-600/30 border-teal-600/30' },
    'sudaderas': { icon: '🧥', bgColor: 'bg-gradient-to-br from-violet-800/30 to-violet-700/20 hover:from-violet-700/40 hover:to-violet-600/30 border-violet-600/30' },
    'faldas': { icon: '👗', bgColor: 'bg-gradient-to-br from-rose-800/30 to-rose-700/20 hover:from-rose-700/40 hover:to-rose-600/30 border-rose-600/30' },
    'bolsos': { icon: '👜', bgColor: 'bg-gradient-to-br from-purple-800/30 to-purple-700/20 hover:from-purple-700/40 hover:to-purple-600/30 border-purple-600/30' },
    'mochilas': { icon: '🎒', bgColor: 'bg-gradient-to-br from-indigo-800/30 to-indigo-700/20 hover:from-indigo-700/40 hover:to-indigo-600/30 border-indigo-600/30' },
    'relojes': { icon: '⌚', bgColor: 'bg-gradient-to-br from-gray-800/30 to-gray-700/20 hover:from-gray-700/40 hover:to-gray-600/30 border-gray-600/30' },
    'joyas': { icon: '💍', bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/20 hover:from-yellow-700/40 hover:to-yellow-600/30 border-yellow-600/30' },
    'chaquetas': { icon: '🧥', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
    'gafas': { icon: '🕶️', bgColor: 'bg-gradient-to-br from-slate-800/30 to-slate-700/20 hover:from-slate-700/40 hover:to-slate-600/30 border-slate-600/30' },
    'calcetines': { icon: '🧦', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
    'ropa interior': { icon: '🩲', bgColor: 'bg-gradient-to-br from-red-800/30 to-red-700/20 hover:from-red-700/40 hover:to-red-600/30 border-red-600/30' }
};

// Función para obtener estilo de categoría
const getCategoryStyle = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    // Buscar coincidencia exacta o parcial
    for (const [key, style] of Object.entries(categoryMap)) {
        if (name.includes(key) || key.includes(name)) {
            return style;
        }
    }
    
    // Estilo por defecto si no se encuentra coincidencia
    return { icon: '🏷️', bgColor: 'bg-gradient-to-br from-gray-700/30 to-gray-600/20 hover:from-gray-600/40 hover:to-gray-500/30 border-gray-500/30' };
};

// Función para generar todas las categorías desde el categoryMap
const getAllCategoriesFromMap = () => {
    return Object.keys(categoryMap).map((categoryName, index) => ({
        id: `map-${index}`,
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        isFromMap: true
    }));
};

// Componente ProductCard para mostrar productos
const ProductCard = ({ product, onProductClick }) => {
    const handleClick = () => {
        onProductClick(product);
    };

    // Obtener la imagen del primer detalle del producto (igual que en App.jsx)
    const defaultDetail = product.details && product.details.length > 0 ? product.details[0] : null;
    const imageUrl = defaultDetail?.image_url || 'https://placehold.co/400x400/374151/9CA3AF?text=OmniStyle';

    return (
        <div 
            onClick={handleClick}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
        >
            <div className="aspect-square overflow-hidden relative">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/400x400/374151/9CA3AF?text=OmniStyle';
                    }}
                />
            </div>
            
            <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                </h3>
                
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {/* Verificar si tiene ofertas activas */}
                        {product.offers && product.offers.length > 0 ? (
                            <>
                                {/* Precio con descuento */}
                                <span className="text-2xl font-bold text-emerald-400">
                                    ${(parseFloat(product.price) * (1 - parseFloat(product.offers[0].discount_percentage) / 100)).toFixed(2)}
                                </span>
                                {/* Precio original tachado y badge de descuento */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 line-through">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </span>
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                        -{product.offers[0].discount_percentage}%
                                    </span>
                                </div>
                            </>
                        ) : (
                            /* Precio normal sin oferta */
                            <span className="text-2xl font-bold text-emerald-400">
                                ${parseFloat(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AllCategoriesPage = ({ allProducts = [] }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // Generar todas las categorías desde el categoryMap
    const allCategories = getAllCategoriesFromMap();

    // Filtrar productos cuando se selecciona una categoría
    useEffect(() => {
        if (selectedCategory && allProducts.length > 0) {
            // Si es una categoría del mapa, filtrar por nombre
            if (selectedCategory.isFromMap) {
                const filtered = allProducts.filter(product => 
                    product.categories && product.categories.some(cat => 
                        cat.name.toLowerCase() === selectedCategory.name.toLowerCase()
                    )
                );
                setFilteredProducts(filtered);
                console.log('Filtered products by name:', filtered);
            } else {
                // Si es una categoría de la BD, filtrar por ID
                const filtered = allProducts.filter(product => 
                    product.categories && product.categories.some(cat => cat.id === selectedCategory.id)
                );
                setFilteredProducts(filtered);
                console.log('Filtered products by ID:', filtered);
            }
        }
    }, [selectedCategory, allProducts]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setFilteredProducts([]); // Limpiar productos mientras se filtran
    };

    const handleGoBack = () => {
        if (selectedCategory) {
            // Si hay una categoría seleccionada, volver a la lista de categorías
            setSelectedCategory(null);
            setFilteredProducts([]);
        } else {
            // Si no hay categoría seleccionada, volver a la página principal
            navigate('/');
        }
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    if (!allCategories || allCategories.length === 0) {
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
                        <h1 className="text-3xl font-bold text-white">Todas las Categorías</h1>
                        <div></div>
                    </div>
                    
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📂</div>
                        <p className="text-xl text-gray-400">No hay categorías disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si hay una categoría seleccionada, mostrar productos de esa categoría
    if (selectedCategory) {
        const categoryStyle = getCategoryStyle(selectedCategory.name);
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header con categoría seleccionada */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Volver a Categorías</span>
                        </button>
                        
                        <h1 className="text-3xl font-bold text-white">{selectedCategory.name}</h1>
                        
                        {/* Categoría seleccionada a la derecha */}
                        <div className={`flex flex-col items-center p-4 rounded-2xl border-2 ${categoryStyle.bgColor}`}>
                            <span className="text-3xl mb-1">{categoryStyle.icon}</span>
                            <span className="text-xs font-medium text-gray-200">{selectedCategory.name}</span>
                        </div>
                    </div>

                    {/* Productos de la categoría */}
                    <div className="mb-8">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">📦</div>
                                <p className="text-xl text-gray-400">No hay productos disponibles en esta categoría</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-400 mb-6">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.map((product) => (
                                        <ProductCard 
                                            key={product.id} 
                                            product={product}
                                            onProductClick={handleProductClick}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Vista por defecto: Mostrar todas las categorías
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
                    <h1 className="text-3xl font-bold text-white">Todas las Categorías</h1>
                    <div></div>
                </div>

                {/* Contador de categorías */}
                <div className="mb-8">
                    <p className="text-gray-400 text-center">
                        {allCategories.length} {allCategories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
                    </p>
                </div>

                {/* Grid de categorías */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {allCategories.map((category) => {
                        const categoryStyle = getCategoryStyle(category.name);
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className={`flex flex-col items-center p-6 rounded-2xl aspect-square justify-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 ${categoryStyle.bgColor}`}
                            >
                                <span className="text-5xl mb-3">{categoryStyle.icon}</span>
                                <span className="text-sm font-medium text-gray-200 leading-tight">{category.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Información adicional */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Haz clic en cualquier categoría para ver los productos disponibles
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AllCategoriesPage;
