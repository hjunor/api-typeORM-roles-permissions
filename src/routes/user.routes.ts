import { Router } from 'express';
import SessionController from '../controllers/SessionController';
import UserController from '../controllers/UserController';
import { checkJwt } from '../middleware/jwt';
import { is } from '../middleware/permission';

const UserRouter = Router();

UserRouter.post('/sign-up', UserController.create);

UserRouter.post('/sign-in', SessionController.create);

UserRouter.get('/user', checkJwt, is(['ROLE_ADM']), UserController.index);

UserRouter.put('/user:id', checkJwt, is(['ROLE_ADM']), UserController.update);

UserRouter.get('/user:id', checkJwt, is(['ROLE_ADM']), UserController.show);

UserRouter.delete(
  '/user/:id',
  checkJwt,
  is(['ROLE_ADM']),
  UserController.delete,
);

export { UserRouter };
