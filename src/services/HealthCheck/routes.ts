import { Request, Response } from 'express';
import { SecurityPermission } from '~/utils';

export default [
  {
    path: '/',
    method: 'get',
    security: 'UNPROTECTED' as SecurityPermission,
    handler: (_: Request, res: Response) => {
      return res.send('Health Check OK!!!');
    },
  },
];
