import { Prisma } from "@prisma/client";
import { PasswordsE, UsersE } from "../entity";

type UserSingleReturn = Promise<Prisma.UsersGetPayload<{}> | null>;

export interface UserRepositoryI {
  getUserById: (id: UsersE["id"]) => UserSingleReturn;
  getUserByEmail: (email: UsersE["email"]) => UserSingleReturn;
  createUser: (
    email: UsersE["email"],
    password: PasswordsE["hash"],
  ) => Promise<UsersE>;
  deleteUserByEmail: (email: UsersE["email"]) => UserSingleReturn;
  verifyPassword: (
    email: UsersE["email"],
    password: PasswordsE["hash"],
  ) => Promise<UsersE | null>;
}
