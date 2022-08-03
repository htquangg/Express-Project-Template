import prisma from '~/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';

const SALT_ROUNDS = 10;

async function get(info: Pick<User, 'username' | 'password'>) {
  try {
    const player = await prisma.user.findUnique({
      where: {
        username: info.username,
      },
    });

    if (!player) {
      return Promise.reject('Could not find user!');
    }

    return Promise.resolve(player);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function create(
  info: WithRequired<Partial<User>, 'username' | 'password'>,
) {
  try {
    const userDto = getUserDto(info);

    // generate salt
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashPassword = await bcrypt.hash(userDto.password, salt);

    const user = await prisma.user.create({
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

async function update(info: WithRequired<Partial<User>, 'id'>) {
  try {
    let player = await get(info);
    if (player) {
      const { id, ...restPlayer } = player;
      player = await prisma.player.update({
        where: {
          playerID: info.playerID,
        },
        data: {
          ...restPlayer,
          ...info,
        },
      });
      return Promise.resolve(player);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getUserDto(info: Pick<User, 'username' | 'password'>): User {
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
  const userInfo = await get(info);
  return await bcrypt.compare(info.password, userInfo.password);
}

export { get, create, update, check };
