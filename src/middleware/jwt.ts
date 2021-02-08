import { NextFunction } from 'express';
import { verifyJwt, getTokenFromHeaders } from '../helpers/jwt';
import { Response, Request } from 'express';

const pathExchuded = (path: string) => {
  const excludePaths = ['/auth/sign-in', '/auth/sign-up', '/auth/refresh'];

  const isExcluded = !!excludePaths.find((isPath) => isPath.startsWith(path));

  return isExcluded;
};

const checkJwt = (request: Request, response: Response, next: NextFunction) => {
  const { url: path } = request;

  if (pathExchuded(path)) return next();

  const token = getTokenFromHeaders(request.headers);

  if (!token) {
    return response
      .status(404)
      .json({ metadata: {}, data: null, message: 'Invalid token' });
  }

  try {
    const decoded: any = verifyJwt(token);
    request.id = decoded.id;
  } catch (error) {
    return response
      .status(400)
      .json({ metadata: {}, data: null, message: 'Invalid token' });
  }

  next();
};

export { checkJwt, pathExchuded };
