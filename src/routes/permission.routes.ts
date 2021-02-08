import { Router } from 'express';
import PermissionController from '../controllers/PermissionController';
import { checkJwt } from '../middleware/jwt';
import { is } from '../middleware/permission';

const PermissionRouter = Router();

PermissionRouter.post(
  '/permission',
  checkJwt,
  is(['ROLE_ADM']),
  PermissionController.create,
);
PermissionRouter.get(
  '/permission',
  checkJwt,
  is(['ROLE_ADM']),
  PermissionController.index,
);
PermissionRouter.get(
  '/permission/:id',
  checkJwt,
  is(['ROLE_ADM']),
  PermissionController.show,
);
PermissionRouter.delete(
  '/permission/:id',
  checkJwt,
  is(['ROLE_ADM']),
  PermissionController.delete,
);
PermissionRouter.put(
  '/permission/:id',
  checkJwt,
  is(['ROLE_ADM']),
  PermissionController.update,
);

export { PermissionRouter };
