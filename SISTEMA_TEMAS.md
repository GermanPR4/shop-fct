# Sistema de Temas - Documentación

## 📋 Resumen de Cambios

Se ha implementado un sistema completo de temas (claro/oscuro) con las siguientes características:

### ✨ Características Implementadas

1. **Tres Modos de Tema:**
   - 🌞 **Modo Claro** (nuevo diseño base por defecto)
   - 🌙 **Modo Oscuro** (variante oscura del diseño)
   - 🔄 **Modo Automático** (se adapta a la preferencia del sistema)

2. **Persistencia:**
   - Las preferencias del usuario se guardan en `localStorage`
   - El tema seleccionado se mantiene entre sesiones

3. **Detección del Sistema:**
   - Responde automáticamente a cambios en `prefers-color-scheme`
   - Actualización en tiempo real cuando el usuario cambia la preferencia del sistema

## 🎨 Paleta de Colores

### Tema Claro (Base)
```css
Fondos:
- Primary: #ffffff (blanco puro)
- Secondary: #f8fafc (gris muy claro)
- Tertiary: #f1f5f9 (gris claro)

Texto:
- Primary: #0f172a (azul oscuro profundo)
- Secondary: #475569 (gris medio)
- Tertiary: #64748b (gris claro)

Acentos:
- Primary: #10b981 (verde esmeralda)
- Secondary: #8b5cf6 (púrpura)
```

### Tema Oscuro
```css
Fondos:
- Primary: #0f172a (azul oscuro profundo)
- Secondary: #1e293b (azul grisáceo oscuro)
- Tertiary: #334155 (gris oscuro)

Texto:
- Primary: #f8fafc (blanco casi puro)
- Secondary: #cbd5e1 (gris muy claro)
- Tertiary: #94a3b8 (gris medio claro)

Acentos:
- Primary: #10b981 (verde esmeralda - mismo tono)
- Secondary: #a78bfa (púrpura claro)
```

## 🔧 Archivos Modificados

### 1. `frontend/src/contexts/ThemeContext.jsx` (NUEVO)
Contexto de React que gestiona:
- Estado del tema (`light`, `dark`, `auto`)
- Detección de preferencia del sistema
- Aplicación de clases CSS al `<html>`
- Persistencia en localStorage

**Uso:**
```jsx
import { useTheme } from './contexts/ThemeContext.jsx';

const MyComponent = () => {
  const { themeMode, setThemeMode, effectiveTheme } = useTheme();
  
  return (
    <select value={themeMode} onChange={(e) => setThemeMode(e.target.value)}>
      <option value="light">Claro</option>
      <option value="dark">Oscuro</option>
      <option value="auto">Automático</option>
    </select>
  );
};
```

### 2. `frontend/src/index.css`
**Cambios:**
- ✅ Definición de variables CSS para todos los colores
- ✅ Dos conjuntos de variables (`.light-theme` y `.dark-theme`)
- ✅ Eliminación de media query `@media (prefers-color-scheme: light)`
- ✅ Estilos base usando variables CSS
- ✅ Mejoras sutiles en bordes, sombras y transiciones

**Variables principales:**
```css
--bg-primary, --bg-secondary, --bg-tertiary
--text-primary, --text-secondary, --text-tertiary
--accent-primary, --accent-secondary
--border-color, --border-radius-*
--shadow-sm, --shadow-md, --shadow-lg
--transition-fast, --transition-base, --transition-slow
```

### 3. `frontend/src/App.css`
**Cambios:**
- ✅ Reemplazo de colores hardcoded por variables CSS
- ✅ Uso de variables para transiciones
- ✅ Aplicación de variables en `.card` y otros elementos

### 4. `frontend/src/main.jsx`
**Cambios:**
- ✅ Importación del `ThemeProvider`
- ✅ Envoltorio de `<App />` con `<ThemeProvider>`

