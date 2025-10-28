import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Cargando...')

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!apiUrl) {
      setMessage('Error: La variable VITE_API_URL no está configurada.');
      return;
    }

    fetch(`${apiUrl}/api/test`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Respuesta de red no fue OK (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage(`Error al conectar con el backend: ${error.message}`);
      });
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <div className="App">
      <h1>Test de Conexión Full-Stack</h1>
      <p>
        Mensaje del Backend: <strong>{message}</strong>
      </p>
      { !apiUrl && <p style={{color: 'red'}}>Revisa la variable VITE_API_URL en Railway.</p> }
    </div>
  )
}

export default App