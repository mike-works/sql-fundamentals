import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

export function assertMigrationCount(
  migrationCount: number,
  sqlsCount = migrationCount
) {
  assert.ok(
    fs.existsSync(path.join(__dirname, '..', '..', 'migrations')),
    './migrations folder exists'
  );
  let migrationsFiles = fs.readdirSync(
    path.join(__dirname, '..', '..', 'migrations')
  );
  assert.ok(
    fs.existsSync(path.join(__dirname, '..', '..', 'migrations', 'sqls')),
    './sqls folder exists'
  );
  assert.includeDeepMembers(
    migrationsFiles,
    ['sqls', '20171203034929-first.ts'],
    './migrations folder contains sqls folder and first migration'
  );
  assert.isAtLeast(
    migrationsFiles.length,
    migrationCount,
    `There are at least ${migrationCount} things in the ./migrations folder`
  );
  let migrationsSqlsFiles = fs.readdirSync(
    path.join(__dirname, '..', '..', 'migrations', 'sqls')
  );
  assert.isAtLeast(
    migrationsSqlsFiles.length,
    sqlsCount,
    `There are at least ${sqlsCount} things in the ./migrations/sqls folder`
  );
  let downMigrationCount = 0;
  let upMigrationCount = 0;
  migrationsSqlsFiles.forEach(fileName => {
    if (fileName.includes('-down')) {
      downMigrationCount++;
    }
    if (fileName.includes('-up')) {
      upMigrationCount++;
    }
  });
}
