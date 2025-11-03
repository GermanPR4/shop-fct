import React, { useState, useEffect, useRef } from 'react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Estado para guardar todos los mensajes de la conversación
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! ¿Cómo puedo ayudarte a encontrar tu estilo hoy?' }
    ]);
    // Estado para el mensaje que el usuario está escribiendo
    const [inputMessage, setInputMessage] = useState('');
    // Estado para guardar el token de la sesión de IA
    const [sessionToken, setSessionToken] = useState(localStorage.getItem('ai_session_token') || null);
    // Estado para mostrar un indicador de carga
    const [isLoading, setIsLoading] = useState(false);

    // Referencia para hacer scroll automático al final del chat
    const messagesEndRef = useRef(null);

    // URL de la API (asegúrate de que VITE_API_URL esté configurada)
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    // Efecto para hacer scroll al final cuando lleguen nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Función para ver producto completo
    const handleViewProduct = (productId) => {
        // Navegar a la página del producto en la misma ventana
        window.location.href = `/product/${productId}`;
    };

    // Función para manejar el envío del formulario (cuando el usuario presiona Enter)
    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita que la página se recargue
        const userMessage = inputMessage.trim(); // Limpia espacios

        if (!userMessage) return; // No envía mensajes vacíos

        // Añade el mensaje del usuario al historial local
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInputMessage(''); // Limpia el input
        setIsLoading(true); // Muestra indicador de carga

        try {
            // Prepara los datos para enviar al backend
            const payload = {
                message: userMessage,
                session_token: sessionToken, // sessionToken viene de localStorage o es null al principio
            };

            // Llama a la API del backend
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Si usas Sanctum y el usuario está logueado, necesitarás enviar el token Bearer
                    // 'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Error al conectar con el asistente.');
            }

            const data = await response.json();

            // Añade la respuesta del asistente al historial
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.reply,
                products: data.products || null // Si la IA encontró productos
            }]);

            // Guarda el nuevo token de sesión si es la primera vez o ha cambiado
            if (data.session_token && data.session_token !== sessionToken) {
                setSessionToken(data.session_token);
                localStorage.setItem('ai_session_token', data.session_token); // Guarda en localStorage para persistencia
            }

        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            // Añade un mensaje de error al chat
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un problema al conectar. Inténtalo de nuevo.' }]);
        } finally {
            setIsLoading(false); // Oculta indicador de carga
        }
    };

    return (
        <div>
            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 z-50 transform hover:scale-110 ring-4 ring-purple-500/20"
                aria-label="Abrir chat de IA"
            >
                {/* Icono de Chat */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {/* Panel del Chat */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 max-h-[70vh] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-40 flex flex-col">
                    {/* Cabecera */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Asistente OmniStyle</h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-purple-100 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200 transform hover:scale-110"
                            aria-label="Cerrar chat"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Área de Mensajes */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-900">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                                        : msg.isSystemMessage 
                                        ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700'
                                        : 'bg-gray-800 text-gray-200 border border-gray-700'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                    
                                    {/* Mostrar productos si los hay */}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.products.map((product) => (
                                                <div key={product.id} className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-lg">
                                                    <div className="font-medium text-white">{product.name}</div>
                                                    <div className="text-sm text-emerald-400 font-semibold">{product.price}€</div>
                                                    {product.colors && (
                                                        <div className="text-xs text-gray-300">Colores: {product.colors}</div>
                                                    )}
                                                    {product.sizes && (
                                                        <div className="text-xs text-gray-300">Tallas: {product.sizes}</div>
                                                    )}
                                                    <button
                                                        onClick={() => handleViewProduct(product.id)}
                                                        className="mt-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105 shadow-md"
                                                    >
                                                        Ver Producto
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Indicador de carga */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm border border-gray-700 animate-pulse">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span>Pensando...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Elemento invisible para hacer scroll */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input para escribir */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                        <input
                            type="text"
                            placeholder="Pregúntame sobre moda..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all duration-200"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isLoading} // Deshabilita mientras carga
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;