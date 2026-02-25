# Attendance Buddy - Complete Project Documentation

> **A mobile-first attendance calculator built with React + TypeScript, converted into a native Android app using Capacitor.**

---

## Table of Contents

1. [What is Attendance Buddy?](#1-what-is-attendance-buddy)
2. [What Problem Does It Solve?](#2-what-problem-does-it-solve)
3. [How the App Works (User Perspective)](#3-how-the-app-works-user-perspective)
4. [Technologies Used (The Tech Stack)](#4-technologies-used-the-tech-stack)
5. [Prerequisites — What You Need Installed](#5-prerequisites--what-you-need-installed)
6. [Project Folder Structure Explained](#6-project-folder-structure-explained)
7. [Every File Explained in Detail](#7-every-file-explained-in-detail)
8. [The Source Code — How It All Connects](#8-the-source-code--how-it-all-connects)
9. [Styling & Theming](#9-styling--theming)
10. [The Math Behind Attendance Calculations](#10-the-math-behind-attendance-calculations)
11. [Commands — What Each One Does](#11-commands--what-each-one-does)
12. [How to Run the App Locally (Step by Step)](#12-how-to-run-the-app-locally-step-by-step)
13. [How to Convert a Web App into an Android App](#13-how-to-convert-a-web-app-into-an-android-app)
14. [Building the APK (Step by Step)](#14-building-the-apk-step-by-step)
15. [Installing APK on Your Phone via USB](#15-installing-apk-on-your-phone-via-usb)
16. [App Icons & Splash Screens](#16-app-icons--splash-screens)
17. [Testing](#17-testing)
18. [How to Make Changes & Rebuild](#18-how-to-make-changes--rebuild)
19. [Common Errors & Fixes](#19-common-errors--fixes)
20. [Glossary of Terms](#20-glossary-of-terms)
21. [Frequently Asked Questions](#21-frequently-asked-questions)

---

## 1. What is Attendance Buddy?

**Attendance Buddy** is a mobile attendance calculator app. You enter how many classes you attended and how many total classes happened, and it tells you:

- Your current attendance percentage
- How many more classes you need to attend to reach your required percentage (e.g., 75%)
- How many classes you can still skip (bunk) without falling below the threshold
- Predictions for future attendance based on upcoming classes

It's a **web app** (runs in a browser) that has been **converted into a native Android app** (an APK file you install on your phone), so it looks and feels like a real mobile app.

---

## 2. What Problem Does It Solve?

Most colleges and universities have a **minimum attendance requirement** (usually 75%). Students often wonder:

- *"How many more classes do I need to attend?"*
- *"Can I skip tomorrow's class?"*
- *"If I attend the next 2 weeks, will I be safe?"*

This app answers all these questions instantly with accurate math.

---

## 3. How the App Works (User Perspective)

### Screen Layout

The app has a single-page layout with these sections (top to bottom):

1. **Header** — Shows "Attendance Buddy" title + a dark/light theme toggle button
2. **Progress Circle** — A big animated circle showing your current attendance %
   - 🟢 Green = Above required %
   - 🟡 Yellow = Close to threshold (within 5%)
   - 🔴 Red = Below required %
3. **Enter Attendance** — Two input fields: "Classes Attended" and "Total Classes" + Calculate button
4. **Current Status** — Shows classes needed to reach target and bunks left
5. **Prediction** — Enter future classes (as classes/days/weeks) + present/absent → see predicted attendance
6. **Settings** — Configure required %, classes per day, days per week

### Data Persistence

The app saves your settings and entered values in **localStorage** (your browser's local storage). So when you close and reopen the app, your data is still there. No server, no internet needed.

---

## 4. Technologies Used (The Tech Stack)

### What is a "Tech Stack"?

A tech stack is the collection of programming languages, frameworks, and tools used to build an application. Here's everything used in this project:

### Core Technologies

| Technology | What It Is | Why We Use It |
|---|---|---|
| **React 18** | A JavaScript library for building user interfaces | Creates the interactive UI with reusable components |
| **TypeScript** | JavaScript with types (like saying "this variable must be a number") | Catches bugs before they happen; better code quality |
| **Vite** | A super-fast build tool and development server | Makes development fast (instant hot reload) and creates optimized builds |
| **Tailwind CSS** | A utility-first CSS framework | Write styles directly in HTML classes instead of separate CSS files |
| **shadcn/ui** | Pre-built, customizable UI components | Provides beautiful, accessible components (buttons, dialogs, etc.) |
| **Capacitor** | A tool that wraps web apps into native mobile apps | Converts our web app into an Android APK |

### Supporting Libraries

| Library | Purpose |
|---|---|
| `react-router-dom` | Page navigation (handles URLs like `/`, `/settings`, etc.) |
| `@tanstack/react-query` | Server state management (data fetching/caching) |
| `lucide-react` | Beautiful icon library (Sun, Moon icons for theme toggle) |
| `sonner` | Toast notifications (small pop-up messages) |
| `recharts` | Chart library (for potential future graphs) |
| `zod` | Data validation (ensures data shapes are correct) |
| `react-hook-form` | Form handling library |
| `class-variance-authority` | Utility for creating variant-based component styles |
| `clsx` | Utility for conditionally joining CSS class names |
| `tailwind-merge` | Merges Tailwind classes without conflicts |
| `tailwindcss-animate` | Animation utilities for Tailwind |
| `next-themes` | Theme management (dark/light mode) |
| `date-fns` | Date utility library |
| `vaul` | Drawer component for mobile |
| `cmdk` | Command menu component |
| `embla-carousel-react` | Carousel/slider component |

### Development Tools

| Tool | Purpose |
|---|---|
| `eslint` | Finds and fixes code quality issues |
| `vitest` | Fast testing framework (runs your tests) |
| `@testing-library/react` | Utilities for testing React components |
| `jsdom` | Simulates a browser environment for tests |
| `autoprefixer` | Adds browser-specific CSS prefixes automatically |
| `postcss` | CSS processing pipeline |

---

## 5. Prerequisites — What You Need Installed

Before working with this project, you need these tools on your computer:

### 1. Node.js (Required)

**What:** A JavaScript runtime that lets you run JavaScript outside a browser.
**Why:** All our tools (Vite, React, npm) run on Node.js.
**Install:** Download from [nodejs.org](https://nodejs.org/) (LTS version recommended).
**Verify:** Run `node --version` in terminal. You should see something like `v20.x.x` or higher.

### 2. npm (Comes with Node.js)

**What:** Node Package Manager — downloads and manages code libraries.
**Why:** Installs all the project dependencies (React, Tailwind, etc.).
**Verify:** Run `npm --version` in terminal.

### 3. Java Development Kit (JDK) 21 (Required for Android builds)

**What:** Java is the language Android apps are compiled with. JDK is the development toolkit.
**Why:** The Android build system (Gradle) needs Java to compile the app.
**Install:** Download [Eclipse Temurin JDK 21](https://adoptium.net/).
**Verify:** Run `java -version` in terminal. Must show version 21.x.x.

> **Important:** Set the `JAVA_HOME` environment variable to your JDK 21 installation path.
> Example: `C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot`

### 4. Android SDK (Required for Android builds)

**What:** The Software Development Kit for Android — contains tools to build Android apps.
**Why:** Compiles the native Android project and creates the APK.
**Install:** The easiest way is to install [Android Studio](https://developer.android.com/studio), which includes the SDK. Or install just the command-line tools.
**Required components:**
- Android SDK Platform 34 or 36
- Android SDK Build-Tools 34.0.0 or 35.0.0
- Android SDK Platform-Tools (includes `adb`)

> Set the `ANDROID_HOME` environment variable to your SDK path.
> Example: `C:\android` or `C:\Users\YourName\AppData\Local\Android\Sdk`

### 5. ADB — Android Debug Bridge (Comes with Android SDK)

**What:** A command-line tool to communicate with Android devices.
**Why:** Installs the APK on your phone via USB.
**Location:** Inside `<ANDROID_HOME>/platform-tools/adb.exe`
**Verify:** Run `adb devices` in terminal.

### 6. USB Debugging on Your Phone

**How to enable:**
1. Go to **Settings → About Phone**
2. Tap **Build Number** 7 times (this unlocks Developer Options)
3. Go back to **Settings → Developer Options**
4. Enable **USB Debugging**
5. Connect phone via USB cable
6. When prompted on phone, tap **"Allow USB Debugging"**

### 7. A Code Editor (Recommended: VS Code)

**What:** A text editor for writing code.
**Install:** Download [VS Code](https://code.visualstudio.com/).

---

## 6. Project Folder Structure Explained

Here's every folder and what it contains:

```
attendance-buddy/
│
├── 📄 package.json            ← Project metadata + dependencies list
├── 📄 package-lock.json       ← Exact locked versions of all dependencies
├── 📄 bun.lockb               ← Lock file for Bun package manager (alternative to npm)
├── 📄 index.html              ← The single HTML page (entry point for the browser)
├── 📄 vite.config.ts          ← Vite build tool configuration
├── 📄 vitest.config.ts        ← Test runner configuration
├── 📄 tailwind.config.ts      ← Tailwind CSS configuration (colors, spacing, etc.)
├── 📄 postcss.config.js       ← PostCSS plugins (processes CSS)
├── 📄 tsconfig.json           ← TypeScript configuration (main)
├── 📄 tsconfig.app.json       ← TypeScript config for the app source code
├── 📄 tsconfig.node.json      ← TypeScript config for Node.js scripts
├── 📄 eslint.config.js        ← ESLint code quality rules
├── 📄 components.json         ← shadcn/ui component configuration
├── 📄 capacitor.config.json   ← Capacitor configuration (Android app settings)
├── 📄 README.md               ← Project overview
│
├── 📁 public/                 ← Static files (served as-is, not processed)
│   ├── logo.svg               ← App logo (SVG format)
│   └── robots.txt             ← Tells search engines what to index
│
├── 📁 src/                    ← All source code lives here
│   ├── main.tsx               ← Entry point — renders the React app
│   ├── App.tsx                ← Root component — sets up routing + providers
│   ├── App.css                ← App-level CSS (minimal)
│   ├── index.css              ← Global CSS + Tailwind + theme variables
│   ├── vite-env.d.ts          ← TypeScript declarations for Vite
│   │
│   ├── 📁 pages/              ← Full-page components (one per route/URL)
│   │   ├── Index.tsx           ← Home page — the main calculator page
│   │   └── NotFound.tsx        ← 404 error page
│   │
│   ├── 📁 components/         ← Reusable UI building blocks
│   │   ├── ProgressCircle.tsx  ← Animated circular progress indicator
│   │   ├── DailyInputCard.tsx  ← Input form for classes attended/total
│   │   ├── ResultCard.tsx      ← Shows calculation results
│   │   ├── PredictionCard.tsx  ← Future attendance prediction form + results
│   │   ├── SettingsCard.tsx    ← Settings form (required %, classes/day, etc.)
│   │   ├── ThemeToggle.tsx     ← Dark/Light mode toggle button
│   │   ├── NavLink.tsx         ← Navigation link component
│   │   └── 📁 ui/             ← shadcn/ui pre-built components (50+ files)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       └── ... (many more)
│   │
│   ├── 📁 hooks/              ← Custom React hooks (reusable logic)
│   │   ├── useAttendance.ts    ← Core attendance calculation logic
│   │   ├── use-mobile.tsx      ← Detects mobile screen size
│   │   └── use-toast.ts       ← Toast notification hook
│   │
│   ├── 📁 lib/                ← Utility functions
│   │   └── utils.ts            ← CSS class merging utility (cn function)
│   │
│   └── 📁 test/               ← Test files
│       ├── setup.ts            ← Test environment setup
│       └── example.test.ts     ← Example test
│
├── 📁 dist/                   ← Built output (generated by `npm run build`)
│   ├── index.html              ← Optimized HTML
│   └── assets/                 ← Bundled JS + CSS files
│
├── 📁 android/                ← Native Android project (generated by Capacitor)
│   ├── app/                    ← The Android app module
│   │   ├── build.gradle        ← Android build configuration
│   │   └── src/main/
│   │       ├── assets/public/  ← Your web app files copied here
│   │       ├── res/            ← Android resources (icons, splash screens)
│   │       │   ├── mipmap-*/   ← App launcher icons at different sizes
│   │       │   ├── drawable-*/ ← Splash screen images
│   │       │   └── values/     ← String resources, colors
│   │       └── java/           ← Java source files for Android
│   ├── build.gradle            ← Root Gradle build file
│   ├── gradlew / gradlew.bat   ← Gradle wrapper scripts
│   ├── variables.gradle        ← SDK version variables
│   └── settings.gradle         ← Gradle project settings
│
└── 📁 node_modules/           ← Downloaded dependencies (DO NOT edit or commit)
```

---

## 7. Every File Explained in Detail

### Root Configuration Files

#### `package.json`
The **identity card** of the project. Contains:
- **name**: Project name (`attendance-buddy`)
- **version**: Current version (`0.0.0`)
- **scripts**: Shortcut commands you can run (like `npm run dev`)
- **dependencies**: Libraries needed to RUN the app
- **devDependencies**: Libraries needed only during DEVELOPMENT (testing, linting, type checking)

```json
"scripts": {
    "dev": "vite",          // Start development server
    "build": "vite build",  // Create production build
    "lint": "eslint .",     // Check code quality
    "test": "vitest run",   // Run tests once
    "test:watch": "vitest"  // Run tests in watch mode
}
```

#### `package-lock.json`
An auto-generated file that locks every dependency to an exact version. This ensures everyone working on the project uses the exact same versions. **Never edit this file manually** — it updates when you run `npm install`.

#### `index.html`
The single HTML file for the entire app. This is a **Single Page Application (SPA)** — there's only one HTML file, and JavaScript dynamically changes what you see on screen.

Key parts:
```html
<div id="root"></div>                           <!-- React renders everything inside this -->
<script type="module" src="/src/main.tsx"></script>  <!-- Loads the React app -->
```

The `<head>` section contains:
- **Meta tags**: Information about the app (title, description, author)
- **Open Graph tags**: How the app appears when shared on social media
- **Favicon link**: The small icon in the browser tab (`logo.svg`)

#### `vite.config.ts`
Configures the **Vite** build tool:
```typescript
server: {
    host: "::",      // Listen on all network interfaces (accessible from other devices)
    port: 8080,      // Run dev server on port 8080
    hmr: { overlay: false }  // Don't show error overlay on screen
},
plugins: [react()],  // Enable React support (JSX, fast refresh)
resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }  // "@/components" = "src/components"
}
```

The `@` alias means you can write `import X from "@/components/Button"` instead of `import X from "../../components/Button"`. Much cleaner!

#### `tailwind.config.ts`
Configures **Tailwind CSS**:
- **darkMode: ["class"]**: Dark mode is toggled by adding/removing a `dark` class on `<html>`
- **content**: Tells Tailwind which files to scan for class names
- **theme.extend**: Customizes colors, border radius, and animations
- All colors use **CSS variables** (like `hsl(var(--primary))`) so they can change with themes

#### `tsconfig.json` / `tsconfig.app.json`
Configures **TypeScript** — tells the compiler:
- What JavaScript version to target (`ES2020`)
- Where to find files (`src/`)
- Path aliases (`@/* → src/*`)
- How strict to be about type checking

#### `capacitor.config.json`
Configures **Capacitor** (the web-to-native bridge):
```json
{
    "appId": "com.attendancebuddy.app",  // Unique app identifier (like a package name)
    "appName": "Attendance Buddy",        // Name shown on phone
    "webDir": "dist"                      // Folder containing built web files
}
```

- **appId**: Must be in reverse domain format (e.g., `com.yourname.appname`). This uniquely identifies your app on the Play Store and on the device.
- **webDir**: Points to the `dist/` folder created by `npm run build`.

#### `postcss.config.js`
Configures **PostCSS**, a tool that transforms CSS:
- **tailwindcss plugin**: Processes Tailwind's `@tailwind` directives and utility classes
- **autoprefixer plugin**: Adds vendor prefixes for cross-browser compatibility (e.g., `-webkit-`, `-moz-`)

#### `eslint.config.js`
Configures **ESLint**, a code quality checker that warns you about:
- Unused variables
- Missing dependencies in React hooks
- Potential bugs and bad patterns

#### `vitest.config.ts`
Configures **Vitest**, the test runner:
- **environment: "jsdom"**: Simulates a browser in Node.js for testing
- **globals: true**: Makes `describe`, `it`, `expect` available without importing
- **setupFiles**: Runs setup code before tests

#### `components.json`
Configuration for **shadcn/ui** — tells the CLI tool where to put components, which style to use, and path aliases.

---

## 8. The Source Code — How It All Connects

### The Flow: From Browser to Screen

```
Browser loads index.html
    → index.html loads src/main.tsx
        → main.tsx renders <App /> into the #root div
            → App.tsx sets up providers + routing
                → Route "/" renders pages/Index.tsx
                    → Index.tsx uses the useAttendance hook
                    → Index.tsx renders all the UI components
```

### `src/main.tsx` — The Entry Point

```tsx
createRoot(document.getElementById("root")!).render(<App />);
```

This single line:
1. Finds the `<div id="root">` in index.html
2. Creates a React root
3. Renders the `<App />` component inside it

The `!` after `getElementById("root")` is TypeScript's **non-null assertion** — it tells TypeScript "trust me, this element exists."

### `src/App.tsx` — The Root Component

Sets up the application "wrapping layers":

```
QueryClientProvider      ← Provides data fetching/caching to the entire app
  └── TooltipProvider    ← Enables tooltip functionality
      ├── Toaster        ← Renders toast notifications (top layer)
      ├── Sonner         ← Alternative toast system
      └── BrowserRouter  ← Enables client-side URL routing
          └── Routes
              ├── Route "/" → Index page
              └── Route "*" → 404 NotFound page
```

**Why so many wrappers?** Each "Provider" makes a feature available to all components inside it. It's like plugging in electricity — you put the power strip at the top, and everything below has access to power.

### `src/pages/Index.tsx` — The Main Page

This is the heart of the app. It:
1. Calls the `useAttendance()` custom hook to get all calculation logic
2. Manages local state for input fields (`present`, `total`)
3. Renders all UI components in order

### `src/hooks/useAttendance.ts` — The Brain

This is a **Custom React Hook** — a reusable piece of logic. It contains ALL the attendance math:

**State it manages:**
- `state`: Settings (required %, classes/day, days/week) + counts
- `result`: Calculation results (percentage, classes needed, bunks left)
- `prediction`: Future prediction results
- `error`: Error messages

**Functions it provides:**
- `updateSettings()`: Changes a setting value
- `calculateAttendance()`: Computes current attendance from present/total
- `calculatePrediction()`: Computes future attendance after N more classes

**Data persistence:**
- On every state change, it saves to `localStorage`
- On app load, it reads from `localStorage`

### Component Files

#### `ProgressCircle.tsx`
An **SVG-based** animated circle that visually shows attendance percentage:
- Uses `<svg>` with two `<circle>` elements (background track + colored progress)
- Animates smoothly using `requestAnimationFrame` (same tech used in video games)
- Changes color based on how close you are to the threshold

#### `DailyInputCard.tsx`
A simple form with two number inputs and a Calculate button. When you tap Calculate, it calls `onCalculate(present, total)` which triggers the attendance calculation.

#### `ResultCard.tsx`
Displays the calculation results in a card:
- Current percentage (big number)
- Classes needed (with conversion to days and weeks)
- Bunks left (with conversion to days and weeks)

#### `PredictionCard.tsx`
A more complex form that lets you ask "what if?" questions:
- Enter a number of classes/days/weeks
- Choose present or absent
- See what your attendance would be

#### `SettingsCard.tsx`
Three input fields to configure:
- Required attendance percentage (default: 75%)
- Classes per day (default: 5)
- Days per week (default: 6)

#### `ThemeToggle.tsx`
A button that toggles between dark and light themes:
- Adds/removes the `dark` class on `<html>`
- Saves preference to `localStorage`
- Shows Sun icon in dark mode, Moon icon in light mode

### The `ui/` Folder

Contains **50+ pre-built UI components** from [shadcn/ui](https://ui.shadcn.com/). These are NOT installed from npm — they're actual source files copied into your project so you can customize them. Examples:
- `button.tsx` — Styled button with variants (default, destructive, outline, etc.)
- `card.tsx` — Container with header, content, footer
- `dialog.tsx` — Modal popup
- `toast.tsx` — Notification popups
- `input.tsx` — Styled text input

### `src/lib/utils.ts`

Contains the `cn()` utility function:
```typescript
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

This combines:
1. `clsx`: Joins class names, handles conditionals (`cn("base", isActive && "active")`)
2. `twMerge`: Resolves Tailwind conflicts (`cn("p-4", "p-2")` → `"p-2"`, not `"p-4 p-2"`)

---

## 9. Styling & Theming

### How Tailwind CSS Works

Instead of writing CSS in separate files like:
```css
.button { background-color: blue; padding: 8px 16px; border-radius: 12px; }
```

You write utility classes directly in HTML/JSX:
```html
<button className="bg-blue-500 px-4 py-2 rounded-xl">Click</button>
```

Each class does ONE thing:
- `bg-blue-500` → blue background
- `px-4` → horizontal padding of 1rem (16px)
- `py-2` → vertical padding of 0.5rem (8px)
- `rounded-xl` → extra-large border radius

### CSS Variables for Theming

The app uses **CSS custom properties** (variables) defined in `src/index.css`:

```css
:root {
    --background: 230 25% 96%;     /* Light mode: light grey */
    --primary: 250 70% 55%;        /* Purple/indigo */
}

.dark {
    --background: 230 25% 8%;      /* Dark mode: very dark */
    --primary: 250 70% 60%;        /* Slightly brighter purple */
}
```

These variables are referenced in `tailwind.config.ts`:
```typescript
background: "hsl(var(--background))"
```

When the `dark` class is toggled on `<html>`, all the variable values change, and the entire app re-colors instantly!

### The Glass Card Effect

```css
.glass-card {
    @apply rounded-2xl border border-border/50 bg-card/70 backdrop-blur-md shadow-sm;
}
```

This creates a **glassmorphism** effect — semi-transparent cards with a blur behind them.

### Font

The app uses **Nunito** font (imported from Google Fonts):
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
```

Nunito is a rounded, friendly sans-serif font that looks great on mobile.

---

## 10. The Math Behind Attendance Calculations

### Formula 1: Attendance Percentage
```
attendancePercentage = (classesAttended / totalClasses) × 100
```

Example: You attended 45 out of 60 classes → `(45/60) × 100 = 75%`

### Formula 2: Classes Needed to Reach Target
```
classesNeeded = ((R/100) × T - P) / (1 - R/100)
```

Where:
- `R` = Required percentage (e.g., 75)
- `T` = Total classes so far
- `P` = Classes attended so far

If the result is negative or zero, you already meet the requirement.
The result is rounded UP (ceiling) because you can't attend half a class.

**Derivation:** If you attend `N` more classes:
- New present = `P + N`
- New total = `T + N`
- We want: `(P + N) / (T + N) ≥ R/100`
- Solving for N: `N ≥ (R×T/100 - P) / (1 - R/100)`

### Formula 3: Bunks (Skips) Left
```
bunksLeft = (P / (R/100)) - T
```

This tells you how many classes you can MISS and still have attendance ≥ R%.
The result is rounded DOWN (floor) because skipping one more would drop you below.

### Formula 4 & 5: Converting Classes ↔ Days ↔ Weeks
```
days = classes / classesPerDay
weeks = days / daysPerWeek
```

Example: 15 classes needed, 5 classes/day, 6 days/week → 3 days → 0.5 weeks

### Prediction Logic

When predicting future attendance:
- If **present** for N more classes: `newPresent = P + N`, `newTotal = T + N`
- If **absent** for N more classes: `newPresent = P`, `newTotal = T + N`

Then apply Formula 1, 2, and 3 with the new values.

---

## 11. Commands — What Each One Does

### npm Commands

| Command | What It Does |
|---|---|
| `npm install` | Downloads all dependencies listed in `package.json` into `node_modules/` |
| `npm run dev` | Starts a local development server at `http://localhost:8080` with hot reload |
| `npm run build` | Creates an optimized production build in the `dist/` folder |
| `npm run preview` | Serves the production build locally for testing |
| `npm run lint` | Runs ESLint to check for code quality issues |
| `npm run test` | Runs all test files once |
| `npm run test:watch` | Runs tests and re-runs on file changes |

### Capacitor Commands

| Command | What It Does |
|---|---|
| `npx cap add android` | Creates the `android/` folder with a native Android project |
| `npx cap sync android` | Copies built web files (`dist/`) into the Android project + updates plugins |
| `npx cap open android` | Opens the Android project in Android Studio |
| `npx cap copy android` | Only copies web assets (without updating plugins) |
| `npx cap update android` | Only updates native plugins (without copying web files) |

### Gradle Commands (Inside `android/` folder)

| Command | What It Does |
|---|---|
| `.\gradlew.bat assembleDebug` | Builds a debug APK (for testing, not for Play Store) |
| `.\gradlew.bat assembleRelease` | Builds a release APK (for Play Store, needs signing) |
| `.\gradlew.bat clean` | Deletes all build outputs |
| `.\gradlew.bat tasks` | Lists all available Gradle tasks |

### ADB Commands

| Command | What It Does |
|---|---|
| `adb devices` | Lists all connected Android devices |
| `adb install path/to/app.apk` | Installs an APK on the connected device |
| `adb install -r path/to/app.apk` | Reinstalls (updates) an APK |
| `adb uninstall com.attendancebuddy.app` | Uninstalls the app from the device |
| `adb logcat` | Shows real-time logs from the device (useful for debugging) |

### Environment Variables

| Variable | Purpose | Example Value |
|---|---|---|
| `JAVA_HOME` | Points to JDK installation | `C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot` |
| `ANDROID_HOME` | Points to Android SDK | `C:\android` |
| `ANDROID_SDK_ROOT` | Same as ANDROID_HOME (legacy) | `C:\android` |

---

## 12. How to Run the App Locally (Step by Step)

### Step 1: Open a Terminal
- In VS Code: `Ctrl + `` (backtick)
- Or open PowerShell / Command Prompt

### Step 2: Navigate to the Project
```bash
cd C:\Users\marip\Downloads\attendance-buddy
```

### Step 3: Install Dependencies
```bash
npm install
```
This reads `package.json`, downloads all listed packages, and puts them in `node_modules/`.

### Step 4: Start the Development Server
```bash
npm run dev
```

You'll see output like:
```
VITE v5.4.19  ready in 500ms
➜  Local:   http://localhost:8080/
➜  Network: http://192.168.1.5:8080/
```

### Step 5: Open in Browser
Go to `http://localhost:8080/` in your browser. You'll see the app!

### What is "Hot Module Replacement" (HMR)?
When you edit and save a file while the dev server is running, the changes appear **instantly** in the browser WITHOUT a full page reload. This is HMR — Vite injects only the changed code.

---

## 13. How to Convert a Web App into an Android App

### What is Capacitor?

**Capacitor** is an open-source tool by Ionic that lets you take any web application and wrap it inside a native mobile container. Think of it like putting a website inside a native app shell.

```
┌─────────────────────────────┐
│  Native Android App Shell   │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   Your Web App        │  │
│  │   (HTML/CSS/JS)       │  │
│  │   running in          │  │
│  │   a WebView           │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  Native APIs accessible     │
│  (Camera, GPS, Storage)     │
└─────────────────────────────┘
```

A **WebView** is a browser component embedded inside a native app. It renders your HTML/CSS/JS just like Chrome would, but without the browser's address bar and navigation buttons.

### The Process

1. **Build your web app** → Creates static files (HTML, CSS, JS) in `dist/`
2. **Add Android platform** → Capacitor generates a native Android project
3. **Sync** → Copies your web files into the Android project
4. **Build** → Gradle compiles the Android project into an APK

### What is an APK?

**APK** stands for **Android Package Kit**. It's a single file (like a `.zip`) that contains everything needed to install an app on Android:
- The compiled code
- Resources (images, layouts)
- Manifest (app permissions, name, icon)
- Your web files (in the assets folder)

### What is Gradle?

**Gradle** is the build system used by Android. It's like `npm` for Android:
- Downloads Java dependencies
- Compiles Java/Kotlin code
- Packages everything into an APK
- Handles different build variants (debug vs release)

The **Gradle Wrapper** (`gradlew` / `gradlew.bat`) is a script that downloads and runs the correct Gradle version automatically, so everyone uses the same version.

---

## 14. Building the APK (Step by Step)

### Step 1: Build the Web App
```bash
cd C:\Users\marip\Downloads\attendance-buddy
npm run build
```

This creates the `dist/` folder with optimized files:
- `dist/index.html` — Minified HTML
- `dist/assets/index-XXXXX.js` — All JavaScript bundled + minified
- `dist/assets/index-XXXXX.css` — All CSS bundled + minified

### Step 2: Install Capacitor Android
```bash
npm install @capacitor/android
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

This creates the entire `android/` folder with a complete Android Studio project.

### Step 4: Sync Web Files
```bash
npx cap sync android
```

This copies `dist/` files into `android/app/src/main/assets/public/` and updates native plugins.

### Step 5: Set Environment Variables
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
$env:ANDROID_HOME = "C:\android"
$env:ANDROID_SDK_ROOT = "C:\android"
```

### Step 6: Build the Debug APK
```bash
cd android
.\gradlew.bat assembleDebug
```

This takes 30-60 seconds. When you see `BUILD SUCCESSFUL`, the APK is at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 7: Install on Phone
```bash
C:\android\platform-tools\adb.exe install ..\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 15. Installing APK on Your Phone via USB

### Prerequisites
1. Phone connected via USB cable
2. USB Debugging enabled on phone (see Section 5)
3. Phone unlocked and trust prompt accepted

### Check Connection
```bash
adb devices
```

You should see:
```
List of devices attached
XXXXXXXXXX    device
```

If it says `unauthorized`, check your phone — there should be a prompt asking "Allow USB debugging?"

### Install the APK
```bash
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

Output:
```
Performing Streamed Install
Success
```

### If App is Already Installed (Update)
```bash
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

The `-r` flag means "replace" — it updates the existing app without uninstalling first.

### Find the App
After installation, go to your phone's app drawer. You'll see **"Attendance Buddy"** with the purple clipboard icon. Tap it to open!

---

## 16. App Icons & Splash Screens

### Android Icon System

Android uses different icon sizes for different screen densities:

| Density | Short Name | Pixels (Launcher) | Pixels (Foreground) | DPI |
|---|---|---|---|---|
| Medium | mdpi | 48×48 | 108×108 | ~160 |
| High | hdpi | 72×72 | 162×162 | ~240 |
| Extra High | xhdpi | 96×96 | 216×216 | ~320 |
| Extra Extra High | xxhdpi | 144×144 | 324×324 | ~480 |
| Extra Extra Extra High | xxxhdpi | 192×192 | 432×432 | ~640 |

The icons live in `android/app/src/main/res/mipmap-*/`:
- `ic_launcher.png` — Standard launcher icon
- `ic_launcher_round.png` — Round launcher icon (some launchers use this)
- `ic_launcher_foreground.png` — Foreground layer for adaptive icons

### Adaptive Icons (Android 8+)

Modern Android uses **adaptive icons** with two layers:
1. **Background layer** — A solid color (defined in `ic_launcher_background.xml` — our color is `#6366F1`, indigo/purple)
2. **Foreground layer** — The actual icon image (our clipboard with checkmarks)

The launcher can then apply different shapes (circle, squircle, rounded square) depending on the device.

### Splash Screens

Splash screens are the images shown briefly when the app launches. They live in `drawable-*` folders with different sizes for portrait and landscape orientations.

Our splash screens have the app logo centered on an indigo (`#6366F1`) background.

### The Logo Design

The app logo is an SVG (Scalable Vector Graphics) file at `public/logo.svg`. It features:
- A rounded purple/indigo gradient square as background
- A white clipboard shape
- Green checkmarks (✓) for attended classes
- Red X marks for missed classes

---

## 17. Testing

### What is Testing?

Testing is writing code that checks if your other code works correctly. If you change something and a test fails, you know you broke something.

### Testing Setup

| File | Purpose |
|---|---|
| `vitest.config.ts` | Configures Vitest test runner |
| `src/test/setup.ts` | Runs before all tests (sets up `matchMedia` mock) |
| `src/test/example.test.ts` | An example test file |

### Running Tests

```bash
npm run test        # Run all tests once
npm run test:watch  # Run tests, re-run on file changes
```

### Test Environment

Tests run in **jsdom** — a JavaScript simulation of a browser's DOM. This means you can test React components without an actual browser.

The setup file mocks `window.matchMedia` because jsdom doesn't implement it, but some components need it.

---

## 18. How to Make Changes & Rebuild

### Workflow

1. **Edit source files** in `src/`
2. **Test locally**: `npm run dev` (see changes instantly)
3. **Build web app**: `npm run build`
4. **Sync to Android**: `npx cap sync android`
5. **Build APK**: `cd android && .\gradlew.bat assembleDebug`
6. **Install**: `adb install -r app\build\outputs\apk\debug\app-debug.apk`

### Quick Rebuild Script

You can run all steps at once:

```powershell
cd C:\Users\marip\Downloads\attendance-buddy
npm run build
npx cap sync android
cd android
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
$env:ANDROID_HOME = "C:\android"
.\gradlew.bat assembleDebug
cd ..
C:\android\platform-tools\adb.exe install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### Changing the App Icon

1. Replace `public/logo.svg` with your new SVG icon
2. Run the icon generation script (uses `sharp` library):
   ```bash
   npm install sharp --save-dev
   node generate-icons.cjs
   npm uninstall sharp --save-dev
   ```
3. Rebuild the APK

### Changing Colors

Edit `src/index.css` — change the HSL values in `:root` (light) and `.dark` (dark mode) sections.

### Changing the App Name

Update in THREE places:
1. `capacitor.config.json` → `appName`
2. `index.html` → `<title>` tag
3. `src/pages/Index.tsx` → the `<h1>` element

Then rebuild.

---

## 19. Common Errors & Fixes

### Error: `invalid source release: 21`
**Cause:** JAVA_HOME points to an older JDK (e.g., JDK 17) but the project needs JDK 21.
**Fix:** Set JAVA_HOME to JDK 21:
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
```

### Error: `ANDROID_HOME not set`
**Fix:** Set the environment variable:
```powershell
$env:ANDROID_HOME = "C:\android"
```

### Error: `No devices found` (adb)
**Fix:**
1. Check USB cable
2. Enable USB Debugging on phone
3. Tap "Allow" on the phone prompt
4. Try `adb kill-server` then `adb start-server`

### Error: `INSTALL_FAILED_ALREADY_EXISTS`
**Fix:** Use `-r` flag to replace: `adb install -r app-debug.apk`

### Error: `npm run build` fails
**Fix:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try `npm run build` again

### Error: `gradlew.bat` is not recognized
**Fix:** Make sure you're in the `android/` directory, not the project root.

---

## 20. Glossary of Terms

| Term | Meaning |
|---|---|
| **API** | Application Programming Interface — a way for software to talk to other software |
| **APK** | Android Package Kit — the file format for Android apps |
| **Build** | The process of converting source code into a runnable application |
| **Bundle** | Multiple files combined into one (for efficiency) |
| **CLI** | Command Line Interface — text-based interface for running commands |
| **Component** | A reusable piece of UI (like a button, card, or form) |
| **CSS** | Cascading Style Sheets — defines how HTML elements look |
| **Debug build** | A development version of the app with extra logging and no optimization |
| **Dependency** | A library/package that your project needs to work |
| **DOM** | Document Object Model — the tree structure of HTML elements |
| **ESLint** | A tool that analyzes code for potential errors and style issues |
| **Gradle** | The build system used for Android projects |
| **HMR** | Hot Module Replacement — instant update without full reload |
| **Hook** | A React function that lets you use state and other features in components |
| **HSL** | Hue, Saturation, Lightness — a way to define colors |
| **HTML** | HyperText Markup Language — the structure of web pages |
| **JavaScript** | The programming language of the web |
| **JSX/TSX** | JavaScript/TypeScript with HTML-like syntax (used in React) |
| **localStorage** | Browser storage that persists even after closing the tab |
| **Minification** | Removing unnecessary characters from code to reduce file size |
| **Module** | A single JavaScript file that exports functions/components |
| **node_modules** | Folder containing all downloaded dependencies |
| **npm** | Node Package Manager — downloads and manages packages |
| **Package** | A reusable library published to npm |
| **PostCSS** | A tool for transforming CSS |
| **Props** | Properties passed to a React component (like function arguments) |
| **React** | A JavaScript library for building user interfaces |
| **Release build** | An optimized, signed version for distribution |
| **Render** | The process of displaying a component on screen |
| **Route** | A URL path mapped to a specific page/component |
| **SDK** | Software Development Kit — tools for building apps for a specific platform |
| **SPA** | Single Page Application — one HTML file, JavaScript handles navigation |
| **State** | Data that can change over time and triggers re-renders |
| **SVG** | Scalable Vector Graphics — image format that scales without losing quality |
| **Tailwind CSS** | A utility-first CSS framework |
| **Tree shaking** | Removing unused code from the final bundle |
| **TypeScript** | JavaScript with static types |
| **UI** | User Interface — what the user sees and interacts with |
| **Vite** | A fast build tool for modern web projects |
| **WebView** | A browser component embedded inside a native app |

---

## 21. Frequently Asked Questions

### General

**Q: Is this app free?**
A: Yes, completely free and open source.

**Q: Does this app need internet?**
A: No. Everything runs locally on your device. No data is sent anywhere.

**Q: Where is my data stored?**
A: In your device's localStorage (browser storage). On Android, it's stored within the app's WebView storage. If you uninstall the app, the data is deleted.

**Q: Can I use this on iPhone?**
A: Capacitor supports iOS too! You'd need a Mac with Xcode to build the iOS version. Run `npx cap add ios` instead of android.

### Development

**Q: What is the difference between `dependencies` and `devDependencies`?**
A: `dependencies` are libraries needed when the app RUNS (React, Tailwind, etc.). `devDependencies` are only needed during DEVELOPMENT (ESLint, Vitest, TypeScript). When you build for production, devDependencies are not included in the output.

**Q: Why are there so many files in `src/components/ui/`?**
A: These are shadcn/ui components. Unlike most libraries (installed via npm), shadcn gives you the actual source code. This means you can customize every component however you want.

**Q: What does `npx` do?**
A: `npx` runs a package's CLI command without installing it globally. `npx cap add android` runs Capacitor's CLI from the local `node_modules/.bin/`.

**Q: What's the difference between `npm install` and `npm install <package>`?**
A: Without a package name, it installs everything listed in `package.json`. With a name, it installs that specific package and adds it to `package.json`.

**Q: What's the `dist/` folder?**
A: It's the built output — production-ready files. When you run `npm run build`, Vite takes all source files, bundles them, minifies them, and outputs the result to `dist/`. This is what gets deployed or packaged into the Android app.

### Building / Android

**Q: Debug APK vs Release APK — what's the difference?**
A: A **debug APK** is for testing — it's larger, has debugging info, and doesn't need signing. A **release APK** is for distribution on the Play Store — it's optimized, minified, and must be signed with a keystore (a cryptographic certificate).

**Q: How do I build a Release APK?**
A: You need to create a signing keystore and configure it in `android/app/build.gradle`. Then run `.\gradlew.bat assembleRelease`.

**Q: Can I share the debug APK with friends?**
A: Yes! Just send them the `app-debug.apk` file. They'll need to enable "Install from Unknown Sources" in their phone settings.

**Q: Why does the Android build need Java 21?**
A: Capacitor 8 and the latest Android SDK tools require JDK 21 for compilation.

**Q: What if I don't have Android Studio?**
A: You don't need Android Studio. You only need the Android SDK command-line tools. However, Android Studio makes it easier to manage SDK versions and debug native issues.

**Q: How big is the APK?**
A: The debug APK is typically around 10-15 MB. A release APK would be smaller (5-10 MB).

**Q: Can I publish this to the Google Play Store?**
A: Yes! You'd need to:
1. Build a release APK (or AAB — Android App Bundle)
2. Create a Google Play Developer account ($25 one-time fee)
3. Sign the app with a keystore
4. Upload to the Play Console

---

## Quick Reference Card

```
┌──────────────────────────────────────────────────────┐
│               ATTENDANCE BUDDY CHEATSHEET            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  🔧 FIRST TIME SETUP                                │
│  npm install                                         │
│  npm install @capacitor/android                      │
│  npx cap add android                                 │
│                                                      │
│  💻 DEVELOPMENT                                     │
│  npm run dev          → Start dev server             │
│  npm run build        → Build for production         │
│  npm run test         → Run tests                    │
│  npm run lint         → Check code quality           │
│                                                      │
│  📱 ANDROID BUILD                                   │
│  npm run build                                       │
│  npx cap sync android                                │
│  cd android                                          │
│  .\gradlew.bat assembleDebug                         │
│                                                      │
│  📲 INSTALL ON PHONE                                │
│  adb devices          → Check connection             │
│  adb install -r <path-to-apk>                        │
│                                                      │
│  📁 KEY PATHS                                       │
│  Source files:   src/                                 │
│  Built output:   dist/                               │
│  Android project: android/                           │
│  APK location:   android/app/build/outputs/          │
│                  apk/debug/app-debug.apk             │
│                                                      │
│  🔑 ENVIRONMENT VARIABLES                           │
│  JAVA_HOME    = <path-to-jdk-21>                     │
│  ANDROID_HOME = <path-to-android-sdk>                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Converting This Document to PDF

You can convert this `.md` file to a beautifully formatted PDF using these websites:

### Recommended: Markdown to PDF converters with preview

1. **[md2pdf (md2pdf.netlify.app)](https://md2pdf.netlify.app/)**
   - Paste your Markdown → See live preview → Download PDF
   - Clean and simple, free, no sign-up

2. **[Dillinger (dillinger.io)](https://dillinger.io/)**
   - Full Markdown editor with live preview
   - Export to PDF, HTML, or styled HTML
   - Free, no sign-up needed

3. **[MarkdownToPDF (markdowntopdf.com)](https://www.markdowntopdf.com/)**
   - Upload the `.md` file → Download PDF
   - Simple one-click conversion

4. **[Pandoc (pandoc.org)](https://pandoc.org/)** (Offline tool)
   - Install locally, run: `pandoc ATTENDANCE_BUDDY_DOCUMENTATION.md -o documentation.pdf`
   - Most powerful option, needs installation

5. **VS Code Extension: "Markdown PDF"**
   - Install the extension in VS Code
   - Open this file → Right click → "Markdown PDF: Export (pdf)"
   - Converts directly from VS Code!

---

*Document created on February 25, 2026*
*Project: Attendance Buddy v1.0*
