import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex06.create-order.test';
import { createOrder, getOrder } from '../src/data/orders';
import { timeout } from './helpers';

@suite('EX11: "Transaction Trigger" - AFTER INSERT trigger test')
class TransactionsTriggerTest {
  @test('migrationExists() new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    let migrationsFiles = fs.readdirSync(path.join(__dirname, '..', 'migrations'));
    assert.isAtLeast(migrationsFiles.length, 6, 'There are at least six things in the ./migrations folder');
    let migrationsSqlsFiles = fs.readdirSync(path.join(__dirname, '..', 'migrations', 'sqls'));
    assert.isAtLeast(migrationsSqlsFiles.length, 10, 'There are at least ten things in the ./migrations/sqls folder');
    let downMigrationCount = 0;
    let upMigrationCount = 0;
    migrationsSqlsFiles.forEach(fileName => {
      if (fileName.includes('down')) { downMigrationCount++; }
      if (fileName.includes('up')) { upMigrationCount++; }
    });
    assert.isAtLeast(downMigrationCount, 5, 'There are at least three down migrations');
    assert.isAtLeast(upMigrationCount, 5, 'There are at least three up migrations');
  }

  @test('OrderTransaction trigger exists')
  public async triggerExists() {
    let db = await getDb('dev');
    let allTriggers = (await db.all(sql`select * from sqlite_master where type = 'trigger';`)).map(i => i.name);
    assert.includeMembers(allTriggers, ['OrderTransaction'], 'OrderTransaction trigger is found');
  }

  @test('Inserting a new transaction results in an order\'s OrderDate being set')
  public async insertTransaction() {
    let db = await getDb('dev');
    let order = await createOrder(VALID_ORDER_DATA);
    if (typeof order.Id === 'undefined') { assert.ok(false, 'newly created order Id is not truthy'); return; }
    assert.notOk(order.OrderDate, 'OrderDate is not yet set');
    let transaction = (await db.get(sql`INSERT INTO "Transaction" (Authorization, OrderId) VALUES (?, ?)`, 'lk1hdklh12ld', order.Id));
    order = await getOrder(order.Id);
    assert.ok(order.OrderDate, 'OrderDate is set');
  }
}
