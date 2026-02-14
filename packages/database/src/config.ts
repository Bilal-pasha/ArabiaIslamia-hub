import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

// Load .env when available (e.g. local dev); in Docker/production env vars are set by the runtime
try {
  require('dotenv/config');
} catch {
  // dotenv not installed or not needed
}

export type ProjectId = 'huffaz' | 'secondary' | 'scouts-portal' | 'main-website' | 'library';

const PROJECT_DB_MAP: Record<ProjectId, string> = {
  huffaz: 'huffaz_db',
  secondary: 'secondary_db',
  'scouts-portal': 'scouts_portal_db',
  'main-website': 'main_website_db',
  library: 'library_db',
};

export interface DatabaseConfigParams {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  project: ProjectId;
}

export function getDatabaseName(project: ProjectId): string {
  const envKey = `${project.toUpperCase().replace(/-/g, '_')}_DB_NAME`;
  if (process.env[envKey]) return process.env[envKey]!;
  const base = PROJECT_DB_MAP[project];
  return process.env.NODE_ENV === 'development' ? `${base}_dev` : base;
}

export function createDataSourceOptions(
  project: ProjectId,
  params?: Partial<DatabaseConfigParams>,
): DataSourceOptions {
  const host = params?.host ?? process.env.DB_HOST ?? 'localhost';
  const port = parseInt(
    params?.port?.toString() ?? process.env.DB_PORT ?? '5432',
    10,
  );
  const username = params?.username ?? process.env.POSTGRES_USER ?? 'postgres';
  const password = params?.password ?? process.env.POSTGRES_PASSWORD ?? 'postgres';
  const database = getDatabaseName(project);

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [join(__dirname, 'entities', '*.entity.{ts,js}')],
    migrations: [join(__dirname, 'migrations', project, '*.{ts,js}')],
    synchronize: false,
    migrationsRun: false,
    logging: process.env.NODE_ENV === 'development',
  };
}

export function createDataSource(project: ProjectId): DataSource {
  return new DataSource(createDataSourceOptions(project));
}
