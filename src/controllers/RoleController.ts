import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../models/User';
import PermissionRepository from '../repositories/PermissionRepository';
import RolesRepository from '../repositories/RoleRepository';
import RoleRepository from '../repositories/RoleRepository';
import UserRepository from '../repositories/UserRepository';
class RoleController {
  async create(request: Request, response: Response) {
    const roleRepository = getCustomRepository(RoleRepository);
    const permissionRepository = getCustomRepository(PermissionRepository);

    const { name, description, permission } = request.body;

    const existRole = await roleRepository.findOne({ name });

    if (existRole) {
      return response.status(400).json({ error: 'Role already exixts' });
    }

    const existPermissions = await permissionRepository.findByIds(permission);

    const role = await roleRepository.create({
      name,
      description,
      permission: existPermissions,
    });

    await roleRepository.save(role);

    return response.status(200).json({
      data: role,
      metadata: {},
      message: 'role save success',
    });
  }
  async index(request: Request, response: Response) {
    const roleRepository = getCustomRepository(RolesRepository);

    const roles = await roleRepository.find();

    const rolesList = roles.map((role) => {
      return { id: role.id, name: role.name };
    });

    return response.status(201).json({
      data: { rolesList },
      metadata: {},
      message: 'list roles success',
    });
  }
  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const roleRepository = getCustomRepository(RolesRepository);

    const roles = await roleRepository.findOne(id);

    if (!roles) {
      return response.status(400).json({
        data: { id },
        metadata: {},
        message: 'role not exists',
      });
    }

    await roleRepository.delete(id);

    return response.status(201).json({
      data: { id },
      metadata: {},
      message: 'role excuxed in success',
    });
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const roleRepository = getCustomRepository(RolesRepository);

    const role = await roleRepository.findOne(id);

    if (!role) {
      return response.status(400).json({
        data: { id },
        metadata: {},
        message: 'role not exists',
      });
    }

    return response.status(201).json({
      data: role,
      metadata: {},
      message: 'role excuxed in success',
    });
  }
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { body } = request;
    const fields = ['name', 'description'];

    const roleRepository = getCustomRepository(RoleRepository);
    const role: any = await roleRepository.findOne(id);

    if (!role) {
      return response.status(400).json({
        data: { id },
        metadata: {},
        message: 'Role not exists',
      });
    }

    fields.map((fildName) => {
      const newValue = body[fildName];
      if (newValue != undefined) {
        role[fildName] = newValue;
      }
    });

    const updateRole = await roleRepository.update(id, role);

    return response.status(201).json({
      data: { updateRole },
      metadata: {},
      message: 'Product update success',
    });
  }
  async verify(request: Request, response: Response) {
    const authHeader = request.headers.authorization || '';

    const userRepository = getCustomRepository(UserRepository);

    const [, token] = authHeader?.split(' ');

    try {
      if (!token) {
        return response.status(400).json({ error: 'Not authorized' });
      }

      const payload = decode(token);

      if (!payload) {
        return response.status(400).json({ error: 'Not authorized' });
      }

      const user: User | any = userRepository.findOne(payload?.sup, {
        relations: ['roles'],
      });

      const roles = user?.roles.map((r: any) => r.name);

      return response.json(roles);
    } catch (error) {
      return response.status(400).json({ error: 'Not authorized roles error' });
    }
  }
}

export default new RoleController();
