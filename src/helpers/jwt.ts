import * as dotenv from 'dotenv';

dotenv.config();

import jwt from 'jsonwebtoken';

const tokenPrivatekey: any = process.env.JWT_PRIVATE_KEY;
const refreshTokenPrivatekey: any = process.env.JWT_PRIVATE_kEY_REFRESH;

const options = { expiresIn: '30 minutes' };
const refreshOptions = { expiresIn: '30 days' };

const generateJwt = (payload: any) => {
  return jwt.sign(payload, tokenPrivatekey, options);
};

const generateRefreshJwt = (payload: string) => {
  return jwt.sign(payload, refreshTokenPrivatekey, refreshOptions);
};

const verifyJwt = (token: string) => {
  return jwt.verify(token, tokenPrivatekey);
};

const verifyRefreshJwt = (token: string) => {
  return jwt.verify(token, refreshTokenPrivatekey);
};

const getTokenFromHeaders = (headers: any) => {
  const token = headers['authorization'];
  return token ? token.slice(7, token.length) : null;
};
export {
  generateJwt,
  generateRefreshJwt,
  verifyJwt,
  verifyRefreshJwt,
  getTokenFromHeaders,
};
