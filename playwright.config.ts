import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ testDir:'./tests', timeout:60000, use:{...devices['Desktop Chrome'], channel:'chrome', baseURL:'http://127.0.0.1:4173'}, webServer:{ command:'npm run preview -- --port 4173', url:'http://127.0.0.1:4173', reuseExistingServer:false, timeout:60000 } });
