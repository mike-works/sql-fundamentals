import { join } from 'path';
// APPLICATION
export const PORT = process.env.PORT || 3000;

// PATHS & FILES
export const PROJECT_ROOT = join(__dirname, '..');

// SQLITE DATABASES
export const MASTER_DB_NAME = 'master.sqlite';
export const MASTER_DB_FILE = join(PROJECT_ROOT, MASTER_DB_NAME);
