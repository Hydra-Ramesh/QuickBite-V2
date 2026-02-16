import { asyncHandler } from '../middlewares/async.middleware.js';
import * as authService from '../services/auth.service.js';


export const loginUser = asyncHandler(async (req, res)=> {
    const result = await authService.loginWithGoogle(req.body.code);
    res.json(result);
});

export const addUserRole = asyncHandler(async (req, res) => {
    const result = await authService.updateRole(req.user.id, req.body.role);
    res.json(result);
});

export const myProfile = asyncHandler(async (req, res) => {
    res.json(req.user);
});