import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

const isAuthPayload = (value: unknown): value is { id: number; email: string } => {
  if (typeof value !== 'object' || value === null) return false;
  const payload = value as Record<string, unknown>;
  return typeof payload.id === 'number' && typeof payload.email === 'string';
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = header.slice('Bearer '.length).trim();
  const secret = process.env.JWT_SECRET;    
  if (!token || !secret) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  try {
    const decoded = jwt.verify(token, secret);
    if (!isAuthPayload(decoded)) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};