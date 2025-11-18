# BBH MakerChat Design Guidelines

## Design Approach
**Selected System**: Material Design 3 with enterprise customization
**Rationale**: Information-dense financial application requiring clear data hierarchy, robust table components, and professional credibility. Material Design excels at structured data presentation while maintaining modern aesthetics.

## Core Design Principles
1. **Data Clarity First**: Every visual decision supports rapid data comprehension
2. **Professional Trust**: Enterprise-grade polish with no frivolous elements
3. **Efficient Workflows**: Minimize clicks, maximize information density
4. **Hierarchical Structure**: Clear visual relationships between components

---

## Typography System

**Primary Font**: Inter (via Google Fonts CDN)
**Secondary Font**: IBM Plex Mono (for data/numbers)

**Hierarchy**:
- Page Titles: text-2xl font-semibold (Inter)
- Section Headers: text-lg font-semibold
- Body Text: text-sm font-normal
- Captions/Metadata: text-xs font-normal
- Data/Numbers: text-sm font-mono (IBM Plex Mono)
- Chat Messages: text-sm leading-relaxed
- Query Suggestions: text-sm font-medium

**Emphasis**:
- Critical alerts: font-semibold
- Financial figures: font-mono font-medium
- Timestamps: text-xs opacity-70

---

## Layout System

**Spacing Primitives**: Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: space-y-4 to space-y-6
- Card margins: m-4
- Grid gaps: gap-4 to gap-6
- Panel padding: p-6 to p-8

**Grid Structure**:
```
Three-panel layout:
- Left Sidebar: Fixed 280px width
- Main Chat: Flexible (flex-1)
- Right Panel: Fixed 320px width (collapsible)
```

**Responsive Breakpoints**:
- Mobile (<768px): Stack vertically, hide right panel
- Tablet (768px-1024px): Show left sidebar + main only
- Desktop (>1024px): Full three-panel layout

---

## Component Library

### 1. Navigation & Headers
**Top Navigation Bar**:
- Height: h-16
- Padding: px-6
- Layout: Flex with space-between
- Left: Logo + Application Name (text-xl font-semibold)
- Right: User profile avatar (w-10 h-10 rounded-full) + notification bell + settings icon

### 2. Sidebar Components
**Conversation History**:
- Item height: min-h-16
- Padding: p-4
- Border radius: rounded-lg
- Hover state: elevated appearance
- Active state: subtle border-left indicator (border-l-4)
- Typography: Title (text-sm font-medium), timestamp (text-xs opacity-60)

**Category Headers**: 
- Text: text-xs uppercase tracking-wide font-semibold
- Margin: mt-6 mb-3
- Opacity: opacity-50

### 3. Chat Interface
**Message Bubbles**:
- User messages: max-w-2xl ml-auto, padding p-4, rounded-2xl
- AI messages: max-w-3xl mr-auto, padding p-6, rounded-2xl
- Spacing between messages: space-y-6
- Include small avatar (w-8 h-8) for AI responses

**Input Area**:
- Min height: min-h-24
- Padding: p-4
- Border radius: rounded-xl
- Fixed to bottom with shadow-lg elevation
- Send button: w-10 h-10 rounded-full (positioned absolute right-2 bottom-2)

**Typing Indicator**: Three animated dots, text-sm, padding p-2

### 4. Data Display Components
**Tables**:
- Header row: font-semibold text-xs uppercase tracking-wide
- Cell padding: px-4 py-3
- Border: border-b on rows
- Hover: subtle row highlight
- Sortable columns: add arrow indicator
- Sticky header for long tables

**Metric Cards**:
- Padding: p-6
- Border radius: rounded-xl
- Layout: Vertical stack
- Label: text-xs uppercase opacity-70
- Value: text-3xl font-semibold font-mono
- Change indicator: text-sm with colored text (no background colors)
- Grid layout: grid-cols-4 gap-4 for dashboard view

**Status Indicators**:
- Use text colors only (as per color constraint):
  - Critical: text-red-600 with filled circle icon
  - Warning: text-yellow-600 with triangle icon
  - Success: text-green-600 with checkmark icon
- Size: w-2 h-2 rounded-full for dot indicators
- Always pair with clear text label

**Charts** (using Recharts):
- Container height: h-64 to h-80
- Padding: p-4
- Axis labels: text-xs
- Legend: text-xs positioned bottom

### 5. Query Suggestions Panel
**Category Sections**:
- Margin bottom: mb-6
- Category title: text-sm font-semibold mb-3

**Suggestion Cards**:
- Padding: p-3
- Spacing: space-y-2
- Border radius: rounded-lg
- Hover: elevated cursor-pointer
- Typography: text-sm leading-snug
- Icon prefix: w-5 h-5 mr-2

### 6. Forms & Inputs
**Text Inputs**:
- Height: h-10
- Padding: px-4
- Border radius: rounded-lg
- Font size: text-sm
- Label above: text-sm font-medium mb-2

**Buttons**:
- Primary: px-6 py-2.5 rounded-lg text-sm font-medium
- Secondary: px-4 py-2 rounded-lg text-sm
- Icon-only: w-10 h-10 rounded-full
- Disabled state: opacity-50 cursor-not-allowed

### 7. Modal & Overlays
**Session Timeout Warning**:
- Max width: max-w-md
- Padding: p-8
- Border radius: rounded-2xl
- Centered with backdrop blur
- Title: text-xl font-semibold mb-4
- Timer: text-4xl font-mono text-center mb-6

**Authentication Prompts**:
- Compact: max-w-sm
- Padding: p-6
- Input spacing: space-y-4

### 8. Utility Components
**Export Dropdown**:
- Positioned absolute
- Border radius: rounded-lg
- Padding: p-2
- Item height: h-10 px-4
- Item spacing: space-y-1

**Date Filters**:
- Horizontal layout: flex gap-2
- Button size: px-4 py-2 rounded-lg text-sm
- Active state: font-semibold with subtle indicator

**Bookmarks/Favorites**:
- Icon button: w-8 h-8
- Positioned top-right of conversation items
- Star icon from Heroicons

---

## Animation Guidelines
**Minimal, purposeful animations only**:
- Typing indicator: gentle pulse
- Panel collapse/expand: 200ms ease-in-out
- Message appearance: subtle fade-in (150ms)
- Hover states: no animation, instant feedback
- Loading spinners: standard circular progress

**No scroll animations, parallax, or decorative motion**

---

## Icons
**Library**: Heroicons (outline for most, solid for emphasis)
**Usage**:
- Navigation: 24px (w-6 h-6)
- Buttons: 20px (w-5 h-5)  
- Inline with text: 16px (w-4 h-4)
- Status indicators: 12px (w-3 h-3)

---

## Images
**No hero images** - This is a functional enterprise application, not a marketing site.

**User Avatars**: 
- Profile pictures in top navigation (40px diameter)
- Small avatars in chat (32px diameter)
- Conversation history (24px diameter)
- Use initials with subtle background as fallback

**Brand Logo**:
- Top left navigation
- Height: 32px max
- Horizontal lockup with "BBH MakerChat" text

---

## Accessibility
- All interactive elements: min 44px touch target
- Form inputs: clear focus states with visible outline
- Tables: proper thead/tbody structure
- ARIA labels on icon-only buttons
- Keyboard navigation: visible focus rings
- Color indicators always paired with icons/text