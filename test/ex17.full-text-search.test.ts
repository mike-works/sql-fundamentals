import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getSearchResults } from '../src/data/search';

import { DbType } from '../src/db/utils';
import { onlyForDatabaseTypes } from './helpers/decorators';
import './helpers/global-hooks';

@suite('EX17: "Full Text Search" - Global Search Tests')
class FullTextSearchTest {
  @test("getSearchResults('german')")
  public async germanResults() {
    let germanResults = await getSearchResults('german');
    assert.equal(germanResults.length, 16, 'Expected 16 search results');
    assert.sameMembers(
      germanResults.map(r => r.name),
      [
        'Frankenversand',
        'Morgenstern Gesundkost',
        'Die Wandernde Kuh',
        'Königlich Essen',
        'Toms Spezialitäten',
        'Nord-Ost-Fisch Handelsgesellschaft mbH',
        'Lehmanns Marktstand',
        'Drachenblut Delikatessen',
        'Blauer See Delikatessen',
        'Ottilies Käseladen',
        'Andrew Fuller',
        'Heli Süßwaren GmbH & Co. KG',
        'Anne Dodsworth',
        'Alfreds Futterkiste',
        'Plutzer Lebensmittelgroßmärkte AG',
        'QUICK-Stop'
      ],
      'Includes the correct 16 results'
    );
  }

  @test("getSearchResults('germany')")
  public async germanyResults() {
    let germanyResults = await getSearchResults('germany');
    assert.equal(germanyResults.length, 14, 'Expected 14 search results');
    assert.sameMembers(
      germanyResults.map(r => r.name),
      [
        'Frankenversand',
        'Morgenstern Gesundkost',
        'Die Wandernde Kuh',
        'Plutzer Lebensmittelgroßmärkte AG',
        'Königlich Essen',
        'Toms Spezialitäten',
        'QUICK-Stop',
        'Nord-Ost-Fisch Handelsgesellschaft mbH',
        'Lehmanns Marktstand',
        'Drachenblut Delikatessen',
        'Blauer See Delikatessen',
        'Ottilies Käseladen',
        'Heli Süßwaren GmbH & Co. KG',
        'Alfreds Futterkiste'
      ],
      'Includes the correct 14 results'
    );
  }

  @test("[POSTGRES ONLY] getSearchResults('dry')")
  @onlyForDatabaseTypes(DbType.PostgreSQL)
  public async dryResults() {
    let dryResults = await getSearchResults('dry');
    assert.equal(dryResults.length, 2, 'Expected 2 search results');
    assert.sameMembers(
      dryResults.map(r => r.name),
      ["Uncle Bob's Organic Dried Pears", 'Manjimup Dried Apples'],
      'Includes the correct 2 results'
    );
  }

  @test("getSearchResults('michael')")
  public async michaelResults() {
    let michaelResults = await getSearchResults('michael');
    assert.equal(michaelResults.length, 3, 'Expected 3 search results');
    assert.sameMembers(
      michaelResults.map(r => r.name),
      ['Svensk Sjöföda AB', 'Richter Supermarkt', 'Michael Suyama'],
      'Includes the correct 3 results'
    );
  }

  @test("getSearchResults('leverling')")
  public async leverlingResults() {
    let leverlingResults = await getSearchResults('leverling');
    assert.equal(leverlingResults.length, 1, 'Expected 1 search result');
    assert.sameMembers(
      leverlingResults.map(r => r.name),
      ['Janet Leverling'],
      'Includes the correct result'
    );
  }

  @test("getSearchResults('deli')")
  public async deliResults() {
    let deliResults = await getSearchResults('deli');
    assert.isAbove(deliResults.length, 4, 'Expected 5+ search results');
    assert.includeMembers(
      deliResults.map(r => r.name).sort(),
      [
        'New Orleans Cajun Delights',
        'Old World Delicatessen',
        'Drachenblut Delikatessen',
        'Blauer See Delikatessen',
        'LINO-Delicateses'
      ],
      'Includes the correct result'
    );
  }
}
