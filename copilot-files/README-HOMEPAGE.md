# Jam Session - Real-Time Event Management Platform

A web application for organizing in-person Jam Sessions with real-time management of performances, musician registration, and live audience dashboards.

## Technology Stack

- **Framework**: React 19.2.0 + TypeScript
- **Build Tool**: Vite with rolldown-vite
- **Styling**: Tailwind CSS 4.1.17 + daisyUI 5.5.5
- **Real-time Communication**: Socket.IO (to be integrated in backend)
- **Package Manager**: npm

## Current Setup

### Theme Configuration
- **Current Theme**: Autumn (daisyUI)
- Theme is configured in `src/index.css` as the default theme
- To change theme, modify the `@plugin "daisyui"` configuration in `src/index.css`

### Icons
- **Icon Set**: Using simple inline SVG icons from standard icon libraries
- All SVG icons are built directly into components for minimal overhead
- Icons used:
  - Music note icon (navigation/branding)
  - Hamburger menu (mobile navigation)
  - All other icons are simple, built-in SVG paths

### Project Structure

```
src/
├── App.tsx                 # Main application layout
├── index.css               # Tailwind CSS + daisyUI configuration
├── main.tsx                # React entry point
├── assets/                 # Static assets
└── components/
    ├── Navbar.tsx          # Navigation bar with mobile menu
    ├── Hero.tsx            # Hero section with CTA
    ├── Features.tsx        # Feature cards for three user types
    ├── CallToAction.tsx    # Secondary CTA section
    └── Footer.tsx          # Footer with links and social media
```

## Home Page Components

### 1. **Navbar** (`src/components/Navbar.tsx`)
- Responsive navigation with hamburger menu on mobile
- Logo with music note icon
- Menu items: Home, Features, About
- "Create Jam" call-to-action button

### 2. **Hero** (`src/components/Hero.tsx`)
- Main headline and description
- Two prominent CTA buttons
- Responsive text sizing for all devices
- Full viewport height (min-h-screen)

### 3. **Features** (`src/components/Features.tsx`)
- Three feature cards representing different user types:
  - **For Hosts**: Jam creation, song registration, musician approval
  - **For Musicians**: Quick registration, song selection, real-time updates
  - **For Audience**: Public dashboards, live updates, shared links
- Card-based grid layout (responsive 1 col on mobile, 3 cols on desktop)

### 4. **Call to Action** (`src/components/CallToAction.tsx`)
- Reinforces main value proposition
- Two action buttons for different user journeys
- Secondary section for conversion optimization

### 5. **Footer** (`src/components/Footer.tsx`)
- Navigation links
- Social media integration placeholders
- Copyright information with dynamic year

## Available Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Lint code with ESLint
npm run lint

# Preview production build
npm run preview
```

## ESLint Configuration

The project uses TypeScript-aware ESLint rules. For production applications, enable stricter rules by modifying `eslint.config.js`:

- `tseslint.configs.recommendedTypeChecked` - Recommended rules
- `tseslint.configs.strictTypeChecked` - Stricter type checking
- `tseslint.configs.stylisticTypeChecked` - Style rules

## Styling Guidelines

### Color System
- Uses daisyUI semantic colors: `primary`, `secondary`, `accent`, `success`, `error`, `warning`, etc.
- All text colors automatically adapt to the theme (autumn)
- Base colors for layout: `base-100`, `base-200`, `base-300`

### Tailwind CSS Utilities
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Flexbox and grid for layouts
- Arbitrary values using square bracket notation when needed

### daisyUI Components Used
- `btn` - Buttons with variants and sizes
- `card` - Card containers
- `navbar` - Navigation bar with responsive layout
- `dropdown` - Dropdown menus
- `footer` - Footer component
- `hero` - Hero section
- `menu` - Menu lists

## Best Practices Applied

1. **Accessibility (a11y)**
   - Semantic HTML elements
   - Proper heading hierarchy (h1, h2, h3)
   - Alt text for images (to be added)
   - Keyboard navigation support

2. **Responsive Design**
   - Mobile-first approach
   - Tailwind responsive prefixes (md:, lg:)
   - Flexible layouts with flexbox/grid

3. **Code Quality**
   - TypeScript for type safety
   - ESLint for code consistency
   - Component-based architecture
   - Clean, well-organized file structure

4. **Performance**
   - CSS-in-utility approach (Tailwind)
   - No unnecessary custom CSS
   - Optimized SVG icons (inline)
   - Minimal JavaScript

## Development Workflow

1. Components are in `src/components/`
2. Styles are applied directly via Tailwind/daisyUI classes
3. No custom CSS needed - utility classes first approach
4. HMR enabled for instant feedback during development

## Documentation References

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [daisyUI Components](https://daisyui.com)
- [Vite Documentation](https://vite.dev)

## Next Steps

1. Set up backend with Node.js + NestJS + Socket.IO
2. Implement authentication and user management
3. Add real-time updates for musician registrations
4. Develop host jam management interface
5. Create musician dashboard
6. Build public audience dashboard
7. Integrate database and API endpoints

---

**Project Version**: 0.0.0 (MVP Foundation)
**Last Updated**: December 2025

