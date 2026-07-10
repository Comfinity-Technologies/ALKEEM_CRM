import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/properties — List all properties in the database.
 */
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ properties, count: properties.length });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

/**
 * POST /api/properties — Add a new property listing.
 * Body: { title, type, location, price, beds?, baths?, source? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, location, price, beds, baths, source } = body;

    if (!title || !type || !location || price === undefined) {
      return NextResponse.json(
        { error: "title, type, location, and price are required" },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        title,
        type,
        location,
        price: Number(price),
        beds: beds ? Number(beds) : null,
        baths: baths ? Number(baths) : null,
        source: source || "Internal",
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
