import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create services
  const services = await prisma.service.createMany({
    data: [
      {
        name: "Haircut",
        description: "Classic haircut with precision trimming",
        price: 3000,
        duration: 30,
        icon: "✂️",
      },
      {
        name: "Skin Fade",
        description: "Modern skin fade with clean lines",
        price: 3500,
        duration: 30,
        icon: "🪒",
      },
      {
        name: "Beard Trim",
        description: "Professional beard shaping and trim",
        price: 2000,
        duration: 20,
        icon: "🧔",
      },
      {
        name: "Full Service",
        description: "Haircut + beard trim + hot towel shave",
        price: 5000,
        duration: 60,
        icon: "⭐",
      },
      {
        name: "Hot Towel Shave",
        description: "Luxe shave with hot towel finish",
        price: 2500,
        duration: 25,
        icon: "🔥",
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✓ Created ${services.count} services`);

  // Update barbers with photos and bios
  const barbers = await prisma.user.findMany({ where: { role: "BARBER" } });
  const bios = [
    "Master barber with 8 years of experience. Specializes in modern fades and sharp lines. Your style, perfected.",
    "Beard expert and detail-oriented craftsman. Loves helping clients find their signature look.",
    "Classic cuts expert. Believer in timeless style. Will make you look like a gentleman once again.",
    "Modern style innovator. Keeps up with trends but respects the classics. Creative with every cut.",
  ];

  for (let i = 0; i < barbers.length; i++) {
    await prisma.user.update({
      where: { id: barbers[i].id },
      data: {
        bio: bios[i],
        rating: 4.8 + Math.random() * 0.2,
        ratingCount: Math.floor(Math.random() * 30) + 15,
        photoUrl: `/images/barber-${i + 1}.svg`,
      },
    });
  }
  console.log(`✓ Updated ${barbers.length} barber profiles`);

  // Create sample reviews
  const customer = await prisma.user.findUnique({
    where: { email: "alex@cuts.demo" },
  });
  if (customer && barbers.length > 0) {
    // Create a sample completed appointment
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);

    const apt = await prisma.appointment.create({
      data: {
        date: pastDate,
        duration: 30,
        service: "Haircut",
        customerId: customer.id,
        barberId: barbers[0].id,
        status: "COMPLETED",
        completedAt: pastDate,
      },
    });

    // Add review
    await prisma.review.create({
      data: {
        appointmentId: apt.id,
        customerId: customer.id,
        barberId: barbers[0].id,
        rating: 5,
        title: "Best haircut in town!",
        comment:
          "Marcus absolutely nailed it. Clean lines, great attention to detail. Will definitely be back!",
      },
    });

    console.log(`✓ Created sample review`);
  }

  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
