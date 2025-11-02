import React from 'react';

// Datos de ejemplo para las categorías populares
const popularCategoriesData = [
    { name: 'Casual', icon: '👕', bgColor: 'bg-orange-100' },
    { name: 'Deportivo', icon: '🏃', bgColor: 'bg-red-100' },
    { name: 'Zapatos', icon: '👟', bgColor: 'bg-green-100' },
    { name: 'Invierno', icon: '🧥', bgColor: 'bg-cyan-100' }, // Reemplaza Electrónica
    { name: 'Veraniego', icon: '🕶️', bgColor: 'bg-yellow-100' }, // Reemplaza Cosméticos
    { name: 'Accesorios', icon: '🧣', bgColor: 'bg-blue-100' },
    // Nota: 'Accesorios' (auriculares) es un placeholder, 
    // puedes cambiar el icono por '👜' (bolso) o '🎧' (bufanda)
];

const PopularCategories = ({ onSelectCategory }) => {
    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Explora Categorías Populares</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Ver Todas &rarr;</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {popularCategoriesData.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onSelectCategory ? onSelectCategory(category.name) : null} // Llama a onSelectCategory si existe
                        className={`flex flex-col items-center p-4 rounded-full aspect-square justify-center text-center transition hover:shadow-lg ${category.bgColor}`}
                    >
                        <span className="text-4xl mb-2">{category.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PopularCategories;