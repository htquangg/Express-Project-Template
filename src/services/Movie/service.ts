import prisma from '~/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import type { Movie } from '@prisma/client';

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
    const user = prisma.movie.findUnique({
      where: {
        id: info.id,
      },
    });
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {
  try {
    const movies = prisma.movie.findMany();
    return Promise.resolve(movies);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function create(
  info: WithRequired<Partial<Movie>, 'title' | 'description'>,
) {
  try {
    const movieDto = getMovieDto(info);
    const movie = await prisma.movie.create({
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
