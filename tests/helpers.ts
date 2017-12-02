import { assert } from 'chai';

interface RecordColumnsValidationOptions {
  recordType: string;
  functionName: string;
}
export function validateRecordColumns(
  opts: RecordColumnsValidationOptions,
  record: DBRecord,
  required: string[],
  forbidden: string[]
) {
  assert.containsAllKeys(
    record,
    required,
    `each ${opts.recordType} returned from ${opts.functionName} must have properties ${required.join(', ')}`
  );
  assert.doesNotHaveAnyKeys(
    record,
    forbidden,
    `no ${opts.recordType} returned from ${opts.functionName} may have properties ${required.join(', ')}`
  );
}
