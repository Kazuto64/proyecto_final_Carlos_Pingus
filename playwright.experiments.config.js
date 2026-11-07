// @ts-check
// Configuración solo para los experimentos de laboratorio (tests/experiments).
// Reutiliza toda la configuración principal y cambia únicamente qué carpeta ejecuta.
// Uso: npm run test:experiments -- --project=chromium
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config.js';

export default defineConfig({
  ...baseConfig,
  testDir: './tests/experiments',
  testIgnore: [],
});
