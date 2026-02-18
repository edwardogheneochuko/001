#  HAUNTED - A Scary Interactive Experience

A spine-chilling, horror-themed web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Experience a dark, atmospheric journey through nightmarish content with mind-bending animations and sinister design.

---

##  Features

### **Immersive Visual Design**
- **Dark Gradient Backgrounds:** Black-to-red gradients throughout, creating an ominous atmosphere
- **Glowing Red Effects:** Red text-shadows, box-shadows, and drop-shadows that pulse with supernatural energy
- **Atmospheric Overlays:** Ambient red glows and gradient radials that permeate every page
- **Floating Orbs:** Haunting animated particles that drift and scale mysteriously

### **Animated Interactions**
- **Framer Motion Animations:** Smooth, scary keyframe animations with infinite loops
- **Hover Effects:** Elements scale, glow, and transform when interacted with
- **Pulsing Elements:** Text and UI components throb with an eerie heartbeat
- **Flickering Overlays:** Dynamic opacity shifts creating an unsettling, flickering ambiance
- **Glitch-Like Transforms:** Scale, rotation, and letter-spacing shifts for disorienting effect

### **Multi-Page Experience**

#### **Page 1: THE ABYSS (Home)**
- Massive animated pumpkin icon with brightness pulsing
- Large "WELCOME" title with aggressive glow effects
- "Enter if you dare..." subtitle with fading opacity
- Interactive "PROCEED" button with red gradient and shadow pulse
- Warning text: "⚠ BEWARE OF WHAT LIES AHEAD ⚠"
- Floating haunting orbs in corners

#### **Page 2: THE VOID (Carousel Slides)**
- **Fanciful Carousel:** Auto-rotating slide show through 12 horror scenarios
- **Reusable Components:**
  - `SlideCard` - Displays haunted title, description, and slide counter
  - `NavigationControls` - Previous/Next buttons and Auto-play toggle
  - `SlideIndicators` - Interactive dot navigation
  - `BackgroundImage` - Darkened, saturated background with vignette
- **Interactive Features:**
  - Auto-play every 5 seconds (toggle with PAUSE/PLAY button)
  - Jump to any slide via dot indicators
  - Manual navigation with Previous/Next buttons
- **Content:** 12 scary scenarios (Pumpkin, Ghost, Spider, Skull, Haunted House, etc.)

#### **Page 3: NIGHTMARES (Additional Pages)**
- Ready for expansion with same scary aesthetic

### **Scary Navigation (Navbar)**
- **Logo:** "HAUNTED" with pulsing red glow
- **Menu Items (Spooky Labels):**
  - THE ABYSS (Home)
  - WHISPERS (Info)
  - NIGHTMARES (Designs)
  - THE VOID (001)
- **Desktop:** Sidebar with red border, gradient background, hover glow effects
- **Mobile:** Animated hamburger menu with spinning X icon, slide-in drawer
- **Effects:** Red text-shadow glows, scale transforms, corner accent dots

---

##  Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type-safe component development |
| **Tailwind CSS** | Utility-first styling with scary color palette |
| **Framer Motion** | Advanced animation library |
| **Vite** | Fast build tool and dev server |
| **Lucide React** | SVG icons (Menu, X) |
| **ESLint** | Code quality |

---

##  Project Structure

```
001/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Main navigation with scary effects
│   │   ├── Page2/
│   │   │   ├── SlideCard.tsx       # Carousel card component
│   │   │   ├── NavigationControls.tsx # Prev/Next/Play buttons
│   │   │   ├── SlideIndicators.tsx # Dot navigation
│   │   │   └── BackgroundImage.tsx # Background with vignette
│   │   └── ...
│   ├── pages/
│   │   ├── Page1.tsx               # THE ABYSS - Welcome page
│   │   ├── Page2.tsx               # THE VOID - Carousel page
│   │   ├── Page3.tsx               # NIGHTMARES - Extended page
│   │   ├── Page4.tsx               # Additional page
│   │   ├── data.js                 # Scary content data (12 items)
│   │   └── Page1.css               # Page1 styling
│   ├── assets/
│   │   ├── data.js                 # Scary content array
│   │   ├── spooky.svg              # Moon, bats, tree SVG
│   │   └── clown.jpg               # Scary clown background
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

##  Scary Color Palette

| Element | Colors |
|---------|--------|
| **Primary Text** | Red (#ff3b3b, #ff4a4a) |
| **Secondary Text** | Gray/White (#d4d4d4, #e6e6e6) |
| **Borders** | Red-900/600 (#7f1d1d) |
| **Backgrounds** | Black, Red-950 (#450a0a) |
| **Glows** | Red with opacity (rgba(239,68,68)) |
| **Overlays** | Dark gradients with red undertones |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd 001
npm install
```

### Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173` and prepare to be haunted.

### Build for Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

---

##  Key Features Explained

### **Animations**

All animations use Framer Motion with eerie keyframes:

```typescript
animate={{ opacity: [0.6, 1, 0.4, 1] }}
transition={{ duration: 3.5, repeat: Infinity }}
```

**Common Animation Patterns:**
- **Pulsing:** Opacity and scale oscillate infinitely
- **Flicker:** Rapid opacity changes create unsettling effect
- **Floating:** Y-axis and X-axis movement in smooth loops
- **Glow Pulse:** Box-shadow intensifies/fades like a heartbeat

### **Text Effects**

```typescript
textShadow: '0 0 40px rgba(239, 68, 68, 0.9), 0 0 80px rgba(0, 0, 0, 0.8)'
```

Multiple shadows create depth and supernatural appearance.

### **Hover Interactions**

```typescript
group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]
group-hover:scale-110
group-hover:translate-x-3
```

Elements intensify glows, scale up, and shift position for immersive feedback.

### **Component Reusability**

Page2 components (`SlideCard`, `NavigationControls`, etc.) are fully independent and can be reused in other carousel-style pages.

---

## 📊 Scary Content

**12 Horror Scenarios in Page2:**

1. Welcome - "Fvck around and find out!.."
2. Beware - "The ghosts are near!..Don't let them catch you!"
3. Haunted Pumpkin - "It watches you... Don't look into its eyes!"
4. Spooky Cat - "It has glowing eyes and a sinister grin!"
5. Creepy Ghost - "It floats silently through the air, whispering eerie sounds..."
6. Eerie Bat - "It flies in the night sky, its wings flapping ominously..."
7. Sinister Spider - "It spins its web in the darkest corners, waiting for its prey..."
8. Mysterious Skull - "It grins eerily in the moonlight, a symbol of death and darkness..."
9. Dark Forest - "Shadows lurk among the trees... It's a place of mystery and danger!"
10. Haunted House - "To do it is to Dare! Don't breathe... But beware of the spirits that may haunt its halls!"
11. Cursed Mirror - "It reflects your darkest fears... Don't look into it for too long..."
12. Grim Reaper - "It stands silently, waiting to claim its next victim... Don't let it catch you!"

---

## 🎬 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## 📝 Customization

### Change Scary Content
Edit `src/assets/data.js`:

```javascript
export const scaryContent = [
  {
    title: "Your Scenario",
    description: "Your terrifying description..."
  },
  // Add more...
];
```

### Modify Colors
Update Tailwind color classes in components (e.g., `text-red-500` → `text-purple-600`).

### Adjust Animation Speed
Change `duration` values in Framer Motion `transition` props:

```typescript
transition={{ duration: 2, repeat: Infinity }} // 2 seconds
```

### Add New Pages
Create new files in `src/pages/` and add to routing.

---

## 🖼️ Visual Hierarchy

| Element | Size | Priority |
|---------|------|----------|
| Page Title | 7xl-8xl | Highest - dominates viewport |
| Subtitle | 2xl-3xl | High - supporting narrative |
| Navigation | 1.5xl | Medium - always accessible |
| Body Text | 1xl-2xl | Medium - readable story |
| Buttons | 1xl | Low - interactive elements |

---

## ⚡ Performance Optimizations

- **Lazy Loading:** Framer Motion animations only play when visible
- **Smooth Transitions:** Hardware-accelerated CSS transforms
- **Optimized Assets:** SVG for icons, pre-filtered images
- **Efficient State:** Minimal re-renders with React hooks
- **Fast Build:** Vite bundling for instant dev server

---

## 🎓 Learning Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hooks](https://react.dev/reference/react/hooks)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🤝 Contributing

This is a solo horror project. Feel free to fork and create your own nightmarish variants!

---

## 📄 License

Open source - use freely for spooky creations.

---

## 🔮 Future Enhancements

- [ ] Sound effects (ambient, jump scares)
- [ ] Particle effects (blood splatter, dust)
- [ ] Glitch shader effects
- [ ] 3D perspective transforms
- [ ] Voice narration with AI
- [ ] Interactive jump scares
- [ ] Dark mode toggle (optional)
- [ ] More horror scenarios

---

**Built with  (and darkness)**

*"Enter if you dare..."*
