import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';

async function decoder(request: Request): Promise<User | undefined> {
  const { id } = request;

  const userRepository = getCustomRepository(UserRepository);

  const user = userRepository.findOne(id, { relations: ['roles'] });

  return user;
}

function is(role: String[]) {
  const roleAuthorized = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const user = await decoder(request);

    const userRoles = user?.roles.map((role) => role.name);

    const existsRoles = userRoles?.some((r) => role.includes(r));

    if (existsRoles) {
      return next();
    }

    return response.status(401).json({ message: 'Not authorized 333' });
  };
  return roleAuthorized;
}

export { is };
