// cron.js
import cron from 'node-cron';

export const startCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', () => {
    console.log('🕛 Cron job running: daily task');
    // Example: check unpaid rides or clean database
    // You can call your models/services here
  });

  // Example: run every hour
  cron.schedule('0 * * * *', () => {
    console.log('⏰ Cron job running hourly task');
  });
};
