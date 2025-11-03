import React from 'react';

const CategoryFilter = ({ categories, onSelectCategory, selectedCategoryId }) => {
    return (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700"> 
            <h3 className="text-md font-semibold text-white mb-3">Filtrar por Estilo</h3>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition duration-150 ${selectedCategoryId === null
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                            : 'bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600'
                        }`}
                >
                    Todas
                </button>

                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition duration-150 ${selectedCategoryId === category.id
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                : 'bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600'
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
