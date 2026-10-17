// Unified pricing data shared between QuoteCalculator and Pricing pages
// Rate ranges for air freight are based on customer type tiers
// For sea freight, rates are per kg

export const formatRange = (min, max, suffix = '') => `$${min} - $${max}${suffix ? ' ' + suffix : ''}`;

// Air freight categories (CAT-A through CAT-F)
// charge1: Business Account rate range (lower tier)
// charge2: E-Commerce & B2C rate range
// charge3: General Customer rate range (higher tier)
export const AIR_FREIGHT_CATEGORIES = [
  {
    code: 'CAT-A',
    label: 'Clothing & Footwear',
    product: 'Clothing & Shoes: Branded hoodies, sneakers, jackets, t-shirts.',
    charge1: formatRange(9, 10),
    charge2: formatRange(10, 12),
    charge3: formatRange(12, 14),
    rateCharge1: 9,
    rateCharge3: 12,
    customs: 'Low customs duty. Easy to track volume or box size.',
    chargePerKg: 11,
  },
  {
    code: 'CAT-B',
    label: 'Cosmetics & Skincare',
    product: 'Cosmetics & Skincare: Serums, liquid foundation, lipstick, sunscreen.',
    charge1: formatRange(13, 14),
    charge2: formatRange(14, 16),
    charge3: formatRange(17, 19),
    rateCharge1: 13,
    rateCharge3: 17,
    customs: 'Highest customs duty and VAT. Requires chemical assessment.',
    chargePerKg: 15,
  },
  {
    code: 'CAT-C',
    label: 'Health Supplements & Vitamins',
    product: 'Health Supplements & Vitamins: Multivitamins, Omega-3, biotin, protein.',
    charge1: formatRange(13, 15),
    charge2: formatRange(14, 18),
    charge3: formatRange(18, 22),
    rateCharge1: 13,
    rateCharge3: 18,
    customs: 'Strict regulations by the Drug Authority. Packaging and expiry dates are checked.',
    chargePerKg: 15.5,
  },
  {
    code: 'CAT-D',
    label: 'Small Electronics & Gadgets',
    product: 'Small Electronics & Gadgets: Smartwatches, AirPods, gaming mice, SSDs.',
    charge1: formatRange(17, 19),
    charge2: formatRange(18, 22),
    charge3: formatRange(23, 28),
    rateCharge1: 17,
    rateCharge3: 23,
    customs: 'High duty. Fixed customs duty applied per piece value.',
    chargePerKg: 20,
  },
  {
    code: 'CAT-E',
    label: 'Baby Care Products',
    product: 'Baby Care Products: Infant formula, baby lotion, diaper rash cream.',
    charge1: formatRange(11, 12),
    charge2: formatRange(12, 14),
    charge3: formatRange(15, 17),
    rateCharge1: 11,
    rateCharge3: 15,
    customs: 'Low customs duty. Requires fast clearance as these are food-grade items.',
    chargePerKg: 13,
  },
  {
    code: 'CAT-F',
    label: 'Premium Accessories',
    product: 'Premium Accessories: Branded wristwatches, sunglasses/glasses, leather wallets, handbags.',
    charge1: formatRange(18, 21),
    charge2: formatRange(20, 25),
    charge3: formatRange(26, 32),
    rateCharge1: 18,
    rateCharge3: 26,
    customs: 'Luxury goods. High duty and strict security required at customs.',
    chargePerKg: 23,
  },
];

// Sea freight categories (SEA-A through SEA-F)
export const SEA_FREIGHT_CATEGORIES = [
  {
    code: 'SEA-A',
    label: 'Clothing & Shoes',
    product: 'Clothing & Shoes: Hoodies, sneakers, jackets, t-shirts, general bags, and approved textile products.',
    ratePerKg: 0.85,
    chargeDisplay: '$0.85/kg',
    conditions: 'General dry cargo. Invoice, packing list, composition, quantity, and accurate product description are mandatory.',
  },
  {
    code: 'SEA-B',
    label: 'Cosmetics & Skincare',
    product: 'Cosmetics & Skincare: Serums, lotions, lipsticks, sunscreens, shampoos, creams, and approved liquid cosmetics.',
    ratePerKg: 1.10,
    chargeDisplay: '$1.10/kg',
    conditions: 'Customs and regulatory burden are relatively higher. Leakage-proof packing, ingredients, expiry date, and carrier approval may apply.',
  },
  {
    code: 'SEA-C',
    label: 'Health Supplements & Vitamins',
    product: 'Health Supplements & Vitamins: Multivitamins, Omega-3, biotin, protein, and approved food supplements.',
    ratePerKg: 1.12,
    chargeDisplay: '$1.12/kg',
    conditions: 'Subject to verification of ingredients, manufacturer, label, expiry date, and applicable import/regulatory documents.',
  },
  {
    code: 'SEA-D',
    label: 'Electronics & Gadgets',
    product: 'Electronics & Gadgets: Computer parts, monitors, small appliances, non-battery accessories, and approved electronics.',
    ratePerKg: 1.07,
    chargeDisplay: '$1.07/kg',
    conditions: 'Prior approval and additional charges may apply if containing batteries, magnets, dangerous goods, or high-value components.',
  },
  {
    code: 'SEA-E',
    label: 'Baby Care & Food-Grade Products',
    product: 'Baby Care & Food-Grade Products: Baby lotion, diaper rash cream, approved baby food, formula, and childcare products.',
    ratePerKg: 1.09,
    chargeDisplay: '$1.09/kg',
    conditions: 'Applicable food, cosmetic, or sensitive product regulations apply according to product type. Label, ingredients, and expiry verification are mandatory.',
  },
  {
    code: 'SEA-F',
    label: 'Premium, Fragile & High-Value Products',
    product: 'Premium, Fragile & High-Value Products: Branded watches, glasses, leather wallets, handbags, glass items, and high-value goods.',
    ratePerKg: 1.42,
    chargeDisplay: '$1.42/kg',
    conditions: 'Subject to declared value, secured packing, insurance, and theft/damage risk assessment. Extremely high-value shipments will fall under a custom quotation.',
  },
];

// Maps category code to pricing data
export const getCategoryPricing = (categoryCode) => {
  if (categoryCode.startsWith('CAT-')) {
    return AIR_FREIGHT_CATEGORIES.find(cat => cat.code === categoryCode);
  }
  if (categoryCode.startsWith('SEA-')) {
    return SEA_FREIGHT_CATEGORIES.find(cat => cat.code === categoryCode);
  }
  return null;
};

// Returns the appropriate air freight rate per kg based on customer type
// E-commerce Merchant Importer and Commercial Import get the lower (business) rate
export const getAirRatePerKg = (categoryCode, customerType) => {
  const cat = getCategoryPricing(categoryCode);
  if (!cat || !cat.rateCharge1) return 0;
  const isCommercial = ['E-commerce Merchant Importer', 'Commercial Import'].includes(customerType);
  return isCommercial ? cat.rateCharge1 : cat.rateCharge3;
};

// Returns the sea freight rate per kg
export const getSeaRatePerKg = (categoryCode) => {
  const cat = getCategoryPricing(categoryCode);
  return cat?.ratePerKg || 0;
};

export default {
  AIR_FREIGHT_CATEGORIES,
  SEA_FREIGHT_CATEGORIES,
  getCategoryPricing,
  getAirRatePerKg,
  getSeaRatePerKg,
};
