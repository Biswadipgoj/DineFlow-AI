import type { Config } from 'tailwindcss';
import preset from '@dinenovaai/config/tailwind';
const config: Config = { ...preset, content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'] };
export default config;
