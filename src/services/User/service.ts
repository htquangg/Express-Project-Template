import prisma from '~/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';

const SALT_ROUNDS = 10;

async function getOrThrowError(info: Pick<User, 'username'>) {
  try {
    const player = await prisma.user.findFirstOrThrow({
      where: {
        username: info.username,
      },
    });
    return Promise.resolve(player);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getOne(info: Pick<User, 'username'>) {
  try {
    const user = prisma.user.findUnique({
      where: {
        username: info.username,
      },
    });
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function create(
  info: WithRequired<Partial<User>, 'username' | 'password'>,
) {
  try {
    const userDto = getUserDto(info);

    // check user info
    let user = await getOne(info);
    if (user) {
      return Promise.reject('Username is exist!');
    }

    const hashPassword = await setHashPassword(userDto.password);
    user = await prisma.user.create({
      data: {
        ...userDto,
        password: hashPassword,
      },
    });

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(info: WithRequired<Partial<User>, 'username'>) {
  try {
    let user = await getOne(info);
    if (user) {
      const { id, ...restUser } = user;

      if (info.password) {
        info.password = await setHashPassword(info.password);
      }

      user = await prisma.user.update({
        where: {
          username: info.username,
        },
        data: {
          ...restUser,
          ...info,
        },
      });

      return Promise.resolve(user);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

function getUserDto(info: Pick<User, 'username' | 'password'>): User {
  const { username, password } = info;
  const user: User = {
    id: uuidv4(),
    username,
    password,
  };
  return user;
}

async function check(
  info: Pick<User, 'username' | 'password'>,
): Promise<boolean> {
  const userInfo = await getOne(info);
  if (userInfo) {
    return await bcrypt.compare(info.password, userInfo.password);
  }
  return false;
}

async function setHashPassword(plainText: string) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(plainText, salt);
}

export { getOrThrowError, getOne, create, update, check };
