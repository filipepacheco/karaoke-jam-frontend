# Quick Start Guide - Jam Session Home Page

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm (comes with Node.js)

### Installation & Development

```bash
# Navigate to project directory
cd /Users/e160069/WebstormProjects/untitled5

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app layout
├── index.css                  # Tailwind + daisyUI config
├── main.tsx                   # Entry point
├── App.css                    # (empty, not needed)
└── components/
    ├── Navbar.tsx             # Top navigation
    ├── Hero.tsx               # Main hero section
    ├── Features.tsx           # Feature cards (3 columns)
    ├── CallToAction.tsx       # Secondary CTA
    └── Footer.tsx             # Footer
```

---

## 🎨 Theme Information

### Current Theme: Autumn (daisyUI)

The theme is configured in `src/index.css`:
```css
@plugin "daisyui" {
  themes: autumn --default;
}
```

### Autumn Theme Colors
- **Primary**: Warm orange/amber (buttons, links)
- **Secondary**: Deep reds/browns (accents)
- **Base**: Cream/beige backgrounds
- **Neutral**: Natural earth tones

### Change Theme

To change the theme, edit `src/index.css`:
```css
/* Change 'autumn' to any available daisyUI theme */
@plugin "daisyui" {
  themes: [theme-name] --default;
}
```

Available themes: light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business, acid, lemonade, night, coffee, winter, dim, nord, sunset, caramellatte, abyss, silk

---

## 🎯 Component Overview

### 1. Navbar (`src/components/Navbar.tsx`)
- Responsive navigation bar
- Mobile: Hamburger menu (collapsed)
- Desktop: Horizontal menu
- Logo with music note icon
- "Create Jam" CTA button

### 2. Hero (`src/components/Hero.tsx`)
- Full-height hero section
- Main headline
- Value proposition text
- Two CTA buttons
- Responsive text sizing

### 3. Features (`src/components/Features.tsx`)
- Three feature cards
- User personas: Host, Musician, Audience
- Icons for each section
- Learn More buttons
- Responsive grid (1→3 columns)

### 4. CallToAction (`src/components/CallToAction.tsx`)
- Secondary conversion section
- Reinforces main value
- Two action buttons
- Different colored background

### 5. Footer (`src/components/Footer.tsx`)
- Navigation links
- Social media icons
- Copyright info (auto-updates year)

---

## 🎨 Styling System

### Using Tailwind CSS

All styling uses Tailwind utility classes. No custom CSS needed.

```jsx
// Example: Add margin and padding
<div className="p-4 md:p-6 lg:p-8 mb-4">

// Example: Responsive text
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Example: Flexbox layout
<div className="flex gap-4 justify-center flex-wrap">
```

### Using daisyUI Components

```jsx
// Button with variants
<button className="btn btn-primary">Primary</button>
<button className="btn btn-outline">Outline</button>
<button className="btn btn-lg">Large</button>
<button className="btn btn-sm">Small</button>

// Card
<div className="card bg-base-200 shadow-lg">
  <div className="card-body">
    Content here
  </div>
</div>

// Navigation
<div className="navbar bg-base-100 shadow-lg">
  <div className="navbar-start">...</div>
  <div className="navbar-center">...</div>
  <div className="navbar-end">...</div>
</div>
```

### Responsive Breakpoints

```jsx
// Mobile first (default)
<div className="w-full">

// Tablet and up (md:)
<div className="md:w-1/2">

// Desktop and up (lg:)
<div className="lg:w-1/3">
```

---

## 🔧 Common Tasks

### Add a New Component

1. Create file: `src/components/MyComponent.tsx`
2. Write component:
```tsx
function MyComponent() {
  return (
    <div>
      {/* Your JSX here */}
    </div>
  )
}

export default MyComponent
```

3. Import in `src/App.tsx`:
```tsx
import MyComponent from './components/MyComponent'

function App() {
  return (
    <div>
      {/* ... other components ... */}
      <MyComponent />
    </div>
  )
}
```

### Change Button Color

Find the button and change the color class:
```jsx
// Before
<button className="btn btn-primary">Click me</button>

// After
<button className="btn btn-secondary">Click me</button>
// or
<button className="btn btn-accent">Click me</button>
```

### Change Text Size

Use Tailwind text classes:
```jsx
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Responsive heading
</h1>
```

### Add Spacing

```jsx
{/* Padding */}
<div className="p-4">p-4 = 1rem padding on all sides</div>

{/* Margin */}
<div className="mb-4">mb-4 = 1rem margin bottom</div>

{/* Gap between flex items */}
<div className="flex gap-4">gap-4 = 1rem gap</div>
```

---

## 📝 Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Check for lint errors
npm run lint

# Preview production build locally
npm run preview
```

---

## 🐛 Debugging

### HMR Not Working?
- Save your file manually
- Check browser console for errors
- Restart dev server: `npm run dev`

### Styles Not Applying?
- Make sure you're using valid Tailwind classes
- Check the browser dev tools (Inspect Elements)
- Try clearing browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

### Component Not Showing?
- Check that component is imported in `App.tsx`
- Verify export is correct: `export default ComponentName`
- Check console for JavaScript errors

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Build production version
npm run build

# This creates a 'dist' folder ready for deployment
```

Then upload to Vercel or connect your GitHub repository.

---

## 📚 Documentation References

- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **daisyUI**: https://daisyui.com
- **Vite**: https://vite.dev
- **TypeScript**: https://www.typescriptlang.org

---

## 💡 Tips & Best Practices

1. **Use Tailwind Classes First**
   - Don't write custom CSS unless absolutely necessary
   - Tailwind provides most utilities you need

2. **Keep Components Small**
   - Each component should do one thing well
   - Makes testing and maintenance easier

3. **Use Semantic HTML**
   - Use `<h1>`, `<h2>` for headings
   - Use `<button>` for buttons
   - Use `<a>` for links

4. **Test Responsiveness**
   - Open Chrome DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Test all breakpoints

5. **Check Accessibility**
   - Navigate with Tab key
   - Verify focus states are visible
   - Test with screen reader (optional)

---

## ❓ Troubleshooting

### Issue: Buttons look wrong
**Solution**: Make sure you're using daisyUI button classes:
```jsx
<button className="btn">Default</button>
<button className="btn btn-primary">Primary</button>
```

### Issue: Mobile menu not working
**Solution**: The dropdown is already configured. Make sure you're testing on actual mobile or using responsive mode in DevTools.

### Issue: Colors not changing with theme
**Solution**: Always use daisyUI semantic colors (primary, secondary, accent, base-*) instead of Tailwind colors (red-500, blue-400, etc.)

### Issue: Build fails
**Solution**: Check Node.js version:
```bash
node --version  # Should be 20.19+ or 22.12+
```

---

## 📞 Support Resources

- **Jam Session Project Docs**: See `README-HOMEPAGE.md`
- **Implementation Details**: See `IMPLEMENTATION-SUMMARY.md`
- **Verification Status**: See `VERIFICATION-CHECKLIST.md`
- **Original Plan**: See `plan-mainHomePage.prompt.md`

---

## Next Phase: Backend Integration

When ready to add backend features:
1. Set up NestJS server
2. Configure Socket.IO
3. Connect to PostgreSQL via Prisma
4. Implement authentication
5. Build API endpoints
6. Integrate real-time updates

---

**Last Updated**: December 6, 2025
**Status**: Production Ready ✅

