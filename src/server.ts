import 'module-alias/register';

import { Config } from './utils/config';
export const AppConfig = new Config();

import './utils/handleCrash';

import http from 'http';
import express from 'express';

import { applyMiddleware, applyRouteSets } from './utils';

import servicesRoutes from './services';

import middleware from './middleware';

const router = express();
router.disable('x-powered-by');
router.use(function (_, res, next) {
  res.setHeader('X-Powered-By', 'Htquangg');
  next();
});
applyMiddleware(middleware, router);
applyRouteSets(servicesRoutes, router);

const server = http.createServer(router);

export default server;
