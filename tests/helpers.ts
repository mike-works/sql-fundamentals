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
  required.forEach(k => {
    assert.isDefined(
      (record as any)[k],
      `each ${opts.recordType} returned from ${opts.functionName} must have property ${k}`
    );
  });

  forbidden.forEach(k => {
    assert.isUndefined(
      (record as any)[k],
      `no ${opts.recordType} returned from ${opts.functionName} may have properties ${k}`
    );
  });
}
