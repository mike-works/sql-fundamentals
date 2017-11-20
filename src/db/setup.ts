import * as fs from "fs-extra";
import { promisify } from "util";

import { MASTER_DB_FILE } from "../constants";

import { dbPath } from "./utils";
import { logger } from "../utils";

const copyFile = promisify(fs.copyFile);

export async function initializeDb(dbName = 'dev') {
  let pth = dbPath(dbName);
  if (!fs.existsSync(pth)) {
    logger.debug(`Database ${dbName} was not found at ${pth}... creating it now`);
    await copyFile(MASTER_DB_FILE, pth);
  }
}