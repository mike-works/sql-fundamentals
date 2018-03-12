import { test } from 'mocha-typescript';
import { DbType, DB_TYPE } from '../../src/db/utils';
import { logger } from '../../src/log';

export function onlyForDatabaseTypes<T>(...types: DbType[]): MethodDecorator {
  return (target: object, propertyName: string | symbol): void => {
    if (types.indexOf(DB_TYPE) < 0) {
      logger.warn(
        `Skipping ${(target as any)[propertyName].name} for ${DbType[DB_TYPE]}`
      );
      test.skip(target, propertyName);
    }
  };
}
