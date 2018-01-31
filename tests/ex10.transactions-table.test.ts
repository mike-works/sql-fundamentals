import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex06.create-order.test';
import { createOrder } from '../src/data/orders';

@suite('EX10: "Transactions Table" - Column constraints test')
class TransactionsTableTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    let migrationsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations')
    );
    assert.isAtLeast(
      migrationsFiles.length,
      5,
      'There are at least five things in the ./migrations folder'
    );
    let migrationsSqlsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations', 'sqls')
    );
    assert.isAtLeast(
      migrationsSqlsFiles.length,
      8,
      'There are at least eight things in the ./migrations/sqls folder'
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
    assert.isAtLeast(
      downMigrationCount,
      4,
      'There are at least three down migrations'
    );
    assert.isAtLeast(
      upMigrationCount,
      4,
      'There are at least three up migrations'
    );
  }

  @test('Transactions table exists')
  public async transactionsExists() {
    let db = await getDb('dev');
    let allTables = (await db.all(
      sql`SELECT name FROM sqlite_master WHERE type='table'`
    )).map(i => i.name);
    assert.includeMembers(
      allTables,
      ['Transaction'],
      'Transaction table is found'
    );
  }

  @test('Inserting a new transaction completes successfully')
  public async insertTransaction() {
    let db = await getDb('dev');
    let beforeTransactions = await db.all(sql`SELECT * from "Transaction"`);
    let transaction = await db.get(
      sql`INSERT INTO "Transaction" (Authorization, OrderId) VALUES (?, ?)`,
      'lk1hdklh12ld',
      10264
    );
    let afterTransactions = await db.all(sql`SELECT * from "Transaction"`);
    assert.equal(
      beforeTransactions.length + 1,
      afterTransactions.length,
      'Transaction was inserted'
    );
  }

  @test('Inserting a new transaction fails if OrderId is invalid')
  public async invalidOrder() {
    let db = await getDb('dev');
    let errors: string[] = [];
    try {
      let transaction = await db.run(
        sql`
    INSERT INTO "Transaction" (Authorization, OrderId) VALUES (?, ?)`,
        'lk1hdklh12ld',
        191927158
      );
      assert.ok(
        false,
        'Should have encountered a foreign key constraint error'
      );
    } catch (e) {
      errors.push(e.toString());
    }
    assert.isAtLeast(
      errors.length,
      1,
      'At least one error (foreign key constraint violation) should have been thrown'
    );
    assert.include(
      errors[0],
      'FOREIGN KEY',
      'Error message says something about "FOREIGN KEY'
    );
  }
}
