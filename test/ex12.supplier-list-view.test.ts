import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';

import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';
import { assertViewsExist } from './helpers/table';

@suite('EX12: "Supplier List View" - View Test')
class SupplierListViewTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(5);
  }

  @test('supplierlist_v view exists')
  public async viewExists() {
    await assertViewsExist(await getDb(), ['supplierlist_v']);
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
