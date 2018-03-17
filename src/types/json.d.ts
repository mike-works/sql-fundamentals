declare module '*database.json' {
  export const sqlite: {
    readonly driver: 'sqlite3';
    readonly filename: string;
  };
  export const pg: {
    readonly driver: 'pg';
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly database: string;
    readonly schema: string;
  };
  export const mysql: {
    readonly driver: 'mysql';
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly database: string;
  };
}

declare module '*.json' {
  import { Value } from 'json-typescript';
  const value: Value;
  export = value;
}