### 5. `frontend/src/App.jsx`
**Cambios:**
- ✅ Importación del hook `useTheme`
- ✅ Nuevo componente `ThemeToggle` en la navbar
- ✅ Actualización de `SettingsPage` para usar el contexto
- ✅ Selector de tema funcional

## 🎯 Componentes Nuevos

### ThemeToggle (en Navbar)
Un botón interactivo que:
- Muestra el tema actual (☀️ o 🌙)
- Indica modo automático con un punto azul
- Despliega un menú con las tres opciones
- Cambia el tema al hacer clic

**Ubicación:** Navbar, entre el carrito y el divisor

### Selector en SettingsPage
Un select tradicional conectado al contexto que permite cambiar el tema desde la página de configuración.

## 🚀 Cómo Funciona

1. **Inicialización:**
   - Al cargar la app, `ThemeProvider` lee el tema guardado en localStorage (por defecto: `light`)
   - Aplica la clase correspondiente al `<html>` (`.light-theme` o `.dark-theme`)

2. **Cambio de Tema:**
   - Usuario selecciona un tema desde la navbar o configuración
   - `setThemeMode()` actualiza el estado
   - Se guarda en localStorage
   - Se aplica la clase CSS al `<html>`
   - Los estilos cambian automáticamente gracias a las variables CSS

3. **Modo Automático:**
   - Escucha eventos de `matchMedia('(prefers-color-scheme: dark)')`
   - Actualiza `systemPreference` cuando cambia
   - Si `themeMode === 'auto'`, usa `systemPreference`

## 📝 Mejoras Sutiles del Diseño

### Colores
- Paleta moderna y profesional
- Mejor contraste en ambos temas
- Colores de acento vibrantes pero no agresivos

### Bordes
- Border radius consistente (6px, 8px, 12px, 16px)
- Colores de borde adaptativos al tema

### Sombras
- Sombras más sutiles y realistas
- 4 niveles de elevación (sm, md, lg, xl)
- Sombras diferentes para tema claro/oscuro

### Transiciones
- Tres velocidades estándar (fast: 150ms, base: 200ms, slow: 300ms)
- Aplicadas consistentemente en toda la app
- Transición suave al cambiar de tema

### Scrollbar
- Scrollbar personalizado que se adapta al tema
- Estilo moderno y sutil

## 🔍 Testing

Para probar el sistema:

1. **Cambio Manual:**
   - Haz clic en el botón de tema en la navbar (☀️/🌙)
   - Selecciona cada opción y verifica el cambio

2. **Persistencia:**
   - Cambia el tema
   - Recarga la página
   - El tema debe mantenerse

3. **Modo Automático:**
   - Selecciona "Automático"
   - Cambia la preferencia del sistema operativo
   - El tema debe cambiar automáticamente

4. **Desde Configuración:**
   - Ve a la página de configuración
   - Cambia el tema desde el select
   - Debe funcionar igual que desde la navbar

## 🐛 Notas sobre el Warning

Existe un warning de ESLint en `ThemeContext.jsx`:
```
Fast refresh only works when a file only exports components.
```

**No es un error crítico.** Es solo una advertencia de que el archivo exporta tanto un hook (`useTheme`) como un componente (`ThemeProvider`). No afecta la funcionalidad, solo el hot-reloading durante el desarrollo.

**Solución opcional:** Separar en dos archivos:
- `ThemeContext.jsx` (solo contexto y provider)
- `useTheme.js` (solo el hook)

## 📱 Responsive

El sistema funciona perfectamente en:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

El botón de tema es totalmente responsive y se adapta al tamaño de pantalla.

## 🎓 Conclusión

Has conseguido:
- ✅ Un tema claro como diseño base (mejorando el oscuro anterior)
- ✅ Un tema oscuro perfectamente funcional
- ✅ Modo automático que respeta las preferencias del usuario
- ✅ Diseño mejorado sutilmente con mejor tipografía, colores y efectos
- ✅ Sistema completamente funcional y persistente
- ✅ Fácil de extender y mantener

¡El sistema de temas está completo y listo para usar! 🎉
