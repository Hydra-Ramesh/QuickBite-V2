import express from 'express';
import {loginUser, addUserRole, myProfile} from '../controllers/auth.controller.js';
import {isAuth} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/add-role', isAuth, addUserRole);
router.get('/me', isAuth, myProfile);

export default router;