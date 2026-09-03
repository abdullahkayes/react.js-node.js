import { RateCard } from '../models/index.js';
import { determineZone, getEstimatedDays } from './zoneService.js';

const calculateQuote = async (originCountry, destinationCountry, weightKg, dimensions, serviceType) => {
  const zone = determineZone(originCountry, destinationCountry);

  const rateCard = await RateCard.findOne({
    where: {
      originZone: zone,
      destinationZone: zone,
      serviceType,
    },
  });

  if (!rateCard) {
    throw new Error(`No rate card found for zone '${zone}' with service type '${serviceType}'`);
  }

  const actualWeight = parseFloat(weightKg);
  let chargeableWeight = actualWeight;

  if (dimensions && dimensions.length && dimensions.width && dimensions.height) {
    const volWeight =
      (parseFloat(dimensions.length) *
        parseFloat(dimensions.width) *
        parseFloat(dimensions.height)) /
      5000;
    if (volWeight > actualWeight) {
      chargeableWeight = volWeight;
    }
  }

  const baseFee = parseFloat(rateCard.baseFee);
  const pricePerKg = parseFloat(rateCard.pricePerKg);
  const price = baseFee + chargeableWeight * pricePerKg;
  const estimatedDays = getEstimatedDays(serviceType);

  return {
    price: parseFloat(price.toFixed(2)),
    currency: rateCard.currency,
    serviceType,
    originZone: zone,
    destinationZone: zone,
    chargeableWeight: parseFloat(chargeableWeight.toFixed(3)),
    actualWeight,
    rateCardId: rateCard.id,
    estimatedDays,
  };
};

export default calculateQuote;
