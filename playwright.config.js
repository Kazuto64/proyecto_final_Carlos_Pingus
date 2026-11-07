// @ts-check
import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';

/* Lee el archivo .env (no se sube a Git) y deja sus valores en process.env */
dotenv.config();

/* Si falta una variable, avisar con claridad: se muestra el nombre, nunca el valor */
for (const name of ['BASE_URL', 'SEARCH_URL', 'LOGIN_USER', 'LOGIN_PASSWORD']) {
  if (!process.env[name]) {
    throw new Error(`Falta la variable ${name}. Copia .env.example a .env y complétala.`);
  }
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Los experimentos de laboratorio (tests/experiments) no forman parte de la suite.
     Se ejecutan aparte con: npm run test:experiments */
  testIgnore: '**/experiments/**',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Dominio de Swag Labs, escrito una sola vez (en .env). Cada goto lleva solo la ruta. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Toolshop y Swag Labs marcan sus elementos con data-test (no con el data-testid por defecto) */
    testIdAttribute: 'data-test',

    /* Textos del sitio en inglés, sin depender del idioma de la máquina */
    locale: 'en-US',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

