import { promisify } from "util";
import * as path from "path";
import * as fs from "fs";
import * as debug from 'debug';
import { PROJECT_ROOT, MASTER_DB_FILE } from "../constants";
import { dbPath } from "./utils";

const copyFile = promisify(fs.copyFile);
const exists = promisify(fs.exists);

const log = debug('db:setup');

export async function initializeDb(dbName = 'dev') {
  let pth = dbPath(dbName);
  let doesExist = await exists(pth);
  if (!doesExist) {
    log(`Database ${dbName} was not found at ${pth}... creating it now`);
    await await copyFile(MASTER_DB_FILE, pth);
  } else {
    log(`Database ${dbName} was found at ${pth}...`);
  }
}