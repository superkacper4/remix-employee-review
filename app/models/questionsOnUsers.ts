import { prisma } from "~/db.server";

export const getQuestionsOnUser = async ({ userId }: { userId: string }) => {
  return await prisma.questionsOnUsers.findMany({
    where: {
      userId,
    },
  });
};
