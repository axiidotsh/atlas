import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: '.env' });
config({ path: '.env.local', override: true });

export default defineConfig({
  schema: 'src/db/schema.prisma',
  migrations: {
    path: 'src/db/migrations',
    seed: 'node -e "console.log(\'No seed data configured\')"',
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
});
