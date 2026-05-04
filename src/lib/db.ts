import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __painelMysqlPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  const url = process.env.DATABASE_URL;
  if (!url?.trim()) {
    throw new Error("Configure DATABASE_URL (mesmo MySQL da loja)");
  }
  return mysql.createPool(url.trim());
}

export function getPool(): mysql.Pool {
  if (!globalThis.__painelMysqlPool) {
    globalThis.__painelMysqlPool = createPool();
  }
  return globalThis.__painelMysqlPool;
}
