# ⚔️ Circular Arena Fighter (Modi ji vs Abhijit dipke)

An action-packed 2D circular radar arena combat game inspired by the viral duel videos. Features circular boundary bounce physics, dynamic animated weapon pickups, bullet trajectory aiming, real-time particle effects, authentic synthesized sound effects, viral Indian meme voice lines, and built-in mobile app export (Android APK & iOS).

---

## 🌟 Game Highlights

- **Circular Radar Arena**: Complete with circular edge bounce physics, dark space radar grid, concentric range rings, and animated neon boundary glow.
- **Top Health Bars & Match Banner**: Dynamic health meters with real-time HP numerical readouts (100 HP max), hit flashes, and the bold center match title (`Modi ji vs Abhijit dipke`).
- **Targeting System**: Dashed yellow laser trajectory guideline connecting the attacker to the opponent when aiming.
- **Dynamic Weapon & Item Drops**:
  - 🔫 **Pistol**: Sharp single-shot handgun with velocity.
  - 🎤 **Reporter Mic**: Blasts acoustic news soundwave pulses.
  - ⚔️ **Broadsword**: Piercing golden blade dash attack.
  - 🪵 **Gulel Slingshot**: Elastic catapult firing high-velocity stones.
  - 💥 **AK-47**: Rapid-fire 3-round burst assault rifle.
  - 🔥 **Flame Aura**: Fiery protective ring incinerating opponents on contact.
  - 🔱 **Trishul (Trident)**: Sacred golden spear with piercing damage.
  - 💥 **Shotgun**: Triple-pellet spread blast.
  - ⚡ **Plasma Blaster**: High-speed sci-fi laser ray.
  - 💖 **Medical Heart**: Restores +25 HP on touch with healing chime.
  - 💣 **Dynamite Bomb**: Heavy explosive causing an arena shockwave.
- **Audio & Viral Meme Voice Lines**:
  - 100% offline Web Audio API sound synthesizer for all weapons, bullet impacts, sword slashes, health chimes, and victory fanfare.
  - Viral Indian meme voice lines (*"Wah Modi ji Wah!"*, *"Aho gaon me sarkari school theek karo..."*, *"Lene ke dene pad gaye!"*, *"Maza aaya!"*, *"Khatam! Tata! Bye-bye!"*).
- **Multiple Game Modes**:
  - **Auto Battle**: Autonomous AI vs AI spectator simulation (exact recreation of the viral video).
  - **Play P1**: Control Player 1 via Keyboard (WASD / Arrow keys) or on-screen Virtual Joystick.
  - **2-Player Local**: Dual control fight on the same device.
- **Game Speed Multiplier**: 1x, 1.5x, and 2x speed for fast-paced gameplay.
- **Customizable Fighters**: Play as Modi ji, Abhijit dipke, Rahul ji, Yogi ji, or upload any photo from your phone/PC and set your own fighter name!
- **Winner Victory Screen**: Authentic popup card with winner announcement, restart button, and celebratory confetti.
- **Direct Project ZIP Download**: In-browser 1-click exporter to download the complete standalone source code.

---

## 🚀 Quick Start (Web Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Generates production static files in the `dist/` directory.

---

## 📱 How to Build This Game Into an Android APK or iOS App

Because the entire game is built with zero external runtime dependencies and procedural Web Audio SFX, it runs at 60 FPS offline on mobile devices.

You can package it into a native Android APK or iOS app using **Capacitor** in 4 simple steps:

### Step 1: Build the Web Assets
```bash
npm run build
```

### Step 2: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Arena Fighter" "com.arena.fighter" --web-dir dist
```

### Step 3: Add the Android Platform
```bash
npx cap add android
```

### Step 4: Open in Android Studio & Generate APK
```bash
npx cap open android
```
Inside **Android Studio**:
1. Wait for Gradle sync to complete.
2. Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. Once completed, click **locate** to find `app-debug.apk`.
4. Transfer the APK to your Android smartphone and install it!

### For iOS (Mac with Xcode required):
```bash
npm install @capacitor/ios
npx cap add ios
npx cap open ios
```
Press **Run** in Xcode to test on your iPhone or simulator.

---

## 📂 Project Architecture

```
├── public/
│   └── circular-arena-fighter-game.zip  # Pre-bundled project archive for offline sharing
├── src/
│   ├── audio/
│   │   └── soundEngine.ts        # Web Audio API procedural SFX & meme voice synthesizer
│   ├── components/
│   │   ├── ArenaCanvas.tsx       # HTML5 Canvas 60fps physics, particles & radar rendering
│   │   ├── HealthBarHeader.tsx   # Top player names, HP bars & match title
│   │   ├── WinnerModal.tsx       # "WINNER WINS" victory popup with confetti
│   │   ├── ControlsBar.tsx       # Speed (1x/1.5x/2x), Mode, Audio & Export controls
│   │   ├── CharacterSelectModal.tsx # Preset picker & custom photo upload
│   │   ├── AppExportModal.tsx    # Mobile app APK guide & 1-click ZIP downloader
│   │   └── VirtualJoystick.tsx   # Touch-friendly joystick for mobile gameplay
│   ├── data/
│   │   ├── characters.ts         # Character presets with high-res embedded vector avatars
│   │   └── weapons.ts            # Weapon damage, cooldowns, bullets, colors & icons
│   ├── utils/
│   │   └── zipGenerator.ts       # In-browser JSZip exporter
│   ├── types.ts                  # Shared TypeScript interfaces & types
│   ├── App.tsx                   # Master game state & controls orchestrator
│   ├── main.tsx                  # React DOM entry point
│   └── index.css                 # Tailwind CSS styling
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎮 Game Controls

| Control | Action |
|---|---|
| **START / PAUSE** | Toggles battle simulation |
| **RESTART** | Resets health bars, weapons, and spawns rematch |
| **1x / 1.5x / 2x** | Changes battle speed multiplier |
| **Auto Battle** | Sit back and watch AI fight autonomously (exact match to video) |
| **Play P1 (WASD / Arrows)** | Move Player 1 inside the arena |
| **Virtual Joystick** | Drag touch joystick on mobile screens to navigate |
| **Fighters Button** | Switch characters or upload custom image & name |
| **Meme Voice Button** | Triggers viral funny Hindi voice clips anytime |
| **Get ZIP Button** | Downloads the complete game ZIP file with 1 click |

---

## 🔊 Audio Details

All weapon firing sounds, bullet impacts, health chimes, explosions, and fanfare are produced by the native **Web Audio API** via `soundEngine.ts`.
- **Zero latency**: Instant audio response without network lag.
- **Zero audio assets to download**: The audio is synthesized procedurally in real-time, keeping the app bundle ultra-lightweight.
- **Voice Lines**: Uses high-quality Web Speech / audio synthesis with Hindi & Indian English tonality for authentic viral video dialogues.

---

## 📜 License
This project is open-source and free to use for personal, educational, and app publishing purposes.
