import jwt from 'jsonwebtoken';
import User from './../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest, UserTypes } from '../types/user.types';
const SECRET = process.env.SECRET || '';

interface JwtPayload {
  _id: string;
}

const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // extract token from auth headers

  const authHeaders = req.headers['authorization'];

  if (!authHeaders) {
    return res.status(403).send({ message: 'No token found!' });
  }
  const token = authHeaders.split(' ')[1];
  try {
    // verify & decode token payload,
    const { _id } = jwt.verify(token, SECRET) as JwtPayload;
    // attempt to find user object and set to req
    const user = await User.findById({ _id });
    if (!user) return res.status(401).send({ message: 'User not found' });
    res.locals.user = user;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

export default validateUser;
