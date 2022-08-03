import { Request, Response } from 'express';
import ApiResponse from '~/utils/apiResponse';
import { SecurityPermission } from '~/utils';
import { AuthService } from '.';
import { Info } from './types';

export default [
  {
    path: '/gettoken',
    method: 'post',
    security: 'UNPROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info: Info = {
        ...req.body
      };
      AuthService.getAuthToken(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
];
