import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/ApiError';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Token not provided');
    }

    const secret = process.env.JWT_SECRET!;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.user = decoded;
  
      next();
    });

    console.log('AUTH MIDDLEWARE: ', req)

    // req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.error('Auth error:', error);

    if (error === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if (error === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(new UnauthorizedError('Authentication failed'));
    }
  }
};