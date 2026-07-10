const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping old fake properties...");
  await prisma.property.deleteMany({});

  console.log("Reading real properties from src/data/properties.json...");
  const dataPath = path.join(__dirname, "../src/data/properties.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  for (const p of data) {
    // Clean up price (e.g. "25,000 AED/year" -> 25000)
    let cleanPrice = 0;
    if (typeof p.price === "string") {
      cleanPrice = parseInt(p.price.replace(/[^\d]/g, ""), 10) || 0;
    }

    // Clean up beds (e.g. "studio" -> 0, "3" -> 3)
    let beds = 0;
    if (String(p.bedrooms).toLowerCase().includes("studio")) {
      beds = 0;
    } else {
      beds = parseInt(p.bedrooms, 10) || 0;
    }

    const baths = parseInt(p.bathrooms, 10) || 0;

    await prisma.property.create({
      data: {
        title: p.title,
        location: p.location,
        type: p.type,
        price: cleanPrice,
        beds: beds,
        baths: baths,
        source: "Property Finder",
        externalId: p.id,
        rawDataJson: JSON.stringify(p)
      }
    });
  }

  console.log(`Successfully inserted ${data.length} real properties into the database!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
