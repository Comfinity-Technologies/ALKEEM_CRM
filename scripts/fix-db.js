const net = require('net');
const { execSync } = require('child_process');
const fs = require('fs');

const regions = [
  'ap-south-1',
  'eu-central-1',
  'us-east-1',
  'ap-southeast-1',
  'eu-west-1',
  'eu-west-2'
];

async function checkPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2500);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function run() {
  console.log("Scanning Supabase pooler regions...");
  let foundHost = null;
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const isUp = await checkPort(host, 6543);
    if (isUp) {
      console.log(`✅ Found active pooler in region: ${region}`);
      foundHost = host;
      break;
    }
  }

  if (foundHost) {
    console.log(`Attempting Prisma push with ${foundHost}...`);
    // Read .env, replace DATABASE_URL
    let envContent = fs.readFileSync('.env', 'utf-8');
    const newUrl = `postgresql://postgres.vxglaumiectsamdraxrz:cME4E1aXXQj9wHvN@${foundHost}:6543/postgres?pgbouncer=true&connection_limit=1`;
    envContent = envContent.replace(/DATABASE_URL=".+"/, `DATABASE_URL="${newUrl}"`);
    fs.writeFileSync('.env', envContent);
    
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log("✅ Prisma DB Push successful!");
      execSync('npm run db:seed', { stdio: 'inherit' });
      console.log("✅ DB Seed successful!");
    } catch (err) {
      console.error("❌ Prisma command failed.");
    }
  } else {
    console.log("❌ Could not reach any Supabase poolers.");
  }
}
run();
