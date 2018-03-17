import { join } from 'path';

/**
 * The port the application serves HTTP responses on
 */
export const PORT = process.env.PORT || 3000;

// PATHS & FILES
export const PROJECT_ROOT = join(__dirname, '..');
export const PUBLIC_PATH = join(__dirname, 'public');
