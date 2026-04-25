import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

const envPath = fileURLToPath(new URL('../.env', import.meta.url));
const localEnvPath = fileURLToPath(new URL('../.env.local', import.meta.url));

config({ path: envPath });
config({ path: localEnvPath, override: true });
