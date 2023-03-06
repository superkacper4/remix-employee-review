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
