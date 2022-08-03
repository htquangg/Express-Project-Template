import { Express, Router } from 'express';
import cors from 'cors';
import parser from 'body-parser';

export type Wrapper = (router: Router) => void;

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(
    parser.urlencoded({
      extended: true,
      limit: '50mb',
      parameterLimit: 100000,
    }),
  );
  router.use(parser.json({ limit: '50mb' }));
};

export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  express: Express,
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(express);
  }
};

