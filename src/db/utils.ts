import * as path from 'path'; 
import { PROJECT_ROOT } from "../constants";

export const dbPath = (name: string) => path.join(PROJECT_ROOT, `${name}.sqlite`);
