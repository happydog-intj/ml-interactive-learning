# ML Interactive Learning - Design System

## 🎨 Design Philosophy

**"Scientific Elegance with Kinetic Energy"**

A bold, neo-brutalist design language that merges data visualization aesthetics with modern UI patterns. The design emphasizes clarity, hierarchy, and interactive delight through:

- **Dramatic gradients** that evoke neural networks and data flow
- **Geometric precision** with sharp borders and intentional spacing
- **Kinetic motion** through purposeful animations and hover states
- **High contrast** for maximum readability on dark backgrounds

---

## 🌈 Color Palette

### Primary Colors
```css
--ml-blue: #00D9FF      /* Primary brand - electric cyan */
--ml-cyan: #00FFF5      /* Accent - bright cyan */
--ml-purple: #B84CFF    /* Secondary - vivid purple */
--ml-green: #00FF88     /* Success - neon green */
--ml-yellow: #FFE600    /* Warning - bright yellow */
--ml-orange: #FF8A00    /* Attention - vibrant orange */
--ml-red: #FF3366       /* Error - hot pink red */
```

### Background Colors
```css
--ml-bg-dark: #0A0E14       /* Main background - deep space */
--ml-bg-secondary: #151B26  /* Secondary surfaces */
--ml-bg-card: #1A2332       /* Card backgrounds */
--ml-border: #2A3C52        /* Subtle borders */
```

