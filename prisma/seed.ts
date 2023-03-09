import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "a@wp.pl";

  // cleanup the existing database
  await prisma.user.deleteMany({});
  await prisma.question.deleteMany({});

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user1 = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "b@wp.pl",
      managerId: user1.id,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      message: "Czy jesteś zadowolony/a z pracy?",
      userId: user1.id,
    },
  });

  await prisma.question.create({
    data: {
      message: "Czy jesteś zadowolony/a z pracy?",
      userId: user2.id,
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
