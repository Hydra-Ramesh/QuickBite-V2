import axios from 'axios';
import { oauth2Client } from '../config/google.js';
import * as userRepo from '../repositories/user.repository.js';
import { generateToken } from '../utils/jwt.js';
import AppError from '../utils/app-error.js';

export const loginWithGoogle = async (code) => {
  if (!code) {
    throw new AppError('Authorization code is required', 400);
  }
  const googleRes = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
  );

  const { email, name, picture } = userRes.data;
  let user = await userRepo.findByEmail(email);
  if (!user) {
    user = await userRepo.createUser({
      email,
      name,
      image: picture,
    });
  }

  const token = generateToken(user);
  return { user, token };
};

export const updateRole = async (id, role) => {
  const user = await userRepo.updateUserRole(id, role);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const token = generateToken(user);
  return { user, token };
};
