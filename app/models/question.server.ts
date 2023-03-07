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
}: {
  questionIdAndValue: { id: string; value: number };
}) => {
  return await prisma.question.update({
    where: {
      id: questionIdAndValue.id,
    },
    data: {
      review: questionIdAndValue.value,
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
