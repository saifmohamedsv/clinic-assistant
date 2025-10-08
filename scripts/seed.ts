import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      name: "Dr. Sarah Johnson",
      specialty: "General Medicine",
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      name: "Dr. Michael Smith",
      specialty: "Cardiology",
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      name: "Dr. Emily Davis",
      specialty: "Pediatrics",
    },
  });

  console.log("✅ Created doctors:", { doctor1: doctor1.id, doctor2: doctor2.id, doctor3: doctor3.id });

  // Create some sample patients
  const patient1 = await prisma.patient.create({
    data: {
      name: "John Doe",
      phone: "+1234567890",
      age: 35,
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: "Jane Smith",
      phone: "+1234567891",
      age: 28,
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      name: "Bob Johnson",
      phone: "+1234567892",
      age: 42,
    },
  });

  console.log("✅ Created sample patients");

  // Create some sample reservations for today and tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Today's reservations
  const todayReservation1 = await prisma.reservation.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      reservedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0), // 10:00 AM today
      duration: 30,
      notes: "Regular checkup",
      status: "BOOKED",
    },
  });

  const todayReservation2 = await prisma.reservation.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor1.id,
      reservedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30), // 2:30 PM today
      duration: 30,
      notes: "Follow-up appointment",
      status: "BOOKED",
    },
  });

  // Tomorrow's reservations
  const tomorrowReservation1 = await prisma.reservation.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor2.id,
      reservedAt: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0), // 9:00 AM tomorrow
      duration: 30,
      notes: "Cardiology consultation",
      status: "BOOKED",
    },
  });

  const tomorrowReservation2 = await prisma.reservation.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor3.id,
      reservedAt: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0), // 11:00 AM tomorrow
      duration: 30,
      notes: "Pediatric consultation",
      status: "BOOKED",
    },
  });

  console.log("✅ Created sample reservations");

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`- 3 doctors created`);
  console.log(`- 3 patients created`);
  console.log(`- 4 sample reservations created`);
  console.log("\n💡 Note: Working hours and days are now managed through clinic settings in the Zustand store");
  console.log("\n🔑 Doctor IDs for testing:");
  console.log(`- Dr. Sarah Johnson: ${doctor1.id}`);
  console.log(`- Dr. Michael Smith: ${doctor2.id}`);
  console.log(`- Dr. Emily Davis: ${doctor3.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
