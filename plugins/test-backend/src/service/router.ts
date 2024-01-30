import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { TestDatabase } from '../database';

export interface RouterOptions {
  logger: Logger;
  database: TestDatabase;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;

  logger.info(`Initializing Test Plugin`);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/get', async (_, response) => {
    logger.info('GET!');
    response.status(200).json({
      'count': await database.getCount()
    });
  });

  router.use(errorHandler());
  return router;
}
