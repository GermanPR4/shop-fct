import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryFilter = ({ categories, onSelectCategory, selectedCategoryId }) => {
    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate('/categories');
    };

    return (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700"> 
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-white">Filtrar por Estilo</h3>
                <button 
                    onClick={handleViewAll}
                    className="group text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-all duration-200 flex items-center space-x-2 bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-2 rounded-lg border border-emerald-400/30 hover:border-emerald-400/50"
                >
                    <span>Ver Todos</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
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
