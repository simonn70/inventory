import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../database/models/models.customer'; // Assuming User refers to your user model

export const protectRoute = async (req: any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decoded;

    console.log(id);
    
    // Find the user by userId
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
