import { globalIgnores } from 'eslint/config';

const baseConfig = [
  globalIgnores([
    '.next/**',
    '.turbo/**',
    'build/**',
    'coverage/**',
    'dist/**',
    'next-env.d.ts',
    'out/**',
  ]),
];

export default baseConfig;
