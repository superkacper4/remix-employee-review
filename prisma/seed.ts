import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "kacper@wp.pl";

  // cleanup the existing database
  await prisma.user.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.questionsOnUsers.deleteMany({});

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const question = await prisma.question.create({
    data: {
      message: "Czy jesteś zadowolony z pracy?",
    },
  });

  await prisma.questionsOnUsers.create({
    data: {
      questionId: question.id,
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
