import { superadmin } from '@/src/lib/db/seed/superadmin';

(async () => {
  try {
    await superadmin();
    console.log('🎉 Superadmin seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding superadmin:', error);
    process.exit(1);
  }
})();
