# Gram Panchayat Website Design Guidelines

## Design Approach
**System-Based**: Material Design principles adapted for Indian government aesthetic, prioritizing clarity, accessibility, and trust for rural citizens with varying digital literacy levels.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 26 85% 50% (Saffron - Indian government identity)
- Secondary: 142 40% 45% (Green - growth and prosperity)
- Accent: 210 80% 50% (Blue - trust and stability)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 0 0% 15%
- Text Secondary: 0 0% 40%

**Dark Mode:**
- Primary: 26 75% 60%
- Secondary: 142 35% 55%
- Accent: 210 70% 60%
- Background: 220 15% 10%
- Surface: 220 15% 15%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**Semantic Colors:**
- Success: 142 70% 45% (certificate approved)
- Warning: 38 90% 50% (pending applications)
- Error: 0 70% 50% (rejected/issues)
- Info: 210 80% 55% (announcements)

### B. Typography
**Font Families:**
- Primary: 'Noto Sans Devanagari' for Marathi, 'Inter' for English (via Google Fonts)
- Headings: 600-700 weight
- Body: 400 weight
- Emphasis: 500 weight

**Scale:**
- H1: text-4xl (2.25rem) - Page titles
- H2: text-3xl (1.875rem) - Section headers
- H3: text-2xl (1.5rem) - Card titles
- H4: text-xl (1.25rem) - Subsections
- Body: text-base (1rem)
- Small: text-sm (0.875rem) - Helper text

### C. Layout System
**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 24 (Tailwind units)
- Container padding: px-4 md:px-8 lg:px-12
- Section spacing: py-12 md:py-16 lg:py-24
- Card padding: p-6 md:p-8
- Component gaps: gap-4 to gap-8

**Grid Structure:**
- Max container width: max-w-7xl
- Service cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Form layouts: max-w-3xl for optimal readability
- Dashboard: grid-cols-1 lg:grid-cols-4 (sidebar + content)

### D. Component Library

**Navigation:**
- Sticky header with language toggle (Marathi/English) in top-right
- Primary navigation with clear service categories
- Mobile: Hamburger menu with full-screen overlay
- Government emblem/logo prominently displayed

**Hero Section:**
- Full-width banner with village image (farmer fields, panchayat building, or rural landscape)
- Overlay: Semi-transparent dark gradient (from bottom)
- Centered heading: Village name in both languages
- Quick service shortcuts (4 primary services as cards with icons)

**Service Cards:**
- Elevated cards (shadow-md) with icon, title, brief description
- Hover: Subtle lift effect (hover:shadow-lg transition-shadow)
- Border-left accent in primary color (border-l-4)
- Clear call-to-action button at bottom

**Forms:**
- Single-column layout for clarity
- Label above input with required indicator (*)
- Input groups with icons (document upload, calendar for dates)
- Multi-step forms with progress indicator for complex applications
- File upload: Drag-and-drop zone with supported formats display
- Bilingual field labels and placeholders

**Status Tracking:**
- Timeline visualization for application progress
- Color-coded status badges (pending-yellow, approved-green, rejected-red)
- Reference number prominently displayed
- Estimated completion dates shown

**Announcements Board:**
- Card-based layout with date badge
- Priority notices highlighted with warning color
- Expandable cards for full announcement text
- Filter by category (general, tax, schemes)

**Footer:**
- Three-column layout: Services, Quick Links, Contact Information
- Government seals and certifications
- Social media links (if applicable)
- Emergency contact numbers
- Office hours and holiday information

### E. Special Considerations

**Bilingual Implementation:**
- Language toggle switch in header (Marathi | English)
- All content stored in both languages
- Consistent right-to-left UI flow for both languages
- Font size increase for Devanagari script (1.1x larger for readability)

**Accessibility for Rural Users:**
- Large touch targets (min 44px) for mobile users
- High contrast ratios (WCAG AA compliant)
- Simple, jargon-free language with visual icons
- Voice input option for forms (if technically feasible)
- Offline-first form saving capability

**Trust Indicators:**
- Government seals and authentication marks
- Secure connection badges
- Official contact verification details
- Privacy policy and data protection notices
- Helpline numbers prominently displayed

### F. Images
**Primary Hero Image**: Full-width banner showing rural village scene - fields with farmers working, panchayat building facade, or village gathering. Should evoke trust, community, and rural Indian identity.

**Service Section Icons**: Use Material Icons CDN for service categories (description, folder, receipt, announcement, etc.)

**About Page**: Photo of current Panchayat members in official meeting or village gathering (placeholder if actual photos unavailable)

**Decorative Elements**: Subtle patterns inspired by Indian folk art in backgrounds (optional, very subtle opacity)