const continentMap = {
  Asia: ['CN', 'IN', 'BD', 'PK', 'JP', 'KR', 'TH', 'ID', 'MY', 'PH', 'VN', 'SG', 'LK', 'NP', 'MM', 'KH', 'LA', 'BN', 'TL'],
  Europe: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PL', 'PT', 'IE', 'GR', 'CZ', 'RO'],
  Africa: ['NG', 'ZA', 'EG', 'KE', 'GH', 'ET', 'MA', 'TN', 'DZ', 'AU', 'UG', 'TZ'],
  'North America': ['US', 'CA', 'MX', 'GT', 'CR', 'PA', 'CO', 'PE'],
  'South America': ['BR', 'AR', 'CL', 'EC'],
};

const countryToAlpha2 = {
  USA: 'US',
  'United States': 'US',
  UK: 'GB',
  'United Kingdom': 'GB',
  Bangladesh: 'BD',
  India: 'IN',
  Canada: 'CA',
  Mexico: 'MX',
  Germany: 'DE',
  France: 'FR',
};

const getCountryCode = (country) => {
  if (!country) return 'XX';
  const upper = country.toUpperCase().trim();
  if (continentMap.Asia.includes(upper) || continentMap.Europe.includes(upper) ||
      continentMap.Africa.includes(upper) || continentMap['North America'].includes(upper) ||
      continentMap['South America'].includes(upper)) {
    return upper;
  }
  return countryToAlpha2[upper] || upper.substring(0, 2).toUpperCase() || 'XX';
};

const getContinent = (country) => {
  const code = getCountryCode(country);
  for (const [continent, countries] of Object.entries(continentMap)) {
    if (countries.includes(code)) {
      return continent;
    }
  }
  return 'Unknown';
};

const determineZone = (originCountry, destinationCountry) => {
  if (originCountry === destinationCountry) {
    return 'domestic';
  }

  const originContinent = getContinent(originCountry);
  const destContinent = getContinent(destinationCountry);

  if (originContinent === 'Unknown' || destContinent === 'Unknown') {
    return 'international';
  }

  if (originContinent === destContinent) {
    return 'regional';
  }

  return 'international';
};

const estimatedDaysMap = {
  standard: '5-7',
  express: '2-3',
  priority: '1-2',
};

const getEstimatedDays = (serviceType) => {
  return estimatedDaysMap[serviceType] || '5-7';
};

export { determineZone, getCountryCode, getContinent, getEstimatedDays, estimatedDaysMap };
