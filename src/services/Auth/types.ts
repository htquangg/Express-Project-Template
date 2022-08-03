import type { User } from '@prisma/client';

export type Info = Pick<User, 'username' | 'password'>;
