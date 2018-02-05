import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex06.create-order.test';
import { createOrder, getOrder } from '../src/data/orders';

@suite('EX11: "Transaction Trigger" - AFTER INSERT trigger test')
class TransactionsTriggerTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    let migrationsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations')
    );
    assert.isAtLeast(
      migrationsFiles.length,
      6,
      'There are at least six things in the ./migrations folder'
    );
    let migrationsSqlsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations', 'sqls')
    );
    assert.isAtLeast(
      migrationsSqlsFiles.length,
      10,
      'There are at least ten things in the ./migrations/sqls folder'
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
      5,
      'There are at least three down migrations'
    );
    assert.isAtLeast(
      upMigrationCount,
      5,
      'There are at least three up migrations'
    );
  }

  @test('ordertransaction trigger exists')
  public async triggerExists() {
    let db = await getDb('dev');
    let allTriggers = await db.getAllTriggers();
    assert.includeMembers(
      allTriggers.map(s => s.toLowerCase()),
      ['ordertransaction'],
      'ordertransaction trigger is found'
    );
  }

  @test("Inserting a new transaction results in an order's OrderDate being set")
  public async insertTransaction() {
    let db = await getDb('dev');
    let { id } = await createOrder(VALID_ORDER_DATA);
    let order = await getOrder(id);
    if (typeof order.id === 'undefined') {
      assert.ok(false, 'newly created order Id is not truthy');
      return;
    }
    assert.notOk(order.orderdate, 'OrderDate is not yet set');
    let transaction = await db.get(
      sql`INSERT INTO "transaction" ("authorization", orderid) VALUES ($1, $2)`,
      'lk1hdklh12ld',
      order.id
    );
    order = await getOrder(order.id);
    assert.ok(order.orderdate, 'OrderDate is set');
  }
}
