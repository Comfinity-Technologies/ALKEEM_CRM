import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
    },
    {
      title: 'Modern 3BR Villa in Al Mowaihat',
      type: 'Villa',
      location: 'Al Mowaihat',
      price: 85000,
      beds: 3,
      baths: 4,
      source: 'Internal'
    },
    {
      title: 'Premium Office Space in Corniche',
      type: 'Commercial',
      location: 'Corniche Ajman',
      price: 60000,
      beds: 0,
      baths: 1,
      source: 'Internal'
    },
    {
      title: 'Cozy 1BR in Al Nuaimiya',
      type: 'Apartment',
      location: 'Al Nuaimiya',
      price: 22000,
      beds: 1,
      baths: 1,
      source: 'Internal'
    },
    {
      title: 'Large 4BR Villa for Family',
      type: 'Villa',
      location: 'Al Yasmeen',
      price: 120000,
      beds: 4,
      baths: 5,
      source: 'Internal'
    },
    {
      title: 'Well Maintained 2BR near City Centre',
      type: 'Apartment',
      location: 'Al Jurf',
      price: 38000,
      beds: 2,
      baths: 2,
      source: 'Internal'
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log('Seeded 8 properties successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
