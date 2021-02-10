import { Router } from 'express';
import RoleController from '../controllers/RoleController';
import { checkJwt } from '../middleware/jwt';
import { is } from '../middleware/permission';

const RolesRouter = Router();

RolesRouter.get('/roles', checkJwt, is(['ROLE_ADM']), RoleController.index);
RolesRouter.get('/users/roles', RoleController.verify);

RolesRouter.post('/roles', checkJwt, is(['ROLE_ADM']), RoleController.create);
RolesRouter.get('/roles/:id', checkJwt, is(['ROLE_ADM']), RoleController.show);
RolesRouter.delete(
  '/roles/:id',
  checkJwt,
  is(['ROLE_ADM']),
  RoleController.delete,
);

RolesRouter.put(
  '/roles/:id',
  checkJwt,
  is(['ROLE_ADM']),
  RoleController.update,
);

export { RolesRouter };
