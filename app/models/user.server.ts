import type { Password, Question, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { reduce } from "ramda";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";
import { getQuestionsMangerRevNewerThan } from "./question.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
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

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
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
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export const getSubordinates = async ({ managerId }: { managerId: string }) => {
  return await prisma.user.findMany({
    where: {
      managerId,
    },
  });
};

export const calculateBonus = async ({ userId }: { userId: string }) => {
  const questions = await getQuestionsMangerRevNewerThan({ userId });

  const bonusPercentValue = reduce(
    (acc, curVal) => {
      if (curVal?.managerReview >= curVal?.managerReviewThresshold)
        return acc + curVal.bonusPercentValue;
      return acc;
    },
    0,
    questions
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      bonusPercentValue: bonusPercentValue,
    },
  });
};
