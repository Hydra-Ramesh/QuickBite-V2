import User from '../models/user.model.js';

export const findByEmail = (email) => 
    User.findOne({ email});

export const createUser = (data) =>
    User.create(data);

export const updateUserRole = (id, role) =>
    User.findByIdAndUpdate(id, { role }, { new: true });