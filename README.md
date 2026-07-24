# Appala Nagendra Varma — Portfolio Website

A modern, animated, fully responsive personal portfolio built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Features a premium dark/light theme, an interactive AI chatbot, a dynamic project showcase, and smooth scroll-triggered animations throughout.

**Live site:** _add your deployed URL here_

---

## ✨ Features

- **Dual theme system** — polished dark mode (default) and a fully redesigned premium light mode, toggled instantly with no page reload
- **Animated hero section** — typed-text intro, floating orbit rings, animated avatar frame, and a live tech-stack icon carousel
- **Scroll-triggered animations** — fade/slide-in reveals, animated count-up statistics, and a scroll progress bar
- **Dynamic Projects Showcase** — a scalable 3-column layout (sidebar list, large image preview, project details) driven entirely by a JavaScript data array — add unlimited projects without touching layout code
  - Windowed vertical carousel (shows 4 projects at a time, cyclic navigation)
  - Mouse wheel, keyboard, and touch-swipe navigation
  - Smooth fade/slide project-switch transitions
  - Official technology brand logos per project
- **3D coverflow certificate carousel** with a "View All" expandable grid and click-to-enlarge lightbox
- **Nagendra AI** — a custom floating chatbot widget with a typing indicator, quick-reply chips, and a lazy-loaded script for performance
- **Animated education timeline**, **experience timeline**, and **achievements list**
- **Working contact form** via Formspree (no backend required)
- **Fully responsive** — custom breakpoints for desktop, tablet, and mobile, including mobile-specific layout adjustments for the chatbot and project showcase
- **Performance-conscious** — lazy-loaded chatbot script, paused off-screen animations, rAF-batched scroll handling, and GPU-layer hints scoped only to continuously animating elements

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Custom CSS3 (CSS variables for full theming, no framework) |
| Interactivity | Vanilla JavaScript (ES6+, no libraries/frameworks) |
| Icons | [Lucide Icons](https://lucide.dev), [Devicon](https://devicon.dev) |
| 3D Background | [Three.js](https://threejs.org) (r128) |
| Fonts | Space Grotesk, Inter, JetBrains Mono (Google Fonts) |
| Forms | [Formspree](https://formspree.io) |

---

## 📁 Project Structure

```
Nagendra Portfolio/
├── index.html
├── logo.png
├── favicon-heart.png / .ico / .svg
├── assets/
│   ├── images/
│   │   ├── profile.png
│   │   ├── projects/          # project preview screenshots
│   │   └── certificates/      # certificate images
│   └── resume/
│       └── Nagendra_Varma_Resume_SE.pdf
├── css/
│   └── style.css              # all styling — dark & light themes
└── js/
    ├── animations.js          # scroll reveals, stats, theme toggle, nav
    ├── background.js          # Three.js animated background
    ├── hero.js                # hero section interactions
    ├── cursor.js               # custom cursor ring/dot
    ├── projects-showcase.js   # dynamic project showcase logic
    ├── chatbot.js             # Nagendra AI chatbot (lazy-loaded)
    └── cert-lightbox.js       # certificate click-to-enlarge lightbox
```

---

## 🚀 Getting Started

No build tools or dependencies required.

1. Clone or download this repository
2. Open `index.html` directly in a browser, **or** serve it locally for the best experience (recommended, since some features behave better over `http://` than `file://`):

   ```bash
   # Using VS Code Live Server extension (recommended)
   Right-click index.html → "Open with Live Server"

   # Or using Python
   python -m http.server 5500

   # Or using Node
   npx serve .
   ```

3. Visit `http://127.0.0.1:5500` in your browser

---

## ✏️ Customization Guide

### Update personal info
Edit the relevant sections directly in `index.html` — hero text, About Me card, education, experience, achievements, and contact details.

### Add or edit a project
All project data lives in one place: `js/projects-showcase.js`, inside the `PROJECTS` array.

```js
{
  number: '05',
  name: 'Your Project Name',
  category: 'Category',
  description: 'Short description of the project.',
  highlights: ['Highlight one', 'Highlight two', 'Highlight three'],
  tech: ['Tech1', 'Tech2', 'Tech3'],
  logos: ['Tech1', 'Tech2', 'Tech3'], // must match keys in TECH_LOGOS
  icon: 'lucide-icon-name',           // used only if no image is set
  gradA: '#4f7cff',
  gradB: '#00e5ff',
  image: 'assets/images/projects/your-screenshot.png', // or null for placeholder
  demo: 'https://your-live-demo-link.com',
  github: 'https://github.com/your-username/your-repo',
  featured: false,
}
```

Just add a new object to the array — the sidebar, counter, carousel navigation, and layout all update automatically. No HTML or CSS changes needed.

### Add a certificate
Add a new `.cert-coverflow-card` / `.certs-grid2` entry in `index.html` under the Certificates section, following the existing markup pattern, and drop the image into `assets/images/certificates/`.

### Update the contact form endpoint
Replace the `action="..."` URL on the `<form id="contactForm">` in `index.html` with your own [Formspree](https://formspree.io) endpoint.

### Update the resume link
Replace the file at `assets/resume/` and update the `href` on the **View Resume** button in `index.html`.

---

## 🎨 Theming

All colors are controlled through CSS custom properties defined in `:root` (dark theme) and overridden under `body.light-preview` (light theme) in `css/style.css`. To adjust the color palette, edit the variables in these two blocks rather than individual component rules.

---

## 📱 Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `> 1240px` | Full desktop layout |
| `≤ 1240px` | Condensed navigation spacing |
| `≤ 1080px` | Projects showcase collapses to 2-column grid; carousel nav hidden |
| `≤ 820px` | Mobile navigation, stacked hero, custom cursor disabled |
| `≤ 680px` | Single-column Projects layout, stacked action buttons |
| `≤ 640px` | Full-width bottom-sheet chatbot panel |
| `≤ 560px` | Single-column grids across all sections |

---

## 📄 License

This project is personal portfolio code belonging to Appala Nagendra Varma. Feel free to reference the structure for learning purposes, but please do not redistribute the personal content, images, or resume as your own.

---

## 📬 Contact

- **Email:** nagendravarma1315@gmail.com
- **Phone:** +91 8885519886
- **LinkedIn:** [appala-nagendra-varma](https://www.linkedin.com/in/appala-nagendra-varma-25bbb9318)
- **GitHub:** [Nagendra14319](https://github.com/Nagendra14319)