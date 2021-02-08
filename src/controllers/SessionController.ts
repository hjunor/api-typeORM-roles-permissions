import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import Bcrypt from '../helpers/bcrypt';
import UserRepository from '../repositories/UserRepository';
import { generateJwt } from '../helpers/jwt';
import User from '../models/User';
class sessionController {
  async create(request: Request, response: Response) {
    const { username, password } = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const user: User | undefined = await userRepository.findOne(
      { username },
      { relations: ['roles'] },
    );

    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }

    const matchPassword = Bcrypt.compared(password, user.password);

    if (!matchPassword) {
      return response
        .status(400)
        .json({ error: ' Incorrect password or username  ' });
    }

    const roles = user.roles.map((user) => user.name);

    const jwt = generateJwt({
      id: user.id,
      roles: roles,
      expiresIN: 'id',
    });

    return response.status(400).json({
      data: { username },
      metadata: { token: jwt },
      message: 'success login',
    });
  }
}

export default new sessionController();
