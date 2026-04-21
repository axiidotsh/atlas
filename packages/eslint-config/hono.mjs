import nextTs from 'eslint-config-next/typescript';
import { defineConfig } from 'eslint/config';
import baseConfig from './base.mjs';

const honoConfig = defineConfig([...baseConfig, ...nextTs]);

export default honoConfig;
