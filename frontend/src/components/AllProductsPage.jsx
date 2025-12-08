import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
const normalizeText = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .trim();
};

// Función para obtener la raíz de una palabra (stemming básico en español)
const getStem = (word) => {
    // Eliminar plurales comunes en español
    word = word.replace(/s$/, ''); // zapatos -> zapato
    word = word.replace(/es$/, ''); // pantalones -> pantalone
    word = word.replace(/as$/, ''); // camisas -> camisa
    word = word.replace(/os$/, ''); // vestidos -> vestid
    
    // Eliminar terminaciones comunes
    word = word.replace(/ción$/, ''); // colección -> colecc
    word = word.replace(/dad$/, ''); // calidad -> cali
    word = word.replace(/mente$/, ''); // rápidamente -> rápida
    
    return word;
};

// Función para calcular la distancia de Levenshtein (para errores tipográficos)
const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // sustitución
                    matrix[i][j - 1] + 1,     // inserción
                    matrix[i - 1][j] + 1      // eliminación
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
};

// Función para calcular la puntuación de relevancia
const calculateRelevance = (product, searchTerms) => {
    let score = 0;
    const productName = normalizeText(product.name);
    const productDesc = normalizeText(product.description || '');
    const productCategories = product.categories?.map(c => normalizeText(c.name)).join(' ') || '';
    
    searchTerms.forEach(term => {
        const termStem = getStem(term);
        
        // Coincidencia exacta en nombre (puntuación alta)
        if (productName.includes(term)) {
            score += 100;
        }
        
        // Coincidencia con raíz en nombre (plurales, etc.)
        if (productName.includes(termStem)) {
            score += 80;
        }
        
        // Coincidencia exacta en descripción
        if (productDesc.includes(term)) {
            score += 50;
        }
        
        // Coincidencia con raíz en descripción
        if (productDesc.includes(termStem)) {
            score += 40;
        }
        
        // Coincidencia en categorías
        if (productCategories.includes(term)) {
            score += 70;
        }
        
        if (productCategories.includes(termStem)) {
            score += 60;
        }
        
        // Búsqueda difusa (errores tipográficos) - solo para palabras de más de 3 caracteres
        if (term.length > 3) {
            const words = productName.split(/\s+/);
            words.forEach(word => {
                const distance = levenshteinDistance(term, word);
                // Si la distancia es pequeña (1-2 caracteres de diferencia), añadir puntos
                if (distance === 1) {
                    score += 30;
                } else if (distance === 2) {
                    score += 15;
                }
            });
        }
    });
    
    return score;
};

const AllProductsPage = ({ products, setSelectedProduct, addToCart, toggleFavorite, favorites = [] }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const dealsFilter = searchParams.get('deals') || '';
    
    const [sortBy, setSortBy] = useState(searchQuery ? 'relevance' : 'name');
    const [sortOrder, setSortOrder] = useState(searchQuery ? 'desc' : 'asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const productsPerPage = 12;

    // Efecto para filtrar productos según la búsqueda o descuentos
    useEffect(() => {
        let result = products;

        // Filtrar por búsqueda
        if (searchQuery) {
            const normalizedQuery = normalizeText(searchQuery);
            const searchTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);
            
            // Filtrar y puntuar productos
            result = result
                .map(product => ({
                    ...product,
                    relevanceScore: calculateRelevance(product, searchTerms)
                }))
                .filter(product => product.relevanceScore > 0)
                .sort((a, b) => b.relevanceScore - a.relevanceScore);
            
            setSortBy('relevance');
            setSortOrder('desc');
        }
        
        // Filtrar por descuento (usando ofertas)
        if (dealsFilter) {
            const minDiscount = parseFloat(dealsFilter);
            result = result.filter(product => {
                // Verificar si tiene ofertas activas
                if (!product.offers || product.offers.length === 0) return false;
                
                // Buscar si alguna oferta cumple con el descuento mínimo
                return product.offers.some(offer => {
                    const discount = parseFloat(offer.discount_percentage || 0);
                    return discount >= minDiscount;
                });
            });
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [searchQuery, dealsFilter, products]);

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
                case 'relevance':
                    // Si hay búsqueda, ordenar por relevancia
                    aValue = a.relevanceScore || 0;
                    bValue = b.relevanceScore || 0;
                    break;
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

    if (!filteredProducts || filteredProducts.length === 0) {
        return (
            <div className="min-h-screen from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Volver</span>
                        </button>
                        <h1 className="text-3xl font-bold text-white">
                            {searchQuery ? `Resultados para "${searchQuery}"` : 'Productos con +50% de Descuento'}
                        </h1>
                        <div></div>
                    </div>
                    
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-xl text-gray-400">
                            {searchQuery ? 'No se encontraron productos que coincidan con tu búsqueda' : 'No hay productos disponibles'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const sortedProducts = sortProducts(filteredProducts);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen  from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Volver</span>
                    </button>
                    <h1 className="text-3xl font-bold text-white">
                        {searchQuery 
                            ? `Resultados para "${searchQuery}"` 
                            : dealsFilter 
                            ? `Ofertas con ${dealsFilter}% o más de descuento`
                            : 'Todos los Productos'}
                    </h1>
                </div>

                {/* Mostrar información de resultados de búsqueda */}
                {searchQuery && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-emerald-400">
                            Se encontraron <span className="font-bold">{filteredProducts.length}</span> productos que coinciden con "{searchQuery}"
                        </p>
                    </div>
                )}

                {/* Mostrar información de ofertas especiales */}
                {dealsFilter && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🔥</span>
                            <div>
                                <p className="text-purple-400 font-semibold">
                                    {filteredProducts.length === 0 
                                        ? `No hay productos con ${dealsFilter}% o más de descuento en este momento` 
                                        : filteredProducts.length === 1
                                        ? `¡Encontramos 1 producto con ${dealsFilter}% o más de descuento!`
                                        : `¡Encontramos ${filteredProducts.length} productos con ${dealsFilter}% o más de descuento!`
                                    }
                                </p>
                                <p className="text-gray-400 text-sm mt-1">Vuelve pronto para ver nuevas ofertas increíbles</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contador y controles de ordenación */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <p className="text-gray-400">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'producto disponible' : 'productos disponibles'}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-400 text-sm">Ordenar por:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
                        >
                            {searchQuery && <option value="relevance">Relevancia</option>}
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
            className="backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-400/30 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
        >
            <div className="aspect-square overflow-hidden relative bg-gray-700">
                <img
                    src={product.details?.[0]?.image_url || product.image_url || '/api/placeholder/300/300'}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 group-hover:opacity-90 transition-opacity duration-300"
                />
                {toggleFavorite && (
                    <button
                        onClick={handleToggleFavorite}
                        className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
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
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
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
