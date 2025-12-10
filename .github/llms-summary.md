# llms-summary (Tailwind CSS v4.1 docs + daisyUI 5 llms.txt)

## 1. Tailwind CSS (tailwind.txt) Structured Summary

### Sections
1. Installation with Vite
2. Utility Classes & Variants (hover, focus, responsive, dark)
3. Custom Theme Configuration (@theme)
4. Arbitrary Values & Type Hints
5. Color System & Opacity Modifiers
6. Dark Mode (media vs manual .dark toggle)
7. State Variants (group, peer, has, form states)
8. Responsive Design (breakpoints, container queries, min/max/media prefixes)
9. Custom Utilities (@utility)
10. Custom Variants (@custom-variant)
11. Applying Variants in CSS (@variant nesting)
12. Layer Organization (@layer base, components)
13. Functions & Directives (--alpha(), --spacing(), @apply, @source)
14. Pseudo-elements & Pseudo-selectors (before/after/file/selection/first-letter/first-line/placeholder)
15. Media Queries & Preference Variants (motion, contrast, pointer, orientation, print, supports)
16. Summary / Conceptual Use Cases

### Key Concepts (Highlights)
- CSS‑first configuration (no tailwind.config.js in v4 for basic setups)
- Design tokens defined as CSS custom properties via @theme
- Compile-time purging: only used utilities emitted
- Arbitrary value syntax: property/value and type hints (text-(length:--my-var))
- Unified variant model: responsive, state, media, arbitrary selector variants
- Extensibility with @utility and @custom-variant without JS plugins
- Layering strategy (@layer base/components) for predictable cascade and override control
- Dark mode: automatic (prefers-color-scheme) or manual toggle using a .dark class variant defined with @custom-variant
- Functions (--alpha, --spacing) provide semantic transformations on tokens
- Arbitrary selectors & nested variants allow complex conditional styling inline

### Taxonomy
- Directives: @import, @theme, @utility, @custom-variant, @variant, @layer, @apply, @source
- Core Functions: --spacing(), --alpha(), CSS variable references (--color-*, --text-*)
- Variant Prefixes (examples): hover:, focus:, active:, disabled:, dark:, group-hover:, peer-invalid:, has-checked:, motion-reduce:, contrast-more:, pointer-coarse:, portrait:, landscape:, print:, supports-[...], responsive (sm:, md:, lg:, xl:, 3xl:), arbitrary [selector]
- Token Categories: colors (oklch palette), typography (font-display, font-body), spacing (--spacing-*), breakpoints (--breakpoint-*), animation easings (--ease-*), radii, etc.

### Extensibility Patterns
- Create utilities: @utility name { declarations }
- Parameterized utilities: pattern utility-* with --value() type extraction
- Custom variants: @custom-variant name (selector/media wrapper)
- Nesting: @variant inside normal CSS selectors for multi-state logic

### Best Practices
- Prefer semantic tokens via @theme
- Use variant stacking (hover:focus: etc.) selectively
- Keep overrides in utilities or layers; minimal custom CSS outside directives
- Use arbitrary values sparingly—reach for tokens first

---

## 2. daisyUI 5 (daisy.txt) Structured Summary

### High-Level Purpose
Component class library built on Tailwind CSS 4 providing semantic UI components, theming, and standardized class naming. Distributed as CSS via @plugin "daisyui"; emphasizes zero custom CSS, using component + modifier + Tailwind utilities for overrides.

### Core Non-Component Sections
1. Install Notes (Tailwind v4 required; @import + @plugin usage; CDN fallback)
2. Usage Rules (class categories; override strategy; ! specificity escape hatch)
3. Config (@plugin "daisyui" { themes:, root:, include:, exclude:, prefix:, logs: })
4. Semantic Color System (primary, secondary, accent, neutral, base-* + content variants, info/success/warning/error)
5. Custom Theme Definition (@plugin "daisyui/theme" block with required CSS variables: colors, radius, size, border, depth, noise)
6. Theme Rules (all variables required; semantic tokens adapt by theme; use theme generator)

### Class Category Taxonomy
- component (root required class for a UI piece)
- part (sub-element inside component)
- style (visual style variant)
- behavior (stateful style like active/disabled)
- color (semantic theme token classes)
- size (xs–xl scale)
- placement (positional alignment)
- direction (layout axis)
- modifier (structural/config change e.g. btn-block, card-side)
- variant (conditional prefix semantics like is-drawer-open: utility)

