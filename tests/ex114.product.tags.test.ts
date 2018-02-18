import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import { getDb } from '../src/db/utils';
import { getAllProducts } from '../src/data/products';

@suite('EX114: "Product Tags" - Array column test')
class ProductTagsTest {
  @test('getAllProducts results include a tags column')
  public async tagsColumnExists() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.containsAllKeys(results[0], ['tags']);
  }
}
