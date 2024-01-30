import { createRouter, TestDatabase } from '@internal/plugin-test-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const db = await TestDatabase.create({
    database: env.database
  });

  return await createRouter({
    logger: env.logger,
    database: db,
  });
}