import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex006.create-order.test';
import { createOrder } from '../src/data/orders';
import { assertMigrationCount } from './helpers/migrations';
import { assertTableExists } from './helpers/table';

@suite('EX0010: "Transactions Table" - Column constraints test')
class TransactionsTableTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(5);
  }

  @test('Transactions table exists')
  public async transactionsExists() {
    await assertTableExists(await getDb(), 'transaction');
  }

  @test('Inserting a new transaction completes successfully')
  public async insertTransaction() {
    let db = await getDb();
    let beforeTransactions = await db.all(sql`SELECT * from "transaction"`);
    let transaction = await db.get(
      sql`INSERT INTO "transaction" ("authorization", orderid) VALUES ($1, $2)`,
      'lk1hdklh12ld',
      10264
    );
    let afterTransactions = await db.all(sql`SELECT * from "transaction"`);
    assert.equal(
      beforeTransactions.length + 1,
      afterTransactions.length,
      'Transaction was inserted'
    );
  }

  @test('Inserting a new transaction fails if OrderId is invalid')
  public async invalidOrder() {
    let db = await getDb();
    let errors: string[] = [];
    try {
      let transaction = await db.run(
        sql`
    INSERT INTO "transaction" ("authorization", orderid) VALUES ($1, $2)`,
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
      errors[0].toLowerCase(),
      'foreign key',
      'Error message says something about "foreign key'
    );
  }
}
