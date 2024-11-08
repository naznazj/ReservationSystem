export interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthday: string;
  contactNumber: string;
  address: string;
  password: string;
  role?: 'admin' | 'user'; 
}
