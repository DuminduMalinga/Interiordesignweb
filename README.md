# InteriorAI — AI-Powered Interior Design Web App

An intelligent interior design platform that transforms 2D floor plans into optimized, interactive 3D room layouts using AI-driven room detection and smart furniture placement.

---

## Features

- **AI Room Detection** — Upload any 2D floor plan image and the AI instantly identifies every room, wall, door, and window.
- **Smart Furniture Placement** — An optimization engine scores hundreds of layout combinations and surfaces the best-fit arrangements.
- **Interactive 3D Viewer** — Explore optimized layouts in a real-time isometric 3D viewer with rotate, zoom, and export capabilities.
- **User Dashboard** — Manage projects, view design history, edit profile, and configure notification preferences.
- **Admin Panel** — Manage user accounts from a dedicated admin interface.
- **Dark / Light Theme** — Full theme support via a global `ThemeContext`.
- **Authentication Flow** — Sign up, sign in, and forgot-password pages with form validation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 6](https://vitejs.dev) |
| Routing | [React Router v7](https://reactrouter.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Primitives | [Radix UI](https://www.radix-ui.com) (shadcn/ui components) |
| Component Library | [MUI (Material UI) v7](https://mui.com) |
| Animation | [Motion (Framer Motion)](https://motion.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) |
| Drag & Drop | [React DnD](https://react-dnd.github.io/react-dnd/) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) + MUI Icons |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |

---

## Project Structure

```
src/
├── main.tsx                  # Application entry point
└── app/
    ├── App.tsx               # Root component
    ├── routes.ts             # React Router configuration
    ├── components/
    │   ├── figma/            # Figma-generated helper components
    │   └── ui/               # shadcn/ui component library
    ├── context/
    │   └── ThemeContext.tsx  # Global dark/light theme context
    ├── pages/
    │   ├── Welcome.tsx       # Landing / marketing page
    │   ├── SignIn.tsx        # Authentication – sign in
    │   ├── SignUp.tsx        # Authentication – sign up
    │   ├── ForgotPassword.tsx
    │   ├── Dashboard.tsx     # User dashboard (history, profile, settings)
    │   ├── UploadFloorPlan.tsx
    │   ├── Processing.tsx    # AI processing status
    │   ├── SelectRoom.tsx    # Room selection after detection
    │   ├── ViewLayouts.tsx   # AI-scored layout gallery
    │   ├── RoomView3D.tsx    # Interactive 3D room viewer
    │   └── AdminManageAccounts.tsx
    └── styles/
        ├── index.css
        ├── tailwind.css
        ├── theme.css
        └── fonts.css
```

---

## Application Routes

| Path | Page | Description |
|---|---|---|
| `/` | Welcome | Landing page with features, stats & testimonials |
| `/signup` | SignUp | New user registration |
| `/signin` | SignIn | User login |
| `/forgot-password` | ForgotPassword | Password reset flow |
| `/dashboard` | Dashboard | Project history, profile & settings |
| `/upload` | UploadFloorPlan | Upload a 2D floor plan image |
| `/processing` | Processing | AI analysis progress screen |
| `/select-room` | SelectRoom | Pick a detected room to optimize |
| `/view-layouts` | ViewLayouts | Browse AI-ranked furniture layouts |
| `/room-view-3d` | RoomView3D | Interactive isometric 3D viewer |
| `/admin/accounts` | AdminManageAccounts | Admin user management |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Interiordesignweb

# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Output is placed in the `dist/` directory and can be served by any static host.

---

## Design Source

Original Figma design: [https://www.figma.com/design/4nfXiCDREIVxzBClpAnTQN/Untitled](https://www.figma.com/design/4nfXiCDREIVxzBClpAnTQN/Untitled)

---

## License

See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for third-party attributions and licensing information.
