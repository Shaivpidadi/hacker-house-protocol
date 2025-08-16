import { seedDatabase } from '../lib/seed-data';

async function main() {
  console.log('🚀 Starting database seeding...');
  const result = await seedDatabase();
  
  if (result.success) {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } else {
    console.error('❌ Seeding failed:', result.error);
    process.exit(1);
  }
}

main().catch(console.error);
