import { Express, Request, Response, NextFunction } from 'express';
import { verifyAuthPrivate, verifyAuthToken } from '~/services/Auth/service';

export type Handler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

export type SecurityPermission =
  | 'UNPROTECTED'
  | 'PROTECTED'
  | 'PRIVATE'
  | 'MIDDLEWARE';

export type Route = {
  path: string;
  method: string;
  security: SecurityPermission;
  handler: Handler | Handler[];
};

export const applyRouteSets = (routeSets: Route[][], express: Express) => {
  for (const routeSet of routeSets) {
    applyRoutes(routeSet, express);
  }
};
export const applyRoutes = (routes: Route[], express: Express) => {
  for (const route of routes) {
    const { method, path, handler, security } = route;
    switch (security) {
      case 'UNPROTECTED':
        (express as any)[method](path, handler);
        break;
      case 'PROTECTED':
        if (verifyAuthToken) {
          (express as any)[method](path, verifyAuthToken, handler);
        }
        break;
      case 'PRIVATE':
        if (verifyAuthPrivate) {
          (express as any)[method](path, verifyAuthPrivate, handler);
        }
        break;
      case 'MIDDLEWARE':
        (express as any).use(path, handler);
        break;
      default:
        break;
    }
  }
};
