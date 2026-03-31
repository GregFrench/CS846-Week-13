import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRegister, validateLogin } from '../utils/validators.js';
import { ValidationError } from '../utils/errors.js';
import authService from '../services/AuthService.js';

const router = express.Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { error, value } = validateRegister(req.body);

    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(', '));
    }

    const result = await authService.register(value.username, value.email, value.password);

    res.status(201).json({
      user: result.user,
      token: result.token,
    });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { error, value } = validateLogin(req.body);

    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(', '));
    }

    const result = await authService.login(value.username, value.password);

    res.status(200).json({
      user: result.user,
      token: result.token,
    });
  }),
);

router.post('/logout', (req, res) => {
  // JWT is stateless, logout is handled on client-side
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
