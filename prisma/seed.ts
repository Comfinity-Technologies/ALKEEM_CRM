import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

function parsePrice(priceStr: string | number): number {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  // Extract only digits
  const match = priceStr.toString().replace(/,/g, '').match(/\d+/);
  return match ? parseFloat(match[0]) : 0;
}

function parseIntSafe(val: any): number | null {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'number') return val;
  const parsed = parseInt(val.toString().trim(), 10);
  return isNaN(parsed) ? null : parsed;
}

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

  // Read properties from Excel
  console.log('Reading properties from properties.xlsx...');
  const workbook = xlsx.readFile('properties.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawData: any[] = xlsx.utils.sheet_to_json(sheet);

  for (const row of rawData) {
    const title = row['title']?.toString() || 'Untitled Property';
    const type = row['type']?.toString() || 'Unknown';
    const location = row['location']?.toString() || 'Unknown Location';
    const price = parsePrice(row['price']);
    const beds = parseIntSafe(row['bedrooms']);
    const baths = parseIntSafe(row['bathrooms']);
    const externalId = row['id']?.toString();
    const source = 'Excel Import';
    
    await prisma.property.create({
      data: {
        title,
        type,
        location,
        price,
        beds,
        baths,
        externalId,
        source,
        rawDataJson: JSON.stringify(row),
      },
    });
  }

  console.log(`✅ seeded ${rawData.length} properties from Excel`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
