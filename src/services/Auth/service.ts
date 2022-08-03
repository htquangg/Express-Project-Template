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
    AppConfig.data.SECRET_KEY,
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
      AppConfig.data.SECRET_KEY,
      async (error: any, user: any) => {
        if (error) {
          return ApiResponse.unauthorizedResponse(res, 'Unauthorized');
        }
        try {
          const userInfo = await UserService.get(user);
          if (user) {
            req.params.username = userInfo.username;
            next();
          }
        } catch (error) {
          ApiResponse.errorResponseWithData(req, res, error);
        }
      },
    );
  }
}

export { verifyAuthToken, getAuthToken };
