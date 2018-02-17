import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import { getDb } from '../src/db/utils';
import { getAllProducts } from '../src/data/products';

@suite('EX114: "Product Metadata" - JSONB column test')
class ProductMetadataJsonTest {
  @test('getAllProducts results include a metadata column')
  public async metadataColumnExists() {
    let db = await getDb('dev');
    let results = await getAllProducts();
    assert.containsAllKeys(results[0], ['metadata']);
  }
}
