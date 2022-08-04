import prisma from '~/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import type { Movie, Prisma } from '@prisma/client';

async function getOrThrowError(info: Pick<Movie, 'id'>) {
  try {
    const player = await prisma.user.findFirstOrThrow({
      where: {
        id: info.id,
      },
    });
    return Promise.resolve(player);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getOne(info: Pick<Movie, 'id'>) {
  try {
    const movie = prisma.movie.findUnique({
      where: {
        id: info.id,
      },
    });
    return Promise.resolve(movie);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    const movies = prisma.movie.findMany({
      include: {
        Actor: {},
      },
    });
    return Promise.resolve(movies);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function create(
  info: WithRequired<Partial<Movie>, 'title' | 'description'> & {
    actors?: Omit<Prisma.ActorCreateInput, 'Movie'>[];
  },
) {
  try {
    const movieDto = getMovieDto(info);

    let actors;
    let movie;

    if (info.actors) {
      actors = info.actors.map((actor) => {
        return {
          where: {
            id: uuidv4(),
          },
          create: {
            id: uuidv4(),
            name: actor.name,
            age: actor.age,
          },
        };
      });

      movie = await prisma.movie.create({
        data: {
          ...movieDto,
          Actor: {
            connectOrCreate: [...actors],
          },
        },
      });
      return Promise.resolve(movie);
    }
    movie = await prisma.movie.create({
      data: {
        ...movieDto,
      },
    });
    return Promise.resolve(movie);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(info: WithRequired<Partial<Movie>, 'id'>) {
  try {
    let movie = await getOne(info);
    if (movie) {
      const { id, ...restMovie } = movie;

      movie = await prisma.movie.update({
        where: {
          id: info.id,
        },
        data: {
          ...restMovie,
          ...info,
        },
      });

      return Promise.resolve(movie);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

function getMovieDto(info: Pick<Movie, 'title' | 'description'>): Movie {
  const { title, description } = info;
  const movie: Movie = {
    id: uuidv4(),
    title,
    description,
  };
  return movie;
}

export { getOrThrowError, getOne, getAll, create, update };
