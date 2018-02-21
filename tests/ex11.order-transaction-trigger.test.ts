import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex06.create-order.test';
import { createOrder, getOrder } from '../src/data/orders';
import { assertMigrationCount } from './helpers/migrations';
import { assertTriggersExist } from './helpers/table';

@suite('EX11: "Transaction Trigger" - AFTER INSERT trigger test')
class TransactionsTriggerTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(6);
  }

  @test('ordertransaction trigger exists')
  public async triggerExists() {
    assertTriggersExist(await getDb(), ['ordertransaction']);
  }

  @test("Inserting a new transaction results in an order's OrderDate being set")
  public async insertTransaction() {
    let db = await getDb();
    let { id } = await createOrder(VALID_ORDER_DATA);
    if (typeof id === 'undefined') {
      throw new Error('createOrder() failed to return an id');
    }
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
