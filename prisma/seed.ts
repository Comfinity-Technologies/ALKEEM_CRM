import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // hashing the admin password (admin123)
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // creating a super admin so we can actually log in
  const superAdmin = await prisma.user.upsert({
    where: { email: 'super@al-alkeem.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'super@al-alkeem.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      password: hashedPassword,
    },
  });

  console.log('✅ seeded the super admin account');

  const properties = [
    {
      title: 'Spacious 1BR Apartment in Ajman Downtown',
      type: 'Apartment',
      location: 'Ajman Downtown',
      price: 25000,
      beds: 1,
      baths: 2,
      source: 'Internal'
    },
    {
      title: 'Luxury 2BR with Sea View',
      type: 'Apartment',
      location: 'Corniche Ajman',
      price: 45000,
      beds: 2,
      baths: 3,
      source: 'Internal'
    },
    {
      title: 'Affordable Studio in Al Rashidiya',
      type: 'Studio',
      location: 'Al Rashidiya',
      price: 15000,
      beds: 0,
      baths: 1,
      source: 'Internal'
    }
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log('✅ seeded the properties');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
