import { USERROLE } from './UserRole';

export interface User {
  id: number;
  name: string;
  role: USERROLE;
}
