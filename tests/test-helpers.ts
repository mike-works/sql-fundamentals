import { assert } from 'chai';
import { Value as JSONValue } from 'json-typescript';
interface RecordColumnsValidationOptions {
  recordType: string;
  functionName: string;
  functionArgs?: JSONValue[];
}

function stringifyArg(a: any) {
  return JSON.stringify(a);
}

export function validateRecordColumns(
  opts: RecordColumnsValidationOptions,
  record: DBRecord,
  required: string[],
  forbidden: string[] = []
) {
  let argsString = (opts.functionArgs || []).map(stringifyArg).join(', ');
  required.forEach(k => {
    assert.ok(
      record,
      `record returned from ${
        opts.functionName
      }(${argsString}) should be truthy`
    );
    assert.isDefined(
      (record as any)[k],
      `each ${opts.recordType} returned from ${
        opts.functionName
      }(${argsString}) must have property ${k}`
    );
  });

  forbidden.forEach(k => {
    assert.isUndefined(
      (record as any)[k],
      `no ${opts.recordType} returned from ${
        opts.functionName
      }(${argsString}) may have properties ${k}`
    );
  });
}
