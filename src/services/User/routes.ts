import { Request, Response } from 'express';
import ApiResponse from '~/utils/apiResponse';
import { SecurityPermission } from '~/helper/';
import { PlayerService } from './';

export default [
  {
    path: '/player/:playerID',
    method: 'get',
    security: 'UNPROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        playerID: req.params.playerID,
      };
      PlayerService.get(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
  {
    path: '/player',
    method: 'post',
    security: 'UNPROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        playerID: req.params.playerID,
        ...req.body,
      };
      PlayerService.update(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
];
