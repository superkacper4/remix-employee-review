import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

export const getQuestionById = async ({
  questionId,
}: {
  questionId: string;
}) => {
  return await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });
};

export const getManyQuestionById = async ({
  questionIds,
}: {
  questionIds: string[];
}) => {
  return await prisma.question.findMany({
    where: {
      id: { in: questionIds },
    },
  });
};

export const updateQuestionById = async ({
  questionIdAndValue,
  prop,
}: {
  questionIdAndValue: { id: string; value: number };
  prop: string;
}) => {
  return await prisma.question.update({
    where: {
      id: questionIdAndValue.id,
    },
    data: {
      [prop]: questionIdAndValue.value,
    },
  });
};

export const generateStandardQuestion = async ({
  userId,
}: {
  userId: string;
}) => {
  return await prisma.question.createMany({
    data: [
      {
        message: "Czy jesteś zadowolony z pracy?",
        userId,
        managerReviewThresshold: 2,
        bonusPercentValue: 10,
      },
      {
        message: "A jak bardzo?",
        userId,
        managerReviewThresshold: 2,
        bonusPercentValue: 10,
      },
      {
        message: "A suprer jest?",
        userId,
        managerReviewThresshold: 2,
        bonusPercentValue: 10,
      },
    ],
  });
};

export async function getUsersQuestionsWithoutProp({
  id,
  prop,
}: {
  id: User["id"];
  prop: string;
}) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      questions: {
        where: {
          [prop]: 0,
        },
      },
    },
  });
}

export async function getUsersQuestionsReview({ id }: { id: User["id"] }) {
  return prisma.user.findUnique({
    where: { id },

    select: {
      questions: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          review: { not: 0 },
        },
      },
    },
  });
}

export async function getSubordinatesQuestionsWithoutReview({
  subIds,
}: {
  subIds: string[];
}) {
  return prisma.user.findMany({
    where: { id: { in: subIds } },

    select: {
      questions: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          managerReview: 0,
        },
      },
      email: true,
      id: true,
    },
  });
}

export async function getSubordinatesQuestionsWithReview({
  subIds,
}: {
  subIds: string[];
}) {
  return prisma.user.findMany({
    where: { id: { in: subIds } },

    select: {
      questions: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          managerReview: { not: 0 },
        },
      },
      email: true,
      id: true,
    },
  });
}

export async function getQuestionsMangerRevNewerThan({
  userId,
}: {
  userId: string;
}) {
  const now = new Date();

  const weekAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  ).toISOString();

  return prisma.question.findMany({
    where: {
      AND: {
        userId,
        managerReview: { not: 0 },
        createdAt: {
          gte: weekAgo,
        },
      },
    },
  });
}