### Usage Guidelines
- **Gradients**: Always use multi-stop gradients (3+ colors) for visual richness
- **Text**: Use white (#FFFFFF) or gray-100 (#f3f4f6) for primary content
- **Accents**: Reserve neon colors (cyan, green, purple) for interactive elements
- **Backgrounds**: Layer different bg colors to create depth

---

## 🔤 Typography

### Font Families

**Sora** - Display & Body
- Modern, geometric sans-serif
- Used for: Headings, body text, UI labels
- Weights: 300 (Light), 400 (Regular), 600 (Semibold), 700 (Bold), 800 (Extrabold)

**JetBrains Mono** - Technical Text
- Monospace with excellent readability
- Used for: Code, technical labels, data displays
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Type Scale
```
Hero Titles:     7xl-8xl (72-96px) - Page titles
H1:              6xl-7xl (60-72px) - Chapter titles
H2:              4xl (36px) - Section headers
H3:              3xl (30px) - Subsection headers
H4:              2xl (24px) - Card titles
Body Large:      xl-2xl (20-24px) - Introductions
Body:            base-lg (16-18px) - Main content
Small:           sm-xs (12-14px) - Labels, captions
```

### Text Styles
- **Gradient Text**: Use `bg-gradient-to-r bg-clip-text text-transparent` for headings
- **High Contrast**: Always use white or near-white for body text on dark bg
- **Mono Spacing**: Use for technical terms, chapter numbers, stats

---

## 🎯 Components

### Chapter Cards
**Purpose**: Navigate to different learning modules

**Key Features**:
- 3D hover transform (translateY -8px)
- Gradient glow effect on hover
- Icon + chapter number + progress bar
- Animated gradient border

**States**:
- Default: Subtle border, dark background
- Hover: Glowing border, lifted elevation, gradient overlay
- Completed: Green accent, 100% progress
- Planned: Purple accent, 0% progress

### Navigation Bar
**Purpose**: Sticky header for chapter navigation

**Key Features**:
- Glassmorphism effect (backdrop-blur-xl)
- Progress indicator with gradient
- Animated button hover states
- Previous/Next chapter buttons

### DemoCard Component
**Purpose**: Wrap interactive visualizations

**Key Features**:
- Grid pattern overlay for technical feel
- Corner gradient decoration
- Glow effect on hover
- Icon + title + description header

### InfoCard Component
**Purpose**: Display theoretical concepts

**Variants**:
- `default`: Blue gradient - general information
- `accent`: Purple gradient - highlighted concepts
- `warning`: Yellow gradient - important notes
- `success`: Green gradient - key takeaways

**Features**:
- Vertical accent bar
- Hover gradient overlay
- Icon support
- Smooth transitions

### Section Component
**Purpose**: Organize content hierarchically

**Features**:
- Numbered badge with gradient background
- Gradient underline
- Consistent spacing

---

## ✨ Animations

### Page Load Sequence
1. **Hero fade-in** (0s delay)
2. **Stats bar slide-up** (0.1s delay)
3. **Cards stagger** (0.1s incremental delays)

### Hover Effects
- **Cards**: Transform up + glow + border color change
- **Buttons**: Gradient shift + shadow intensify
- **Icons**: Scale 110% + color change
- **Links**: Underline slide + color transition

### Background Motion
- **Floating orbs**: Infinite gradient rotation (20s cycle)
- **Grid pattern**: Static with subtle opacity
- **Gradient mesh**: Slow position shift

### Keyframe Animations
```css
gradient-shift: 8s ease infinite
float: 6s ease-in-out infinite
pulse-glow: 2s ease-in-out infinite
slide-up: 0.6s ease-out
slide-in: 0.5s ease-out
```

---

## 🌐 Background Effects

### Grid Pattern
```css
background-image:
  linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px);
background-size: 50px 50px;
```

### Floating Orbs
Three radial gradients (cyan, purple, green) that rotate and translate infinitely, creating ambient light effects.

### Custom Scrollbar
Gradient thumb with cyan-to-purple vertical gradient, rounded corners, smooth hover transition.

---

## 📐 Spacing & Layout

### Container Widths
- Default: `mx-auto px-4` (responsive padding)
- Content: `max-w-6xl` (1152px)
- Hero: `max-w-5xl` (1024px)
- Cards Grid: `max-w-7xl` (1280px)

### Spacing Scale
- Section margins: `mb-12` to `mb-16` (48-64px)
- Card padding: `p-6` to `p-8` (24-32px)
- Element gaps: `gap-3` to `gap-6` (12-24px)

### Border Radius
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-lg` (8px)
- Badges: `rounded-full` (9999px)
- Sections: `rounded-xl` (12px)

---

## 🎭 Glassmorphism

Used for navigation and overlays:
```css
backdrop-blur-xl
bg-opacity-80
border border-ml-border
```

---

## ♿ Accessibility

### Contrast Ratios
- White text on dark background: 15:1+ (WCAG AAA)
- Gradient text: Ensure sufficient luminance
- Interactive elements: Clear focus states

### Motion
- Respect `prefers-reduced-motion`
- All animations can be disabled
- Smooth scroll behavior

### Interactive States
- Focus: Visible outline with gradient
- Hover: Color/transform changes
- Active: Slight scale down

---

## 🚀 Usage Examples

### Creating a Chapter Card
```tsx
<div className="bg-ml-bg-card border border-ml-border rounded-2xl p-6
                hover:translate-y-[-8px] transition-all duration-500">
  <div className="bg-gradient-to-r from-ml-cyan to-ml-blue
                  bg-clip-text text-transparent">
    Chapter Title
  </div>
</div>
```

### Gradient Text
```tsx
<h1 className="bg-gradient-to-r from-ml-blue via-ml-purple to-ml-cyan
               bg-clip-text text-transparent">
  Animated Title
</h1>
```

### Glowing Button
```tsx
<button className="bg-gradient-to-r from-ml-blue to-ml-cyan
                   hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]
                   transition-all duration-300">
  Action
</button>
```

---

## 📱 Responsive Breakpoints

- Mobile: `< 768px` - Single column, stacked cards
- Tablet: `768px - 1024px` - 2 column grid
- Desktop: `> 1024px` - 4 column grid, full layout

---

## 🎨 Design Principles

1. **Bold over bland**: Use dramatic gradients and strong contrasts
2. **Motion with purpose**: Animations should enhance understanding
3. **Hierarchy through color**: Use gradient intensity to show importance
4. **Technical precision**: Grid patterns and monospace fonts convey seriousness
5. **Kinetic energy**: Everything feels alive and responsive

---

## 🔧 Implementation Notes

- All gradients use Tailwind's built-in gradient utilities
- Custom animations defined in tailwind.config.ts
- Components use CSS-only animations where possible
- Background effects are fixed position for performance
- z-index management: background (0), content (1), nav (50)

---

**Last Updated**: 2026-02-01
**Design Version**: 2.0
**Status**: Production Ready ✨
