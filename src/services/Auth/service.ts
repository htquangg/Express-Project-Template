import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiResponse from '~/utils/apiResponse';
import { UserService } from '~/services/User';
import type { Info } from './types';
import { AppConfig } from '~/server';

async function getAuthToken(info: Info) {
  const isExistUser = await UserService.check(info);

  if (!isExistUser) {
    return Promise.reject('User not found!');
  }

  const accessToken = jwt.sign(
    {
      username: info.username,
    },
    AppConfig.data.SECRET_KEY as jwt.Secret,
    { expiresIn: '30d' },
  );

  return Promise.resolve({ accessToken });
}

async function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(
      token,
      AppConfig.data.SECRET_KEY as jwt.Secret,
      async (error: any, user: any) => {
        if (error) {
          return ApiResponse.unauthorizedResponse(res, 'Unauthorized');
        }

        const userInfo = await UserService.getOne(user);

        if (!userInfo) {
          return ApiResponse.errorResponseWithData(req, res, error);
        }

        req.params.username = userInfo.username;
        next();
      },
    );
  } else {
    return ApiResponse.unauthorizedResponse(res, 'Unauthorized');
  }
}

async function verifyAuthPrivate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    req.headers.apikey === AppConfig.data.X_API_KEY ||
    req.headers['x-api-key'] === AppConfig.data.X_API_KEY
  ) {
    next();
  } else {
    return ApiResponse.unauthorizedResponse(res, 'Unauthorized');
  }
}

async function createUser(info: Info) {
  return UserService.create(info);
}

export { verifyAuthToken, verifyAuthPrivate, getAuthToken, createUser };