### Component Inventory (Alphabetical)
accordion, alert, avatar, badge, breadcrumbs, button (btn), calendar (cally/pika/react-day-picker), card, carousel, chat, checkbox, collapse, countdown, diff, divider, dock, drawer, dropdown, fab, fieldset, file-input, filter, footer, hero, hover-3d, hover-gallery, indicator, input, join, kbd, label / floating-label, link, list, loading, mask, menu, mockup-browser, mockup-code, mockup-phone, mockup-window, modal, navbar, pagination (join), progress, radial-progress, radio, range, rating, select, skeleton, stack, stat, status, steps, swap, tab(s), table, text-rotate, textarea, theme-controller, timeline, toast, toggle, validator.

### Representative Component Pattern
Syntax Template: <div class="component [part] {MODIFIERS} [Tailwind utilities]">…</div>
Rules: Modifiers optional unless specified; parts denote internal structure; semantic colors auto-theme; size classes scale spacing/typography; direction/placement adjust layout.

### Theming & Colors
- Use semantic color names (bg-primary, text-base-content) so themes auto-switch
- Avoid raw Tailwind palette for text to maintain contrast in dark mode
- Theme switching via data-theme attr or theme-controller form elements

### Accessibility & Interaction Highlights
- Components with interactive states rely on native inputs (accordion radio, drawer checkbox, swap checkbox) for accessibility
- Progress & radial-progress require aria attributes for screen readers
- Rating uses hidden first radio to allow clearing
- Theme changes should reflect user selection persistently (optionally store value)

### Override & Customization Strategy
1. Prefer existing modifier/size/color style classes
2. If styling gap remains, use Tailwind utilities appended (e.g. btn px-10)
3. If specificity blocks change, use ! suffix on utility (bg-red-500!) sparingly
4. Introduce prefix (prefix: daisy-) in config to avoid collisions with existing project classes
5. Exclude components via exclude: to slim bundle

### Config Control Levers
- themes list (with --default / --prefersdark flags)
- prefix for class names
- include/exclude filters
- logs toggle for dev noise

### Required Variables in Custom Theme
--color-* tokens, --radius-*, --size-*, --border, --depth, --noise (all mandatory); OKLCH recommended for perceptual color editing.

### Best Practices
- Use base-* colors predominately; primary for call-to-action
- Keep theme radius values consistent (0, .25rem, .5rem, 1rem, 2rem)
- Maintain contrast for *-content colors
- Avoid unnecessary fonts & custom CSS—lean on existing classes

---

## 3. Comparative Analysis (Tailwind vs daisyUI)

| Aspect | Tailwind v4.1 | daisyUI 5 |
|--------|---------------|-----------|
| Core Role | Utility-first atomic styling + design token engine | Pre-built semantic components & themes atop Tailwind |
| Configuration | CSS-driven via @theme/@utility/@custom-variant | @plugin block with structured theme & global options |
| Theming | Define tokens (colors, spacing, etc.) manually | Semantic color + theme switching (data-theme / theme-controller) |
| Extensibility | Create arbitrary utilities/variants | Customize via component modifiers + Tailwind utilities; define custom theme variables |
| Color Strategy | Large palette + arbitrary values | Semantic names that map to theme variables (primary, base-100, error) |
| Variant System | Responsive/media/pseudo/custom selector prefixes | Adds variant prefixes like is-drawer-open: & relies on Tailwind variants |
| Dark Mode | Media query or manual .dark variant | Provided via prefersdark theme flag & semantic colors (no dark: needed) |
| Override Path | Write custom utilities or apply classes; minimal ! usage | Use existing modifiers, then Tailwind utilities, then ! fallback |
| Bundle Size Control | Generated only for used utilities | Exclude components; theme list selection; prefix reduces collisions |
| Abstraction Level | Low-level per-property control | High-level ready components (btn, card, modal) |

### Overlap
- Both use semantic CSS custom properties for design tokens
- Variant prefix grammar interoperable (e.g. sm:btn-primary, dark:bg-base-200)
- Both encourage minimal handwritten CSS

