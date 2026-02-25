

# Attendance Calculator App

## Overview
A polished, mobile-first single-page attendance calculator with glassmorphism design, animated progress circle, and full localStorage persistence. Built to be Capacitor-ready for Android packaging.

## Features

### 1. Animated Progress Circle (Top Section)
- Large circular progress indicator showing current attendance percentage
- Color-coded: **green** (≥ required %), **yellow** (within 5% below), **red** (danger zone)
- Smooth CSS stroke animation with counting number effect
- Stats display: Present count, Total count, Bunks left, Classes needed

### 2. Persistent Settings Section
- **Required Percentage** input (e.g., 75%)
- **Classes Per Day** input (e.g., 5)
- **Days Per Week** input (e.g., 6)
- All saved to localStorage automatically and restored on app load

### 3. Daily Input Section
- Dropdown: Present / Absent (default: Present)
- Number input: Total classes today
- "Show Current Attendance" button
- Calculates and displays:
  - Current attendance percentage (2 decimals)
  - Classes needed to reach required %
  - Classes that can be bunked
  - Converted to classes, days (2 decimals), and weeks (2 decimals)

### 4. After-Calculation / Prediction Section
- Number input for prediction value
- Dropdown 1: Classes / Days / Weeks (auto-converts using settings)
- Dropdown 2: Present / Absent
- "Show After" button
- Shows predicted attendance %, remaining classes, days, and weeks

### 5. Validation & Error Handling
- Inline, non-blocking error messages (no JS alerts)
- Handles: negative numbers, empty inputs, present > total, division by zero, required % > 100, invalid values

### 6. Mobile-First Design
- Glassmorphism cards with soft gradients and neon accents
- Large touch-friendly buttons, no hover effects, no cursor styles
- Clean rounded font (Google Fonts)
- Smooth CSS-only animations, lightweight for low-RAM devices
- Fully responsive single-page layout

### 7. Capacitor-Ready Setup
- Capacitor config added for native Android/iOS wrapping
- Instructions provided as a task/todo for converting to Android APK

