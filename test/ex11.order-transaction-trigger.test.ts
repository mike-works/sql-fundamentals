import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { createProduct, deleteProduct } from '../src/data/products';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';

import { VALID_ORDER_DATA } from './ex06.create-order.test';
import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';
import { assertTriggersExist } from './helpers/table';

@suite('EX11: "Pricing History Trigger" - AFTER INSERT trigger test')
class TransactionsTriggerTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(4);
  }

  @test('ProductPricingUpdate and ProductPricingInsert triggers exist')
  public async triggerExists() {
    await assertTriggersExist(await getDb(), ['ProductPricingUpdate', 'ProductPricingInsert']);
  }

  @test('Creating a new product results in a new ProductPricingInfo row being created')
  public async pricingChangeTest() {
    let db = await getDb();
    let p: Partial<Product> = {
      unitprice: 3.45,
      quantityperunit: '12 cans per case',
      discontinued: 0,
      unitsinstock: 30,
      unitsonorder: 40,
      reorderlevel: 20,
      categoryid: 1,
      supplierid: 1,
      productname: 'Magic Beans'
    };
    let { id } = await createProduct(p as any);
    if (typeof id === 'undefined') {
      throw new Error('createProduct() failed to return an id');
    }

    await deleteProduct(id);
  }
}
