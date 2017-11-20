import { join } from "path";

export const PROJECT_ROOT = join(__dirname, '..');
export const MASTER_DB_NAME = 'master.sqlite';
export const MASTER_DB_FILE = join(PROJECT_ROOT, MASTER_DB_NAME);
