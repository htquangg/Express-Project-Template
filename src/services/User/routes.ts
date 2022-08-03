import { Request, Response } from 'express';
import ApiResponse from '~/utils/apiResponse';
import { SecurityPermission } from '~/utils';
import { UserService } from './';

export default [
  {
    path: '/users/:username',
    method: 'get',
    security: 'PRIVATE' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        username: req.params.username,
      };
      UserService.getOne(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
  {
    path: '/users',
    method: 'put',
    security: 'PROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        ...req.body,
      };
      UserService.update(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
];
