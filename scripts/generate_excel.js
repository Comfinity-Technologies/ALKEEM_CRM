const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const properties = [
  {
    id: "prop-1",
    title: "1-Bedroom Accommodation Available for Staff/Labor",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "25,000 AED/year",
    bedrooms: "1",
    bathrooms: "1",
    size: "700 sqft",
    listed: "16 days ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-105123769.html"
  },
  {
    id: "prop-2",
    title: "3-Bedroom Unit with own bathrooms - Al Riffa RAK",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Villa",
    price: "55,000 AED/year",
    bedrooms: "3",
    bathrooms: "3",
    size: "1,200 sqft",
    listed: "16 days ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/villa-for-rent-ras-al-khaimah-al-riffa-105124554.html"
  },
  {
    id: "prop-3",
    title: "Luxury 6-Bedroom Villa for Rent in Al Refaa, RAK",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Villa",
    price: "250,000 AED/year",
    bedrooms: "6",
    bathrooms: "7",
    size: "5,000 sqft",
    listed: "16 days ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/villa-for-rent-ras-al-khaimah-al-riffa-105123296.html"
  },
  {
    id: "prop-4",
    title: "Family Studio for Rent – Gated Compound | Al Refaa",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "3,000 AED/month",
    bedrooms: "Studio",
    bathrooms: "1",
    size: "500 sqft",
    listed: "1 month ago",
    status: "Reserved",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-89205205.html"
  },
  {
    id: "prop-5",
    title: "Studio for Rent – Al Jazeerah Opposite ADNOC Pump",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Apartment",
    price: "23,000 AED/year",
    bedrooms: "Studio",
    bathrooms: "1",
    size: "500 sqft",
    listed: "1 month ago",
    status: "Offer",
    link: "https://www.propertyfinder.ae/en/plp/rent/apartment-for-rent-ras-al-khaimah-al-riffa-89201184.html"
  },
  {
    id: "prop-6",
    title: "Unfurnished 1Bedroom Unit – Ideal for Staff/Family",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "25,000 AED/year",
    bedrooms: "1",
    bathrooms: "1",
    size: "650 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-89198930.html"
  },
  {
    id: "prop-7",
    title: "Brand NEW Modern Family Compound for Rent - Yearly",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "23,000 AED/year",
    bedrooms: "Studio",
    bathrooms: "1",
    size: "500 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-89196070.html"
  },
  {
    id: "prop-8",
    title: "3bedroom Villa For Rent - Family or Staff Accom",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Villa",
    price: "65,000 AED/year",
    bedrooms: "3",
    bathrooms: "3",
    size: "1,400 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/villa-for-rent-ras-al-khaimah-al-riffa-89194580.html"
  },
  {
    id: "prop-9",
    title: "2-Bedroom Accommodation Available for Staff/Labor",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "35,000 AED/year",
    bedrooms: "2",
    bathrooms: "2",
    size: "1,200 sqft",
    listed: "16 days ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-105123705.html"
  },
  {
    id: "prop-10",
    title: "Modern Unfurnished Room for Rent – Yearly Basis",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "22,000 AED/year",
    bedrooms: "Studio",
    bathrooms: "1",
    size: "450 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-89206503.html"
  },
  {
    id: "prop-11",
    title: "1-Bedroom Labor Accommodation Available – RAK",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "21,000 AED/year",
    bedrooms: "1",
    bathrooms: "1",
    size: "600 sqft",
    listed: "16 days ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-105124225.html"
  },
  {
    id: "prop-12",
    title: "Furnished 2-Bedroom Villa for Rent – Al Jazeerah",
    location: "Al Jazirah Al Hamra, Al Hamra Village, Ras Al Khaimah",
    type: "Villa",
    price: "7,000 AED/month",
    bedrooms: "2",
    bathrooms: "2",
    size: "1,200 sqft",
    listed: "16 days ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/villa-for-rent-ras-al-khaimah-al-hamra-village-al-jazirah-al-hamra-105125112.html"
  },
  {
    id: "prop-13",
    title: "Furnished Studio for Rent – Monthly Basis",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Apartment",
    price: "3,000 AED/month",
    bedrooms: "Studio",
    bathrooms: "1",
    size: "500 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/apartment-for-rent-ras-al-khaimah-al-riffa-89204374.html"
  },
  {
    id: "prop-14",
    title: "1 Bedroom Apartment for Rent – Opposite Adnoc",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Apartment",
    price: "35,000 AED/year",
    bedrooms: "1",
    bathrooms: "1",
    size: "800 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/apartment-for-rent-ras-al-khaimah-al-riffa-89201482.html"
  },
  {
    id: "prop-15",
    title: "Spacious 2-Bedroom Staff Accommodation in Al Refaa",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "35,000 AED/year",
    bedrooms: "2",
    bathrooms: "2",
    size: "1,000 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-90488829.html"
  },
  {
    id: "prop-16",
    title: "Standard Semi-Furnished Room for Rent",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "2,000 AED/month",
    bedrooms: "Studio",
    bathrooms: "1",
    size: "400 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-89206232.html"
  },
  {
    id: "prop-17",
    title: "Furnished Studio for Rent – Monthly Basis",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Compound",
    price: "2,500 AED/month",
    bedrooms: "Studio",
    bathrooms: "1",
    size: "400 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/compound-for-rent-ras-al-khaimah-al-riffa-89205813.html"
  },
  {
    id: "prop-18",
    title: "Spacious 8bedroom Villa For Rent Yearly",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Villa",
    price: "130,000 AED/year",
    bedrooms: "8",
    bathrooms: "7",
    size: "10,000 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/villa-for-rent-ras-al-khaimah-al-riffa-89195193.html"
  },
  {
    id: "prop-19",
    title: "3BR Family & Staff Accommodation | Ready to Move",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Villa",
    price: "55,000 AED/year",
    bedrooms: "3",
    bathrooms: "2",
    size: "1,500 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/villa-for-rent-ras-al-khaimah-al-riffa-90059796.html"
  },
  {
    id: "prop-20",
    title: "20 Rooms Staff Accommodation Opposite Al Jazeerah",
    location: "Al Riffa, Ras Al Khaimah",
    type: "Bulk Rent Unit",
    price: "400,000 AED/year",
    bedrooms: "20",
    bathrooms: "20",
    size: "9,000 sqft",
    listed: "1 month ago",
    status: "Available",
    link: "https://www.propertyfinder.ae/en/plp/rent/bulk-rent-unit-for-rent-ras-al-khaimah-al-riffa-90488966.html"
  }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(properties);
XLSX.utils.book_append_sheet(wb, ws, "Properties");

const outputPath = path.join(__dirname, '..', 'properties.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('Successfully generated properties.xlsx at:', outputPath);
