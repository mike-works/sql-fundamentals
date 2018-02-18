import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex006.create-order.test';
import { createOrder, getOrder } from '../src/data/orders';
import { assertMigrationCount } from './helpers/migrations';
import { assertViewsExist } from './helpers/table';

@suite('EX112: "Supplier List View" - View Test')
class SupplierListViewTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(7);
  }

  @test('supplierlist_v view exists')
  public async viewExists() {
    assertViewsExist(await getDb(), ['supplierlist_v']);
  }

  @test('Querying the view yields expected results')
  public async viewResults() {
    let db = await getDb();
    let result = await db.get(sql`SELECT * from SupplierList_V`);
    assert.ok(result, 'Results of query are truthy');
    assert.includeMembers(
      Object.keys(result),
      ['id', 'companyname', 'contactname', 'productlist'],
      "Columns: 'id', 'companyname', 'contactname', 'productlist'"
    );
  }
}
