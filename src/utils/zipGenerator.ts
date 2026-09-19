import JSZip from 'jszip';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('package.json', JSON.stringify({
    name: 'circular-arena-fighter',
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'lucide-react': '^0.546.0',
      'canvas-confetti': '^1.9.4',
      jszip: '^3.10.1',
      motion: '^12.23.24'
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@types/canvas-confetti': '^1.9.0',
      '@vitejs/plugin-react': '^6.1.1',
      '@tailwindcss/vite': '^4.3.3',
      tailwindcss: '^4.3.3',
      typescript: '^5.7.0',
      vite: '^8.3.0'
    }
  }, null, 2));

  zip.file('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Circular Arena Fighter</title>
    <meta name="description" content="Circular arena duel game with character avatars, weapons, sounds, and mobile app export." />
  </head>
  <body class="bg-slate-950 text-white overflow-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

  zip.file('vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});`);

  zip.file('tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      moduleResolution: 'bundler',
      jsx: 'react-jsx',
      strict: true,
      skipLibCheck: true
    },
    include: ['src']
  }, null, 2));

  // Add Complete Instructions for mobile app conversion (Android / iOS)
  zip.file('BUILD_MOBILE_APP.md', `# How to Build This Game Into an Android APK or iOS App

This project is built with React and Vite. It is 100% compatible with Capacitor (the modern replacement for Cordova) to build a native Android APK or iOS app.

## Step 1: Install Dependencies
\`\`\`bash
npm install
\`\`\`

## Step 2: Build the Web Assets
\`\`\`bash
npm run build
\`\`\`

## Step 3: Add Capacitor for Android App
\`\`\`bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Arena Fighter" "com.arena.fighter" --web-dir dist
npx cap add android
\`\`\`

## Step 4: Open in Android Studio & Generate APK
\`\`\`bash
npx cap copy android
npx cap open android
\`\`\`
In Android Studio:
- Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**
- Your APK will be generated ready to install on your Android phone!

## Step 5: For iOS App (Mac Required)
\`\`\`bash
npm install @capacitor/ios
npx cap add ios
npx cap open ios
\`\`\`
`);

  // Add source code and types
  const src = zip.folder('src');
  if (src) {
    src.file('main.tsx', `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`);
    src.file('index.css', `@import "tailwindcss";`);
  }

  return await zip.generateAsync({ type: 'blob' });
}
