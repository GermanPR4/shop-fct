import React from 'react';
import { useNavigate } from 'react-router-dom';

// Reutilizamos la función de estilos de PopularCategories
const getCategoryStyle = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    // Mapeo de categorías a iconos y colores
    const categoryMap = {
        'casual': { icon: '👕', bgColor: 'bg-gradient-to-br from-orange-800/30 to-orange-700/20 hover:from-orange-700/40 hover:to-orange-600/30 border-orange-600/30' },
        'ropa casual': { icon: '👕', bgColor: 'bg-gradient-to-br from-orange-800/30 to-orange-700/20 hover:from-orange-700/40 hover:to-orange-600/30 border-orange-600/30' },
        'deportivo': { icon: '⚽', bgColor: 'bg-gradient-to-br from-red-800/30 to-red-700/20 hover:from-red-700/40 hover:to-red-600/30 border-red-600/30' },
        'deporte': { icon: '🏃‍♂️', bgColor: 'bg-gradient-to-br from-red-800/30 to-red-700/20 hover:from-red-700/40 hover:to-red-600/30 border-red-600/30' },
        'zapatillas': { icon: '👟', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
        'zapatos': { icon: '👞', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
        'calzado': { icon: '🥿', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
        'invierno': { icon: '❄️', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
        'abrigos': { icon: '🧥', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
        'verano': { icon: '☀️', bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/20 hover:from-yellow-700/40 hover:to-yellow-600/30 border-yellow-600/30' },
        'veraniego': { icon: '🌴', bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/20 hover:from-yellow-700/40 hover:to-yellow-600/30 border-yellow-600/30' },
        'accesorios': { icon: '💼', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
        'complementos': { icon: '🎒', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
        'mujer': { icon: '👗', bgColor: 'bg-gradient-to-br from-pink-800/30 to-pink-700/20 hover:from-pink-700/40 hover:to-pink-600/30 border-pink-600/30' },
        'hombre': { icon: '🤵', bgColor: 'bg-gradient-to-br from-gray-700/30 to-gray-600/20 hover:from-gray-600/40 hover:to-gray-500/30 border-gray-500/30' },
        'niños': { icon: '🧸', bgColor: 'bg-gradient-to-br from-purple-800/30 to-purple-700/20 hover:from-purple-700/40 hover:to-purple-600/30 border-purple-600/30' },
        'premium': { icon: '✨', bgColor: 'bg-gradient-to-br from-indigo-800/30 to-indigo-700/20 hover:from-indigo-700/40 hover:to-indigo-600/30 border-indigo-600/30' },
        'formal': { icon: '🎩', bgColor: 'bg-gradient-to-br from-slate-700/30 to-slate-600/20 hover:from-slate-600/40 hover:to-slate-500/30 border-slate-500/30' },
        'jeans': { icon: '👖', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
        'pantalones': { icon: '🩳', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
        'gorras': { icon: '🧢', bgColor: 'bg-gradient-to-br from-green-800/30 to-green-700/20 hover:from-green-700/40 hover:to-green-600/30 border-green-600/30' },
        'sombreros': { icon: '🎩', bgColor: 'bg-gradient-to-br from-amber-800/30 to-amber-700/20 hover:from-amber-700/40 hover:to-amber-600/30 border-amber-600/30' },
        'camisetas': { icon: '👕', bgColor: 'bg-gradient-to-br from-teal-800/30 to-teal-700/20 hover:from-teal-700/40 hover:to-teal-600/30 border-teal-600/30' },
        'sudaderas': { icon: '🧥', bgColor: 'bg-gradient-to-br from-violet-800/30 to-violet-700/20 hover:from-violet-700/40 hover:to-violet-600/30 border-violet-600/30' },
        'chaquetas': { icon: '🧥', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
        'faldas': { icon: '👗', bgColor: 'bg-gradient-to-br from-rose-800/30 to-rose-700/20 hover:from-rose-700/40 hover:to-rose-600/30 border-rose-600/30' },
        'vestidos': { icon: '👗', bgColor: 'bg-gradient-to-br from-pink-800/30 to-pink-700/20 hover:from-pink-700/40 hover:to-pink-600/30 border-pink-600/30' },
        'bolsos': { icon: '👜', bgColor: 'bg-gradient-to-br from-purple-800/30 to-purple-700/20 hover:from-purple-700/40 hover:to-purple-600/30 border-purple-600/30' },
        'mochilas': { icon: '🎒', bgColor: 'bg-gradient-to-br from-indigo-800/30 to-indigo-700/20 hover:from-indigo-700/40 hover:to-indigo-600/30 border-indigo-600/30' },
        'relojes': { icon: '⌚', bgColor: 'bg-gradient-to-br from-gray-800/30 to-gray-700/20 hover:from-gray-700/40 hover:to-gray-600/30 border-gray-600/30' },
        'joyas': { icon: '💍', bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/20 hover:from-yellow-700/40 hover:to-yellow-600/30 border-yellow-600/30' },
        'gafas': { icon: '🕶️', bgColor: 'bg-gradient-to-br from-slate-800/30 to-slate-700/20 hover:from-slate-700/40 hover:to-slate-600/30 border-slate-600/30' },
        'calcetines': { icon: '🧦', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
        'ropa interior': { icon: '🩲', bgColor: 'bg-gradient-to-br from-red-800/30 to-red-700/20 hover:from-red-700/40 hover:to-red-600/30 border-red-600/30' }
    };
    
    // Buscar coincidencia exacta o parcial
    for (const [key, style] of Object.entries(categoryMap)) {
        if (name.includes(key) || key.includes(name)) {
            return style;
        }
    }
    
    // Estilo por defecto si no se encuentra coincidencia
    return { icon: '🏷️', bgColor: 'bg-gradient-to-br from-gray-700/30 to-gray-600/20 hover:from-gray-600/40 hover:to-gray-500/30 border-gray-500/30' };
};

const AllCategoriesPage = ({ categories, onSelectCategory }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId) => {
        if (onSelectCategory) {
            onSelectCategory(categoryId);
        }
        // Navegar al catálogo con la categoría seleccionada
        navigate('/', { state: { selectedCategory: categoryId } });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!categories || categories.length === 0) {
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
                        <div></div> {/* Spacer para centrar el título */}
                    </div>
                    
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📂</div>
                        <p className="text-xl text-gray-400">No hay categorías disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

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
                    <div></div> {/* Spacer para centrar el título */}
                </div>

                {/* Contador de categorías */}
                <div className="mb-8">
                    <p className="text-gray-400 text-center">
                        {categories.length} {categories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
                    </p>
                </div>

                {/* Grid de categorías */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {categories.map((category) => {
                        const categoryStyle = getCategoryStyle(category.name);
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
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
