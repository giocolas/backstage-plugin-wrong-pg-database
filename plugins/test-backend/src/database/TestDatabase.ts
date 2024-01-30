import {
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@internal/plugin-test-backend',
  'migrations'
);

export class TestDatabase {

  static async create({
    database,
  } : {
    database: PluginDatabaseManager,
    skipMigrations?: boolean
  }): Promise<TestDatabase> {
    const client = await database.getClient();

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new TestDatabase(client);
  }

  private readonly client: Knex;
  
  private constructor(client: Knex) {
    this.client = client;
  }

  async getCount(): Promise<number> {
    const result = await this.client.from('test_table').count('id');
    return result[0].count;
  }

}