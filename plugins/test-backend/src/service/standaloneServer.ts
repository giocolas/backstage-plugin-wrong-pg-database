import { createServiceBuilder, loadBackendConfig } from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';
import { TestDatabase } from '../database/TestDatabase';
import Knex from 'knex';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'test-backend' });

  const config = await loadBackendConfig({ logger, argv: process.argv });
  
  const knexInstance = Knex(config.get('backend.database'));
  const database = await TestDatabase.create({ database: { getClient: async () => knexInstance } });

  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    database,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/test', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
