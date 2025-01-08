import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: string } | jwt.JwtPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  const secret = process.env.JWT_SECRET!;

  if (!token) {
    res.status(403).send('Token required');
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).send('Invalid token');
      return;
    }

    req.user = decoded as { id: string };
    next();
  });
};
