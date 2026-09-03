import { RateCard } from '../models/index.js';
import { syncDatabase } from '../config/syncDb.js';

const rateCards = [
  { originZone: 'domestic', destinationZone: 'domestic', serviceType: 'standard', pricePerKg: 2.5, baseFee: 5, currency: 'USD' },
  { originZone: 'domestic', destinationZone: 'domestic', serviceType: 'express', pricePerKg: 5.0, baseFee: 10, currency: 'USD' },
  { originZone: 'domestic', destinationZone: 'domestic', serviceType: 'priority', pricePerKg: 8.0, baseFee: 15, currency: 'USD' },
  { originZone: 'regional', destinationZone: 'regional', serviceType: 'standard', pricePerKg: 4.0, baseFee: 8, currency: 'USD' },
  { originZone: 'regional', destinationZone: 'regional', serviceType: 'express', pricePerKg: 7.0, baseFee: 12, currency: 'USD' },
  { originZone: 'regional', destinationZone: 'regional', serviceType: 'priority', pricePerKg: 10.0, baseFee: 20, currency: 'USD' },
  { originZone: 'international', destinationZone: 'international', serviceType: 'standard', pricePerKg: 6.0, baseFee: 15, currency: 'USD' },
  { originZone: 'international', destinationZone: 'international', serviceType: 'express', pricePerKg: 10.0, baseFee: 25, currency: 'USD' },
  { originZone: 'international', destinationZone: 'international', serviceType: 'priority', pricePerKg: 15.0, baseFee: 40, currency: 'USD' },
];

const seedRateCards = async () => {
  try {
    await syncDatabase();
    await RateCard.bulkCreate(rateCards, { ignoreDuplicates: true });
    console.log('Rate cards seeded successfully');
  } catch (error) {
    console.error('Error seeding rate cards:', error.message);
    process.exit(1);
  }
};

seedRateCards();
