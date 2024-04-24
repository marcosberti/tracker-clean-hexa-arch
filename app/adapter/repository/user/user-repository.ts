import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { PasswordsE, UsersE } from "~/domain/entity";
import { UserRepositoryI } from "~/domain/port";

export function UserRepository(): UserRepositoryI {
  function getUserById(id: UsersE["id"]) {
    return prisma.users.findUnique({ where: { id } });
  }

  function getUserByEmail(email: UsersE["email"]) {
    return prisma.users.findUnique({ where: { email } });
  }

  async function createUser(
    email: UsersE["email"],
    password: PasswordsE["hash"],
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.users.create({
      data: {
        email,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });
  }

  function deleteUserByEmail(email: UsersE["email"]) {
    return prisma.users.delete({ where: { email } });
  }

  async function verifyPassword(
    email: UsersE["email"],
    password: PasswordsE["hash"],
  ) {
    const userWithPassword = await prisma.users.findUnique({
      where: { email },
      include: {
        password: true,
      },
    });

    if (!userWithPassword || !userWithPassword.password) {
      return null;
    }

    const isValid = await bcrypt.compare(
      password,
      userWithPassword.password.hash,
    );

    if (!isValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userWithPassword;

    return userWithoutPassword as UsersE;
  }

  return {
    getUserById,
    getUserByEmail,
    createUser,
    deleteUserByEmail,
    verifyPassword,
  };
}
