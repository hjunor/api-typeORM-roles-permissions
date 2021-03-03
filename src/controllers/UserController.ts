import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import Bcrypt from '../helpers/bcrypt';
import UserRepository from '../repositories/UserRepository';
import UserValidator from '../Validator/UserValidator';
import { userIntercafe } from '../helpers/interfaces';
import { generateJwt } from '../helpers/jwt';
import RolesRepository from '../repositories/RoleRepository';
import Role from '../models/Role';

dotenv.config();
class UserControllers {
  async create(request: Request, response: Response) {
    const { name, username, password, role, secret } = request.body;
    const secretENV = process.env.SECRET;
    const userRepository = getCustomRepository(UserRepository);
    const roleRepository = getCustomRepository(RolesRepository);

    const existUser = await UserValidator.username(username);

    if (existUser) {
      return response.status(400).json({
        data: { username, name },
        meta: {},
        message: 'params invalid',
        status: 400,
      });
    }

    const [existsRoles]: any = await roleRepository.findByIds(role);

    if (!existsRoles) {
      return response.status(400).json({
        data: { username, name },
        meta: {},
        message: 'roles invalid',
        status: 400,
      });
    }

    switch (existsRoles.name) {
      case 'ROLE_ADM': {
        if (secret === secretENV) {
          const passwordHashed = await Bcrypt.hashed(password);

          const user: userIntercafe = userRepository.create({
            name,
            username,
            password: passwordHashed,
            roles: existsRoles,
          });

          const { id } = await userRepository.save(user);

          const jwt = generateJwt({ id, role, expiresIN: 'id' });

          delete user.password;

          return response.status(201).json({
            data: {
              name: user.name,
              username: user.username,
              roles: user.roles,
            },
            metadata: { token: jwt },
            message: 'create success',
          });
        } else {
          const role = existsRoles.name;
          return response.status(400).json({
            data: { username, name },
            meta: {},
            message: 'params invalid',
            status: 400,
          });
        }
      }
      default: {
        const passwordHashed = await Bcrypt.hashed(password);

        const user: userIntercafe = userRepository.create({
          name,
          username,
          password: passwordHashed,
          roles: existsRoles,
        });

        const { id } = await userRepository.save(user);

        const jwt = generateJwt({ id, role, expiresIN: 'id' });

        delete user.password;

        return response.status(201).json({
          data: { name: user.name, username: user.username, roles: user.roles },
          metadata: { token: jwt },
          message: 'create success',
        });
      }
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const userRepository = getCustomRepository(UserRepository);

    const user = await UserValidator.id(id);

    if (!user) {
      return response.status(400).json({
        data: { id },
        meta: {},
        message: 'credencias invalid',
        status: 400,
      });
    }

    const deleteUser = userRepository.delete(id);

    if (!deleteUser) {
      return response.status(400).json({
        data: { deleteUser },
        meta: {},
        message: 'user not exists ',
        status: 400,
      });
    }

    return response.status(201).json({
      data: { id },
      metadata: {},
      message: 'delete success',
    });
  }

  async index(request: Request, response: Response) {
    const userRepository = getCustomRepository(UserRepository);

    const users = await userRepository.find({ relations: ['roles'] });

    const userList = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.roles,
      };
    });

    return response.status(201).json({
      data: { userList },
      metadata: {},
      message: 'list users success',
    });
  }
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { body } = request;
    const fields = ['name', 'username', 'password'];

    const userRepository = getCustomRepository(UserRepository);

    const user: any = await userRepository.findOne(id);

    if (!user) {
      return response.status(400).json({
        data: { id },
        metadata: {},
        message: 'Role not exists',
      });
    }

    fields.map((fildName) => {
      const newValue = body[fildName];
      if (newValue != undefined) {
        user[fildName] = newValue;
      }
    });

    const updateUser = await userRepository.update(id, user);

    return response.status(201).json({
      data: { updateUser },
      metadata: {},
      message: 'User update success',
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne(id);

    if (!user) {
      return response.status(201).json({
        data: { id },
        metadata: {},
        message: 'User not exixts',
      });
    }

    await userRepository.delete(id);

    return response.status(201).json({
      data: { id },
      metadata: {},
      message: 'User delete success',
    });
  }
}

export default new UserControllers();