### Differences
- Tailwind expects composition via atomic utilities; daisyUI provides composite components
- Tailwind theming is token-centric; daisyUI theming is semantic & switchable at runtime
- Daisy introduces component part naming conventions (card-body, drawer-content) lacking in Tailwind core

### Complementary Usage
- Use Tailwind for layout primitives (flex, grid, spacing, responsive structure) and fine-grained overrides
- Use daisyUI for rapid component scaffolding + theme switching
- Consolidate colors: define base palette in @theme; ensure daisyUI theme variables align (map brand color to --color-primary)
- Use prefix to avoid collisions if legacy classes exist

### Potential Pitfalls & Mitigations
- Contrast issues if mixing raw Tailwind colors with themed surfaces → Prefer semantic colors
- Specificity conflicts when stacking many modifiers + utilities → Order utilities last; only use ! when necessary
- Performance: Large component set not all used → exclude rarely used components in plugin config
- Accessibility: Some components rely on input elements; ensure name/id uniqueness & aria attributes (accordion, drawer, progress)

---

## 4. Actionable Integration Guide

### Step-by-Step
1. Install
   npm install tailwindcss @tailwindcss/vite daisyui@latest
2. Base CSS
   @import "tailwindcss";
   @plugin "daisyui" {
     themes: light --default, dark --prefersdark; /* adjust list */
     prefix: ; /* set e.g. daisy- if collisions */
     exclude: ; /* e.g. checkbox if custom */
     logs: false;
   }
3. Optional Custom Theme (add after base plugin)
   @plugin "daisyui/theme" { name: "mytheme"; default: true; prefersdark: false; color-scheme: light; /* + required vars */ }
4. Align Tokens
   Define shared tokens in Tailwind @theme (fonts, breakpoints, brand oklch values) matching daisyUI --color-primary etc.
5. Layout & Components
   Use Tailwind utilities for grid/flex/container queries; wrap content using daisyUI components (card, hero, navbar). Combine: <div class="card sm:card-horizontal p-4 gap-4">...
6. Responsive Enhancements
   Apply Tailwind breakpoint prefixes to daisy components (sm:alert-horizontal, lg:drawer-open, max-md:text-center).
7. Dark Mode Strategy
   Rely on prefersdark theme toggle (dark --prefersdark). For manual override, apply data-theme="dark" or implement theme-controller inputs.
8. Overrides
   a. Try existing style/size/modifier classes
   b. Append Tailwind utilities (btn px-10)
   c. Use ! only when unavoidable (bg-primary!); refactor with custom @utility if frequent.
9. Accessibility Checks
   - aria-live / aria-label on countdown & progress
   - Unique name attributes on radio/accordion/rating groups
   - Clear focus states (use focus:ring-* utilities) on interactive elements
10. Performance & Maintenance
    - Audit component usage; exclude unused via config
    - Avoid excessive arbitrary values; prefer tokens (text-brand-500)
    - Document allowed patterns in a short team style guide

### Recommended Conventions
- Prefer semantic color usage (bg-base-100, text-base-content) to ensure theme adaptation
- Use consistent size scale (xs–xl) across components for predictable visual rhythm
- Map brand color to primary; use accent sparingly for secondary CTAs
- Keep @layer usage restrained; let components be overridden by utility classes (cascade expectation)

### Custom Utility Examples (Optional)
@utility btn-glow { box-shadow: 0 0 .5rem var(--color-primary); }
<button class="btn btn-primary hover:btn-glow">Call to Action</button>

---

## 5. Quick Reference Cheat Sheet
- Install: @import + @plugin "daisyui"
- Theme Switch: <html data-theme="dark"> or input.theme-controller
- Semantic Colors: primary / base-* / success / error (with *-content variants)
- Override Order: component classes → modifiers → Tailwind utilities → ! (last resort)
- Add Component Part: use defined part classes (card-body, modal-box) not arbitrary names
- Add Variant Behavior: use Tailwind variant prefixes or daisyUI provided variant pseudo prefixes (is-drawer-open:)

---

## 6. Next Potential Enhancements
- Create a design tokens alignment sheet (mapping brand guidelines → Tailwind @theme vars → daisyUI theme vars)
- Automated lint rule: forbid raw palette colors where semantic alternative exists
- Starter component gallery with accessible examples (accordion, modal, drawer) tested for keyboard navigation

---

End of llms-summary.

