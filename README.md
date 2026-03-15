# FlashMind - Inteligencia en cada tarjeta

FlashMind es una aplicación moderna de estudio basada en el sistema de repetición espaciada (Spaced Repetition System - SRS), diseñada para optimizar el aprendizaje y la retención de información a largo plazo.

![FlashMind Preview](https://via.placeholder.com/1200x600?text=FlashMind+Interface+Preview)

## Características Principales

- **Importación Versátil**: Compatibilidad total con archivos de Anki (.apkg) y archivos CSV.
- **Sesiones de Repaso Inteligentes**: Interfaz optimizada para enfocarte en lo que más necesitas reforzar.
- **Estadísticas Detalladas**: Visualiza tu progreso, rachas de estudio y métricas de retención.
- **Glosario Integrado**: Acceso rápido y búsqueda eficiente de todos tus conceptos guardados.
- **Soporte LaTeX**: Renderizado perfecto de fórmulas matemáticas y notación científica mediante KaTeX.
- **Diseño Responsivo**: Estudia en cualquier dispositivo con una interfaz fluida y moderna.

## Tecnologías Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Estado**: [Zustand](https://github.com/pmndrs/zustand)
- **Procesamiento de Archivos**: [SQL.js](https://sql.js.org/) & [JSZip](https://stuk.github.io/jszip/)
- **Matemáticas**: [KaTeX](https://katex.org/)
- **Iconos**: [Lucide React](https://lucide.dev/)

## Configuración e Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión v18 o superior recomendada)
- Una cuenta en [Supabase](https://supabase.com/)

### Pasos a seguir

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/anki-app.git
   cd anki-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Variables de Entorno**
   Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

4. **Iniciar en modo desarrollo**
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```text
src/
├── components/     # Componentes reutilizables (Sidebar, Layout, etc.)
├── pages/          # Vistas principales (Dashboard, Review, Statistics)
├── store/          # Gestión de estado con Zustand
├── lib/            # Configuraciones de bibliotecas externas (Supabase)
├── utils/          # Funciones de ayuda y lógica de importación
└── assets/         # Imágenes, estilos globales y fuentes
```

---

Desarrollado con afecto para facilitar el aprendizaje continuo.
