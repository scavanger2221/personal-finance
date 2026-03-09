# Personal Finance App - Design System Specification

## Design Philosophy

A calm, purposeful interface that respects the user's attention. No gradients, no shadows that try too hard, no AI-generated "modern" cliches. Just clean typography, thoughtful spacing, and a restrained color palette that lets the content breathe.

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#0F0F0F` | Main background |
| `--color-surface` | `#141414` | Cards, containers |
| `--color-surface-elevated` | `#1A1A1A` | Hover states, modals |
| `--color-border` | `#262626` | Subtle borders |
| `--color-border-strong` | `#333333` | Focus states, active |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#FAFAFA` | Headings, primary text |
| `--color-text-secondary` | `#A3A3A3` | Body text, descriptions |
| `--color-text-tertiary` | `#737373` | Metadata, placeholders |
| `--color-text-disabled` | `#525252` | Disabled states |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent` | `#E5E5E5` | Primary actions, focus |
| `--color-accent-hover` | `#FFFFFF` | Hover on accent |
| `--color-success` | `#22C55E` | Income, positive (muted) |
| `--color-danger` | `#EF4444` | Expense, delete (muted) |
| `--color-warning` | `#F59E0B` | Alerts, warnings |

### Color Usage Rules

- **NO gradients** - flat colors only
- **NO drop shadows** - use borders and background contrast instead
- **NO transparency overlays** - solid colors for readability
- Success/danger colors at 80% opacity for text, 100% for icons

---

## Typography

### Font Family

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 32px | 600 | 1.1 | -0.02em | Page titles |
| H1 | 24px | 600 | 1.2 | -0.01em | Section headers |
| H2 | 20px | 600 | 1.3 | 0 | Card titles |
| H3 | 16px | 600 | 1.4 | 0 | Subsection |
| Body | 14px | 400 | 1.5 | 0 | Primary text |
| Body Small | 13px | 400 | 1.5 | 0 | Secondary text |
| Caption | 12px | 500 | 1.4 | 0.01em | Labels, metadata |
| Mono | 13px | 400 | 1.4 | 0 | Numbers, amounts |

### Typography Rules

- Maximum 2 font weights per page (400, 600)
- Use tabular numbers for financial amounts
- No uppercase text (except single-word buttons)
- No letter-spacing adjustments except on display/caption

---

## Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight padding, icon gaps |
| `--space-2` | 8px | Inline elements |
| `--space-3` | 12px | Component padding |
| `--space-4` | 16px | Card padding, section gaps |
| `--space-5` | 20px | Large gaps |
| `--space-6` | 24px | Section padding |
| `--space-8` | 32px | Page padding |
| `--space-10` | 40px | Major sections |

### Layout Grid

- **Container max-width**: 1200px
- **Page padding**: 24px (mobile), 32px (tablet), 40px (desktop)
- **Card gap**: 16px
- **Content gap**: 24px

---

## Components

### Buttons

**Primary Button**
```
Background: #E5E5E5
Text: #0F0F0F
Padding: 10px 16px
Border-radius: 6px
Font: 14px, weight 500
Hover: Background #FFFFFF
Active: Background #D4D4D4
```

**Secondary Button**
```
Background: transparent
Border: 1px solid #333333
Text: #A3A3A3
Padding: 10px 16px
Border-radius: 6px
Hover: Border #525252, Text #E5E5E5
```

**Ghost Button**
```
Background: transparent
Text: #A3A3A3
Padding: 8px 12px
Hover: Background #1A1A1A
```

### Cards

```
Background: #141414
Border: 1px solid #262626
Border-radius: 8px
Padding: 20px
```

**No shadows, no gradients.** Borders provide depth.

### Inputs

```
Background: #0F0F0F
Border: 1px solid #262626
Border-radius: 6px
Padding: 10px 12px
Font: 14px
Placeholder: #525252

Focus: Border #525252
Error: Border #EF4444
```

### Tables

```
Header: #1A1A1A background, #A3A3A3 text
Row: Transparent background
Row hover: #1A1A1A
Cell padding: 12px 16px
Border: None (use spacing)
```

---

## Layout Principles

### Page Structure

1. **Header**: Sticky, minimal, 64px height
2. **Content**: Single column max 1200px, centered
3. **Sidebar**: Collapsible, 240px width, #0F0F0F background

### Whitespace

- Generous whitespace between sections (32px+)
- Tight spacing within components (8-12px)
- Never let text touch screen edges

### Visual Hierarchy

1. **Primary**: White text (#FAFAFA), larger size
2. **Secondary**: Gray text (#A3A3A3), normal size
3. **Tertiary**: Muted gray (#737373), smaller size

---

## Animation Guidelines

### Timing

- **Fast**: 150ms (micro-interactions)
- **Normal**: 200ms (standard transitions)
- **Slow**: 300ms (page transitions)

### Easing

- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Enter**: `cubic-bezier(0, 0, 0.2, 1)`
- **Exit**: `cubic-bezier(0.4, 0, 1, 1)`

### Principles

- **NO bouncy springs** - smooth, damped motion only
- **NO fade-only** - always combine with subtle transform
- **NO stagger on search** - instant results feel faster
- **Page scroll**: Smooth scroll to top on navigation

### Allowed Animations

1. **Opacity**: 0 → 1 (200ms)
2. **TranslateY**: 4px → 0 (subtle rise)
3. **Scale**: 0.98 → 1 (button press)
4. **Width/Height**: For accordions only

---

## Icons

- **Library**: Lucide React
- **Size**: 16px (inline), 20px (buttons), 24px (navigation)
- **Stroke**: 1.5px
- **Color**: Inherit from text

---

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 640px | Stack layouts, hide sidebar |
| Tablet | 640-1024px | 2-column grids |
| Desktop | > 1024px | Full layout, sidebar visible |

---

## Anti-Patterns (Avoid)

1. **Glassmorphism** - No blur, no transparency
2. **Neumorphism** - No soft shadows
3. **Gradients** - Flat colors only
4. **Borders on everything** - Use spacing
5. **All caps** - Sentence case only
6. **Centered text** - Left-align for readability
7. **Multiple shadows** - One border or none
8. **Border-radius > 8px** - Keep it subtle
9. **Animating width/height** - Use transform
10. **Infinite animations** - Motion on interaction only

---

## Implementation Priority

### Phase 1: Foundation
1. Update CSS variables
2. Change font to Inter
3. Update background colors
4. Remove all gradients

### Phase 2: Components
1. Redesign buttons
2. Redesign cards
3. Redesign inputs
4. Redesign tables

### Phase 3: Layout
1. Update page structure
2. Adjust spacing
3. Fix responsive behavior
4. Clean up animations

### Phase 4: Polish
1. Review all pages
2. Fix inconsistencies
3. Test accessibility
4. Performance audit

---

## Success Criteria

- [ ] No gradient backgrounds
- [ ] No drop shadows
- [ ] Inter font throughout
- [ ] Consistent 8px spacing
- [ ] All animations < 300ms
- [ ] WCAG 4.5:1 contrast ratio
- [ ] Mobile-first responsive
- [ ] No layout shift on load
