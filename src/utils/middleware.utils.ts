import jwt from 'jsonwebtoken';
import Customer from '../database/models/models.customer';
import DeliveryGuy from '../database/models/models.deliveryGuy';
import Vendor from '../database/models/models.vendor';
import { NextFunction,  Response } from 'express';



export const protectRoute = async (req:any, res:Response, next:NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  try {
    const decoded:any = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, role } = decoded;

    let user;
    switch (role) {
      case 'Customer':
        user = await Customer.findById(userId);
        break;
      case 'Vendor':
        user = await Vendor.findById(userId);
        break;
      case 'DeliveryGuy':
        user = await DeliveryGuy.findById(userId);
        break;
      default:
        return res.status(401).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

 
    req.user = user;
    req.role = role;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
