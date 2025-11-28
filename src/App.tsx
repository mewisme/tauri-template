import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CommandProvider } from './components/providers/command-provider';
import { Home } from './pages/home';
import { Layout } from './components/layout';
import { Settings } from './pages/settings';
import { ThemeToggleListener } from './components/theme-toggle-listener';
import { Toaster } from 'sonner';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { loadCursorStore } from './store/cursor';
import { loadSettingsStore } from './store/settings';
import { registerDefaultCommands } from './lib/commands';
import { useEffect } from 'react';

export default function App() {
  const window = getCurrentWindow();

  useEffect(() => {
    window.center().then(() => {
      console.log('Window centered');
    });
    registerDefaultCommands();

    // Load stores from Tauri
    loadCursorStore();
    loadSettingsStore();
  }, []);

  return (
    <BrowserRouter>
      <CommandProvider>
        <ThemeToggleListener />
        <Layout>
          <Toaster position="bottom-right" richColors />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </CommandProvider>
    </BrowserRouter>
  )
}