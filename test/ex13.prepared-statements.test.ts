import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb } from '../src/db/utils';

import './helpers/global-hooks';

@suite('EX13: "Get Order" - Prepared Statement Test')
class OrdersPreparedStatementTest {
  @test('db.statements.getOrder prepared statement exists')
  public async statementExists() {
    let db = await getDb();
    assert.ok(db.statements.getOrder, 'getOrder prepared statement found');
  }

  @test('db.statements.getOrder resolves to an order')
  public async statementReturnsAnOrder() {
    let db = await getDb();
    let order = await db.statements.getOrder.get(26960);
    assert.ok(order, 'statement returns a truthy value when run');
    assert.equal(order.id, 26960, 'statement returns the correct record');
  }
}
