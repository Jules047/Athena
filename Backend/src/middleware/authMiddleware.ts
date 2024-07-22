import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDEsInByZW5vbSI6InNzc3MiLCJyb2xlIjoiQ2xpZW50IiwiaWF0IjoxNzIxMzk4MTczLCJleHAiOjE3MjE0MDE3NzN9.woQ46oKNDRt1q_Y-349fZ5Fbe13YJ7lAS5NaEZ2Yqz8');
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
