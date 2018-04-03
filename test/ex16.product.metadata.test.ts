import { assert } from 'chai';
import { difference, differenceWith } from 'lodash';
import { suite } from 'mocha-typescript';

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct
} from '../src/data/products';
import { getDb, DbType } from '../src/db/utils';

import { onlyForDatabaseTypes } from './helpers/decorators';
import './helpers/global-hooks';

@suite('EX16: "Product Metadata" - JSONB column test')
class ProductMetadataJsonTest {
  // prettier-ignore
  protected productId!: string | number;
  public async before() {
    let { id } = await createProduct({
      productname: 'Red Bull',
      supplierid: -11,
      categoryid: 1,
      unitsinstock: 100,
      unitprice: 3.99,
      unitsonorder: 0,
      reorderlevel: 20,
      discontinued: 0,
      quantityperunit: '12 8oz cans'
    });
    this.productId = id;
  }

  public async after() {
    if (typeof this.productId === 'undefined') {
      return;
    }
    await deleteProduct(this.productId);
  }

  @test('getAllProducts results include a metadata column')
  public async metadataColumnExists() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.containsAllKeys(results[0], ['metadata']);
  }

  @test('[POSTGRES ONLY] metadata column is of type object')
  @onlyForDatabaseTypes(DbType.PostgreSQL)
  public async metadataIsObject() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.isObject(results[0].metadata);
  }

  @test('[MYSQL and SQLite ONLY] metadata column is of type null or object')
  @onlyForDatabaseTypes(DbType.MySQL, DbType.SQLite)
  public async metadataIsNullOrObject() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.ok(['null', 'object'].indexOf(typeof results[0].metadata) >= 0);
  }

  @test(
    'newly created products begin with metadata { flavor: { salty: -1, sweet: -1, sour: -1, spicy: -1, bitter: -1} }'
  )
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async newProductsStartEmpty() {
    assert.ok(this.productId, 'ID for new product is ok');
    let prod = await getProduct(this.productId);
    assert.ok(prod, "newly created product's id can be used to retreive it from the db");

    assert.isObject(prod.metadata, 'metadata property is an object');
    assert.deepEqual(
      prod.metadata,
      { flavor: { salty: -1, sweet: -1, sour: -1, spicy: -1, bitter: -1 } },
      'metadata is initially { flavor: { salty: -1, sweet: -1, sour: -1, spicy: -1, bitter: -1} }'
    );
  }

  @test('updating product metadata persists successfully')
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async metadataUpdatesPersist() {
    await updateProduct(this.productId, {
      metadata: { flavor: { spicy: 2, sweet: 0, salty: 5, sour: 1, bitter: 3 } }
    });
    let prod = await getProduct(this.productId);
    assert.isObject(prod.metadata, 'metadata property is an object');

    assert.deepEqual(
      prod.metadata,
      { flavor: { salty: 5, sweet: 0, sour: 1, spicy: 2, bitter: 3 } },
      'metadata changes alter the database record'
    );
  }

  @test('getAllProducts with flavor filter: sweet>2 sour>2')
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async sweetSourFilter() {
    let allResults = await getAllProducts();
    let sweetSourResults = await getAllProducts({
      filter: {
        flavor: [
          { flavorName: 'sour', type: 'greater-than', level: 2 },
          { flavorName: 'sweet', type: 'greater-than', level: 2 }
        ]
      }
    });
    assert.isBelow(
      sweetSourResults.length,
      allResults.length,
      'Sweet-sour products are a subset of all products'
    );
    assert.ok(
      sweetSourResults.every(
        p =>
          p &&
          p.metadata &&
          p.metadata.flavor &&
          p.metadata.flavor.sweet > 2 &&
          p.metadata.flavor.sour > 2
      ),
      'All results from sweet-sour filter have sweet > 2 and sour > 2'
    );
    assert.ok(
      differenceWith(allResults, sweetSourResults, (a: any, b: any) => a.id === b.id).every(
        p =>
          !p ||
          !p.metadata ||
          !p.metadata.flavor ||
          (p.metadata.flavor.sweet <= 2 || p.metadata.flavor.sour <= 2)
      ),
      'All results excluded by sweet-sour filter have sweet <= 2 OR sour <= 2'
    );
  }

  @test('getAllProducts with flavor filter: sweet>2 spicy>2')
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async sweetHotFilter() {
    await updateProduct(1, {
      metadata: {
        flavor: { sweet: 5, sour: 5, bitter: 5, salty: 5, spicy: 5 }
      },
      tags: []
    });

    let allResults = await getAllProducts();
    let sweetHotResults = await getAllProducts({
      filter: {
        flavor: [
          { flavorName: 'spicy', type: 'greater-than', level: 2 },
          { flavorName: 'sweet', type: 'greater-than', level: 2 }
        ]
      }
    });
    assert.isAbove(sweetHotResults.length, 0, 'Nonzezro number of sweetHotResults');
    assert.isBelow(
      sweetHotResults.length,
      allResults.length,
      'Sweet-hot products are a subset of all products'
    );
    assert.ok(
      sweetHotResults.every(
        p =>
          p.metadata &&
          p.metadata.flavor &&
          p.metadata.flavor.sweet > 2 &&
          p.metadata.flavor.spicy > 2
      ),
      'All results from sweet-hot filter have sweet > 2 and spicy > 2'
    );
    assert.ok(
      differenceWith(allResults, sweetHotResults, (a: any, b: any) => a.id === b.id).every(
        p => !p.metadata || p.metadata.flavor.sweet <= 2 || p.metadata.flavor.spicy <= 2
      ),
      'All results excluded by sweet-hot filter have sweet <= 2 OR spicy <= 2'
    );
  }
}
