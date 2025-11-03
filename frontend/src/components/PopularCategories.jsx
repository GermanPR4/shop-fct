import React from 'react';

// Mapeo de iconos y colores para las categorías
const getCategoryStyle = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    // Mapeo de categorías a iconos y colores
    const categoryMap = {
        'casual': { icon: '👕', bgColor: 'bg-gradient-to-br from-orange-800/30 to-orange-700/20 hover:from-orange-700/40 hover:to-orange-600/30 border-orange-600/30' },
        'ropa casual': { icon: '👕', bgColor: 'bg-gradient-to-br from-orange-800/30 to-orange-700/20 hover:from-orange-700/40 hover:to-orange-600/30 border-orange-600/30' },
        'deportivo': { icon: '🏃', bgColor: 'bg-gradient-to-br from-red-800/30 to-red-700/20 hover:from-red-700/40 hover:to-red-600/30 border-red-600/30' },
        'deporte': { icon: '🏃', bgColor: 'bg-gradient-to-br from-red-800/30 to-red-700/20 hover:from-red-700/40 hover:to-red-600/30 border-red-600/30' },
        'zapatillas': { icon: '👟', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
        'zapatos': { icon: '👟', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
        'calzado': { icon: '👟', bgColor: 'bg-gradient-to-br from-emerald-800/30 to-emerald-700/20 hover:from-emerald-700/40 hover:to-emerald-600/30 border-emerald-600/30' },
        'invierno': { icon: '🧥', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
        'abrigos': { icon: '🧥', bgColor: 'bg-gradient-to-br from-cyan-800/30 to-cyan-700/20 hover:from-cyan-700/40 hover:to-cyan-600/30 border-cyan-600/30' },
        'verano': { icon: '🕶️', bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/20 hover:from-yellow-700/40 hover:to-yellow-600/30 border-yellow-600/30' },
        'veraniego': { icon: '🕶️', bgColor: 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/20 hover:from-yellow-700/40 hover:to-yellow-600/30 border-yellow-600/30' },
        'accesorios': { icon: '🧣', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
        'complementos': { icon: '🧣', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
        'mujer': { icon: '👗', bgColor: 'bg-gradient-to-br from-pink-800/30 to-pink-700/20 hover:from-pink-700/40 hover:to-pink-600/30 border-pink-600/30' },
        'hombre': { icon: '👔', bgColor: 'bg-gradient-to-br from-gray-700/30 to-gray-600/20 hover:from-gray-600/40 hover:to-gray-500/30 border-gray-500/30' },
        'niños': { icon: '👶', bgColor: 'bg-gradient-to-br from-purple-800/30 to-purple-700/20 hover:from-purple-700/40 hover:to-purple-600/30 border-purple-600/30' },
        'premium': { icon: '💎', bgColor: 'bg-gradient-to-br from-indigo-800/30 to-indigo-700/20 hover:from-indigo-700/40 hover:to-indigo-600/30 border-indigo-600/30' },
        'formal': { icon: '🎩', bgColor: 'bg-gradient-to-br from-slate-700/30 to-slate-600/20 hover:from-slate-600/40 hover:to-slate-500/30 border-slate-500/30' },
        'jeans': { icon: '👖', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' },
        'pantalones': { icon: '👖', bgColor: 'bg-gradient-to-br from-blue-800/30 to-blue-700/20 hover:from-blue-700/40 hover:to-blue-600/30 border-blue-600/30' }
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

const PopularCategories = ({ categories, onSelectCategory }) => {
    // Tomar las primeras 6 categorías como populares, o todas si hay menos de 6
    const popularCategories = categories ? categories.slice(0, 6) : [];
    
    // No mostrar nada si no hay categorías
    if (!categories || categories.length === 0) {
        return null;
    }
    
    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Explora Categorías Populares</h2>
                <button 
                    onClick={() => onSelectCategory ? onSelectCategory(null) : null}
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                >
                    Ver Todas &rarr;
                </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {popularCategories.map((category) => {
                    const categoryStyle = getCategoryStyle(category.name);
                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory ? onSelectCategory(category.id) : null}
                            className={`flex flex-col items-center p-4 rounded-2xl aspect-square justify-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 ${categoryStyle.bgColor}`}
                        >
                            <span className="text-4xl mb-2">{categoryStyle.icon}</span>
                            <span className="text-sm font-medium text-gray-200">{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PopularCategories;