import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { checkJwt } from '../middleware/jwt';
import { is } from '../middleware/permission';

const ProductRouter = Router();

ProductRouter.post(
  '/product',
  checkJwt,
  is(['ROLE_ADM']),
  ProductController.create,
);

ProductRouter.get(
  '/product',
  checkJwt,
  is(['ROLE_ADM', 'ROLE_USER', 'ROLE_Users']),
  ProductController.index,
);

ProductRouter.get(
  '/product/:id',
  checkJwt,
  is(['ROLE_ADM', 'ROLE_USER', 'ROLE_Users']),
  ProductController.show,
);

ProductRouter.put(
  '/product/:id',
  checkJwt,
  is(['ROLE_ADM']),
  ProductController.update,
);

ProductRouter.delete(
  '/product/:id',
  checkJwt,
  is(['ROLE_ADM']),
  ProductController.delete,
);

export { ProductRouter };
