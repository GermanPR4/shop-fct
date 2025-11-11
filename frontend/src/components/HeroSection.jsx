import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ products = [] }) => {
    const navigate = useNavigate();

    const handleExploreDeals = () => {
        // Filtrar productos con 50% o más de descuento
        const bigDeals = products.filter(product => {
            const discount = parseFloat(product.discount || 0);
            return discount >= 50;
        });

        // Si hay exactamente un producto, ir directamente a él
        if (bigDeals.length === 1) {
            navigate(`/product/${bigDeals[0].id}`);
        } else {
            // Si hay varios o ninguno, ir a la página de productos con filtro
            navigate('/products?deals=50');
        }
    };

    return (
        // Contenedor Principal con tema oscuro moderno
        <div className="relative h-[550px] bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-lg mb-12 shadow-2xl overflow-hidden border border-gray-700/50">
            
            {/* Imagen de fondo con overlay oscuro */}
            <div className="absolute inset-0 bg-[url('/hero-fondo.webp')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black/40 to-indigo-900/20"></div>

            {/* Contenido del Hero con texto claro */}
            <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-16">
                
                {/* Etiqueta "Limited Edition" con gradiente morado/verde */}
                <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wider shadow-lg border border-purple-500/30">
                    LIMITED EDITION
                </span>
                
                {/* Título con gradiente de colores */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-none">
                    <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">50%</span>
                    <span className="text-white ml-4">OFF</span>
                </h1>
                
                {/* Párrafo de descripción */}
                <p className="text-xl md:text-2xl text-gray-200 max-w-xl mb-8 leading-relaxed">
                    Descubre moda de calidad que refleja tu estilo y haz que cada día sea extraordinario.
                </p>
                
                {/* Botón con gradiente moderno y hover mejorado */}
                <button 
                    onClick={handleExploreDeals}
                    className="group relative bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white hover:text-gray-100 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-500 shadow-2xl transform hover:scale-110 border border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] overflow-hidden"
                >
                    {/* Efecto de brillo animado */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                    
                    {/* Resplandor adicional en hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-indigo-400/0 to-emerald-400/0 group-hover:from-purple-400/30 group-hover:via-indigo-400/30 group-hover:to-emerald-400/30 blur-xl transition-all duration-500"></span>
                    
                    {/* Texto del botón */}
                    <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        EXPLORAR PRODUCTO
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </button>
            </div>
            
        </div>
    );
};

export default HeroSection;