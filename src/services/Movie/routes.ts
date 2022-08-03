import { Request, Response } from 'express';
import ApiResponse from '~/utils/apiResponse';
import { SecurityPermission } from '~/utils';
import { MovieService } from './';

export default [
  {
    path: '/movies',
    method: 'get',
    security: 'PROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        username: req.params.username,
      };
      MovieService.getAll()
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
  {
    path: '/movies',
    method: 'post',
    security: 'PROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        ...req.body,
      };
      MovieService.create(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
  {
    path: '/movies/:movieId',
    method: 'get',
    security: 'PROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        id: req.params.movieId,
      };
      MovieService.getOne(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
  {
    path: '/movies/:movieId',
    method: 'put',
    security: 'PROTECTED' as SecurityPermission,
    handler: (req: Request, res: Response) => {
      const info = {
        id: req.params.movieId,
        ...req.body,
      };
      MovieService.update(info)
        .then((data: any) => {
          ApiResponse.successResponseWithData(req, res, data);
        })
        .catch((error: any) => {
          ApiResponse.errorResponseWithData(req, res, error);
        });
    },
  },
];
