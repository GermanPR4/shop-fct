import React from 'react';

const CategoryFilter = ({ categories, onSelectCategory, selectedCategoryId }) => {
    return (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg"> {/* Fondo más sutil */}
            <h3 className="text-md font-semibold text-gray-700 mb-3">Filtrar por Estilo</h3>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition duration-150 ${selectedCategoryId === null
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                >
                    Todas
                </button>

                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition duration-150 ${selectedCategoryId === category.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
