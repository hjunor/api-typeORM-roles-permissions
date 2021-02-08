import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import ProductRepository from '../repositories/ProductRepository';

class ProductController {
  async create(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    const { name, description } = request.body;

    console.log({ name, description });

    const existProduct = await productRepository.findOne({ name });

    if (existProduct) {
      return response.status(400).json({
        data: {},
        metadata: {},
        message: 'Product already exixts',
      });
    }

    const product = productRepository.create({
      name,
      description,
    });

    await productRepository.save(product);

    return response.status(200).json({
      data: { ...product },
      metadata: {},
      message: 'Product save success',
    });
  }
  async index(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find();

    console.log(request.roles);

    return response.json({
      data: { ...products },
      metadata: {},
      message: 'List products',
    });
  }
  async show(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    const { id } = request.params;

    const product = await productRepository.findOne(id);

    return response.json({
      data: { ...product },
      metadata: {},
      message: 'Product select one',
    });
  }
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { body } = request;
    const fields = ['name', 'description'];

    const productRepository = getCustomRepository(ProductRepository);
    const product: any = await productRepository.findOne(id);

    if (!product) {
      return response.status(400).json({
        data: { id },
        metadata: {},
        message: 'Product not exists',
      });
    }

    fields.map((fildName) => {
      const newValue = body[fildName];
      if (newValue != undefined) {
        product[fildName] = newValue;
      }
    });

    const updatePermission = await productRepository.update(id, product);

    return response.status(201).json({
      data: { updatePermission },
      metadata: {},
      message: 'Product update success',
    });
  }
  async delete(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    const { id } = request.params;

    const product = await productRepository.findOne(id);

    if (!product) {
      return response.status(400).json({
        data: { id },
        metadata: {},
        message: 'Product not exists',
      });
    }

    await productRepository.delete(id);

    return response.status(201).json({
      data: { id },
      metadata: {},
      message: 'Product delete success',
    });
  }
}

export default new ProductController();
