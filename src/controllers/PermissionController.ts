import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import PermissionRepository from '../repositories/PermissionRepository';

class PermissionController {
  async create(request: Request, response: Response) {
    const { name, description } = request.body;
    const permissionRepository = getCustomRepository(PermissionRepository);
    const existPermission = await permissionRepository.findOne({ name });
    if (existPermission) {
      return response.status(400).json({
        data: {},
        metadata: {},
        message: 'Permission already exixts',
      });
    }
    const permission = permissionRepository.create({
      name,
      description,
    });
    await permissionRepository.save(permission);

    return response.status(200).json({
      data: { ...permission },
      metadata: {},
      message: 'Permission save success',
    });
  }
  async index(request: Request, response: Response) {
    const permissionRepository = getCustomRepository(PermissionRepository);
    const permissions = await permissionRepository.find();
    return response.status(201).json({
      data: [...permissions],
      metadata: {},
      message: 'list permission susses',
    });
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const permissionRepository = getCustomRepository(PermissionRepository);
    const permission = await permissionRepository.findOne(id);

    if (!permission) {
      return response.status(201).json({
        data: { id },
        metadata: {},
        message: 'Permission  not exists',
      });
    }
    return response.status(201).json({
      data: { ...permission },
      metadata: {},
      message: 'list id permission',
    });
  }
  async update(request: Request, response: Response) {
    const { id } = request.params;

    const { body } = request;

    const fields = ['name', 'description'];

    const permissionRepository = getCustomRepository(PermissionRepository);
    const permission: any = await permissionRepository.findOne(id);

    if (!permission) {
      return response.status(400).json({
        data: { id },
        metadata: {},
        message: 'Permission  not exists',
      });
    }

    fields.map((fildName) => {
      const newValue = body[fildName];
      if (newValue != undefined) {
        permission[fildName] = newValue;
      }
    });

    const updatePermission = await permissionRepository.update(id, permission);

    return response.status(201).json({
      data: { updatePermission },
      metadata: {},
      message: 'Permission update success',
    });
  }
  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const permissionRepository = getCustomRepository(PermissionRepository);
    const permission = await permissionRepository.delete(id);

    if (!permission) {
      return response.status(201).json({
        data: { id },
        metadata: {},
        message: 'Permission  not exists',
      });
    }
    return response.status(201).json({
      data: { ...permission },
      metadata: {},
      message: 'delete permission success',
    });
  }
}

export default new PermissionController();
