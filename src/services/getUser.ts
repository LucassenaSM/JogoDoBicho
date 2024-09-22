import { User } from '../models/user';

export const getUser = async (data: Partial<User>): Promise<User> => {

  const newUser = new User(data.name || 'Default Name', data.email || 'default@example.com', data.cpf || 'default', data.balance || 0);
  
  return newUser;
};