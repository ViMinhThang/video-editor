export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  create_at?: Date;
  update_at?: Date;
}
