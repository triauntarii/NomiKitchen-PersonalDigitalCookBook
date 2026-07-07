const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      {
        name: "Main Course",
        description: "Menu andalan yang siap bikin perut kenyang dan hati senang! 🍽️",
      },
      {
        name: "Dessert",
        description: "Manisnya pas buat menutup hari atau menutup makan. 🍰",
      },
      {
        name: "Beverage",
        description: "Segala minuman favorit, dari yang hangat sampai super menyegarkan. 🥤",
      },
      {
        name: "Healthy",
        description: "Lezat, bergizi, dan bikin tubuh tetap happy. 🥗",
      },
      {
        name: "Budget Meal",
        description: "Masak enak tanpa bikin dompet ikut diet. 💸",
      },
      {
        name: "Quick & Easy",
        description: "Lagi buru-buru? Tenang, resep ini siap dalam waktu singkat! ⚡",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });