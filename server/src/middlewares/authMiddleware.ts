// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';

// const authenticate = (req: Request, res: Response, next: NextFunction) => {
//    const token = req.header("Authorization")?.replace("Bearer ", "");

//    if (!token) {
//       return res.status(401).json({ message: "Authorization token is missing" });
//    }

//    try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
//       req.user = decoded;
//       next();
//    } catch (error) {
//       return res.status(401).json({ message: "Invalid token" });
//    }
// };
