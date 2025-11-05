import { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthRequest, JWT_SECRET } from './authMiddleware';
import { findUserByUsername, findUserByEmail, createUser, validatePassword, sanitizeUser } from './userService';

export function setupAuth(app: Express) {
  // Signup route
  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const existingEmail = await findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Create new user
      const user = await createUser(username, email, password);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin || false },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ user: sanitizeUser(user) });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Login route
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Find user
      const user = await findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Validate password
      const isValid = await validatePassword(user, password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin || false },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ user: sanitizeUser(user) });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Logout route
  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
  });

  // Get current user route
  app.get('/api/auth/user', authMiddleware, async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(req.user);
  });
}