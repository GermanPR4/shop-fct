import React from 'react';

// Mapeo de iconos y colores para las categorías
const getCategoryStyle = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    // Mapeo de categorías a iconos y colores
    const categoryMap = {
        'casual': { icon: '👕', bgColor: 'bg-orange-100' },
        'ropa casual': { icon: '👕', bgColor: 'bg-orange-100' },
        'deportivo': { icon: '🏃', bgColor: 'bg-red-100' },
        'deporte': { icon: '🏃', bgColor: 'bg-red-100' },
        'zapatillas': { icon: '👟', bgColor: 'bg-green-100' },
        'zapatos': { icon: '👟', bgColor: 'bg-green-100' },
        'calzado': { icon: '👟', bgColor: 'bg-green-100' },
        'invierno': { icon: '🧥', bgColor: 'bg-cyan-100' },
        'abrigos': { icon: '🧥', bgColor: 'bg-cyan-100' },
        'verano': { icon: '🕶️', bgColor: 'bg-yellow-100' },
        'veraniego': { icon: '🕶️', bgColor: 'bg-yellow-100' },
        'accesorios': { icon: '🧣', bgColor: 'bg-blue-100' },
        'complementos': { icon: '🧣', bgColor: 'bg-blue-100' },
        'mujer': { icon: '👗', bgColor: 'bg-pink-100' },
        'hombre': { icon: '👔', bgColor: 'bg-gray-100' },
        'niños': { icon: '👶', bgColor: 'bg-purple-100' },
        'premium': { icon: '💎', bgColor: 'bg-indigo-100' },
        'formal': { icon: '🎩', bgColor: 'bg-slate-100' },
        'jeans': { icon: '👖', bgColor: 'bg-blue-100' },
        'pantalones': { icon: '👖', bgColor: 'bg-blue-100' }
    };
    
    // Buscar coincidencia exacta o parcial
    for (const [key, style] of Object.entries(categoryMap)) {
        if (name.includes(key) || key.includes(name)) {
            return style;
        }
    }
    
    // Estilo por defecto si no se encuentra coincidencia
    return { icon: '🏷️', bgColor: 'bg-gray-100' };
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
                <h2 className="text-2xl font-bold text-gray-800">Explora Categorías Populares</h2>
                <button 
                    onClick={() => onSelectCategory ? onSelectCategory(null) : null}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
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
                            className={`flex flex-col items-center p-4 rounded-full aspect-square justify-center text-center transition hover:shadow-lg ${categoryStyle.bgColor}`}
                        >
                            <span className="text-4xl mb-2">{categoryStyle.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PopularCategories;