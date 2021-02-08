import Express from 'express';
import { UserRouter } from './user.routes';
import { RolesRouter } from './roles.routes';
import { ProductRouter } from './product.routes';
import { PermissionRouter } from './permission.routes';
const router = Express();

router.use(UserRouter, RolesRouter, ProductRouter, PermissionRouter);

export { router };
