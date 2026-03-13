declare module "better-sqlite3" {
  namespace BetterSqlite3 {
    interface Database {
      prepare(sql: string): Statement;
      exec(sql: string): void;
      close(): void;
      pragma(pragma: string): unknown;
    }

    interface Statement {
      run(...params: unknown[]): RunResult;
      get(...params: unknown[]): unknown;
      all(...params: unknown[]): unknown[];
    }

    interface RunResult {
      changes: number;
      lastInsertRowid: number | bigint;
    }
  }

  class BetterSqlite3 {
    constructor(filename: string, options?: Record<string, unknown>);
    prepare(sql: string): BetterSqlite3.Statement;
    exec(sql: string): void;
    close(): void;
    pragma(pragma: string): unknown;
  }

  export = BetterSqlite3;
}
