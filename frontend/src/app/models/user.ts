// src/app/models/user.model.ts

export interface User {
    _id?: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    birthday: Date;
    contactNumber: string;
    address: string;
    role?: string; // role is optional because it defaults to 'user'
    password?: string; // password is optional for cases like editing user without changing password
  }
  