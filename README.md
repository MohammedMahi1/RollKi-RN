# RollKi 📱✨

A minimalist, high-performance, gesture-driven Wikipedia reader built for fluid mobile discovery. 

Developed by **Mohammed Mahi**.

---

## 📖 About the Project

**RollKi** transforms how you explore Wikipedia. Instead of navigating cluttered web layouts, RollKi brings a native, sleek, and minimalist card-based deck to your fingertips. Scroll through high-res visual entry summaries, dive deep into custom typographic reading spaces, or save articles to your local database using rich, fluid interactive micro-interactions.

### 🎨 Design Philosophy
* **Pure Minimalist Canvas:** Deep black `#000000` backgrounds and tight gray typography reduce eye strain and maximize content focus.
* **Figma-to-Code Micro-interactions:** Precise multi-frame gesture tracking, iOS-style item deletion shaking, and instant haptic feedback pipelines.
* **Native Speed:** Native browser threads and zero-overhead screen management keep navigation blazing fast.

---

## 🚀 Key Features

* **Visual Card Deck:** Infinite scrolling layout linking curated page images with optimized excerpt summaries.
* **Native In-App Web Contexts:** Tap the Compass icon to launch blazing-fast Safari Controller / Chrome Custom Tabs via `expo-web-browser` with zero thread lag.
* **Figma Precise Double-Tap:** Double-tap any image asset to trigger a smooth, multi-stage scaled bookmark overlay pop with synchronized device haptics.
* **Local Persistent Storage:** Powered by a localized relational database engine (`Drizzle ORM` + `expo-sqlite`) with automatic runtime migrations on application start.
* **Zero-Flash Navigation:** Custom stack architectures configured to prevent transitional alpha or background white flickers during platform-native swipe-back pops.

---

## 🛠️ Built With

* **Framework:** React Native (Expo Workflow Engine)
* **Navigation:** React Navigation (Stack & Material Top Tabs)
* **Animation:** React Native Reanimated & React Native Animated
* **Database Layer:** Drizzle ORM + Expo SQLite
* **Networking & Media:** Axios + Expo Image (Advanced Disk Caching)
* **Iconography:** Lucide React Native

---

## ⚙️ Getting Started & Local Installation

Follow these steps to spin up the local development suite on your machine:

### Prerequisites
Make sure you have Node.js, Git, and the Expo Go app (or a simulator set up via Xcode/Android Studio).

### 1. Clone the Repository
```bash
git clone [https://github.com/MohammedMahi1/RollKi-RN.git](https://github.com/MohammedMahi1/RollKi-RN.git)
cd RollKi
```
### 2. Install Dependencies
```bash
npm install
# or
yarn install
```
### 3. Initialize Database Migrations
RollKi automatically pushes migrations to the SQLite surface layer on execution via the schema entry points. Ensure your local configuration files are updated.
### 4. Build 
```bash
npx expo run
```
### 5. Run the Development Server
```bash
npx expo start
```
# 🤝 Contact & Contributions
**Designed and Engineered by Mohammed Mahi — Front-End & Mobile Web Architect.**
