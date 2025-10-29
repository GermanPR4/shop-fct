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
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

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
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition z-50 transform hover:scale-110"
                aria-label="Abrir chat de IA"
            >
                {/* Icono de Chat */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {/* Panel del Chat */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 max-h-[70vh] bg-white rounded-lg shadow-xl border border-gray-200 z-40 flex flex-col">
                    {/* Cabecera */}
                    <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(false)}>
                        <h3 className="font-semibold">Asistente OmniStyle</h3>
                        <button className="text-indigo-100 hover:text-white text-2xl leading-none">&times;</button>
                    </div>

                    {/* Área de Mensajes */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {/* Indicador de carga */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm">
                                    Pensando...
                                </div>
                            </div>
                        )}
                        {/* Elemento invisible para hacer scroll */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input para escribir */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
                        <input
                            type="text"
                            placeholder="Pregúntame sobre moda..."
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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