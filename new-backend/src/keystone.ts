
import { config } from '@keystone-6/core';
import { lists } from './schema';

const dbUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/keystone-db';

export default config({
  db: {
    provider: 'postgresql',
    url: dbUrl,
  },
  lists,
  ui: {
    isAccessAllowed: () => true, // Simplest access control
  },
});
