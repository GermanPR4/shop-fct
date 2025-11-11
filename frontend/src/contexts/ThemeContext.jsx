import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Estados posibles: 'light', 'dark', 'auto'
  const [themeMode, setThemeMode] = useState(() => {
    // Cargar preferencia guardada o usar 'light' por defecto
    const savedTheme = localStorage.getItem('omnistyle-theme');
    return savedTheme || 'light';
  });

  // Detectar preferencia del sistema
  const [systemPreference, setSystemPreference] = useState(() => {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    // Usar addEventListener si está disponible, sino usar addListener (deprecated pero compatible)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Determinar el tema efectivo (el que realmente se aplica)
  const effectiveTheme = themeMode === 'auto' ? systemPreference : themeMode;

  // Aplicar el tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases de tema anteriores
    root.classList.remove('light-theme', 'dark-theme');
    
    // Añadir la clase correspondiente
    if (effectiveTheme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.add('light-theme');
    }

    // Actualizar el color-scheme para navegadores
    root.style.colorScheme = effectiveTheme;
  }, [effectiveTheme]);

  // Guardar preferencia en localStorage
  useEffect(() => {
    localStorage.setItem('omnistyle-theme', themeMode);
  }, [themeMode]);

  const value = {
    themeMode, // 'light', 'dark', 'auto'
    effectiveTheme, // 'light' o 'dark' (el que realmente se aplica)
    setThemeMode,
    systemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
