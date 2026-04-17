import { Request } from 'express';
import { JwtPayload } from './jwt.strategy';

export type AuthenticatedRequest = Request & {
  user: JwtPayload;
};
