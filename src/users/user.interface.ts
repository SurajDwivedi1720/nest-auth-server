export interface IUser {
  [x: string]: any;
  id: string;
  email: string;
  name: string;
  password: string;
  sessionId: string | null;
}

export interface IUserWithoutPassword {
  id: string;
  email: string;
  name: string;
  sessionId: string | null;
}

export interface IUserService {
  findOne(email: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
  updateSessionId(email: string, sessionId: string | null): Promise<void>;
}
