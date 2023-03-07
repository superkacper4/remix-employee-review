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
      },
      { message: "A jak bardzo?", userId },
      { message: "A suprer jest?", userId },
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
          [prop]: undefined || null,
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
          review: { not: undefined || null },
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
          managerReview: undefined || null,
        },
      },
      email: true,
      id: true,
    },
  });
}
