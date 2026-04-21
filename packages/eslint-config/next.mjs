import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig } from 'eslint/config';
import baseConfig from './base.mjs';

const nextConfig = defineConfig([
  ...baseConfig,
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]);

export default nextConfig;
