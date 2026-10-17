import { SelfPurchaseRequest, SelfPurchaseItem } from '../models/index.js';

const sampleRequests = [
  {
    requestId: 'PA-260514',
    status: 'Converted to Shipment',
    freightMode: 'air',
    customerType: 'Individual',
    addInsurance: true,
    confirmTerms: true,
    specialInstruction: 'Fragile items. Handle with care.',
    items: [
      {
        trackingNumber: '1Z999AA101234567840',
        itemSource: 'Online Store',
        storeName: 'Amazon',
        productCategory: 'Electronics',
        productDescription: 'Apple AirPods Pro 2nd Gen',
        quantity: 1,
        invoiceValue: 249.00,
        productLink: 'https://www.amazon.com/dp/example',
      },
      {
        trackingNumber: '1Z999AA101234567840-2',
        itemSource: 'Online Store',
        storeName: 'Amazon',
        productCategory: 'Electronics',
        productDescription: 'Apple Watch Series 9',
        quantity: 1,
        invoiceValue: 399.00,
        productLink: 'https://www.amazon.com/dp/example2',
      },
    ],
  },
  {
    requestId: 'PA-260513',
    status: 'Need More Information',
    freightMode: 'air',
    customerType: 'Individual',
    addInsurance: false,
    confirmTerms: true,
    specialInstruction: 'Please provide additional invoice.',
    items: [
      {
        trackingNumber: '1Z999AA101234567841',
        itemSource: 'Individual Seller',
        storeName: 'eBay',
        productCategory: 'Fashion & Apparel',
        productDescription: 'Nike Air Jordan 1 Low',
        quantity: 2,
        invoiceValue: 180.00,
        productLink: 'https://www.ebay.com/dp/example',
      },
    ],
  },
  {
    requestId: 'PA-260512',
    status: 'Converted to Shipment',
    freightMode: 'sea',
    customerType: 'Individual',
    addInsurance: true,
    confirmTerms: true,
    specialInstruction: null,
    items: [
      {
        trackingNumber: '1Z999AA101234567842',
        itemSource: 'Online Store',
        storeName: 'Walmart',
        productCategory: 'Electronics',
        productDescription: 'Samsung Galaxy Buds',
        quantity: 1,
        invoiceValue: 95.00,
        productLink: 'https://www.walmart.com/dp/example',
      },
    ],
  },
];

const seedSelfPurchase = async () => {
  try {
    await SelfPurchaseItem.sync({ force: false, alter: true });
    await SelfPurchaseRequest.sync({ force: false, alter: true });
    for (const req of sampleRequests) {
      const { items, ...rest } = req;
      const request = await SelfPurchaseRequest.create({
        ...rest,
        userId: 2,
        submittedAt: new Date(),
      });
      await SelfPurchaseItem.bulkCreate(
        items.map((item) => ({ ...item, requestId: request.id }))
      );
    }
    console.log('Self-purchase sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding self-purchase data:', error.message);
    process.exit(1);
  }
};

seedSelfPurchase();
