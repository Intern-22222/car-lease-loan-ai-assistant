// /**
//  * Estimate market fair price using heuristic rules + caching
//  * @param {object} vehicleDetails
//  * @returns {object|null}
//  */
// const estimateMarketFairPrice = (vehicleDetails) => {
//   if (!vehicleDetails || !vehicleDetails.year) {
//     return null;
//   }

//   const cacheKey = `${vehicleDetails.year}-${vehicleDetails.make}-${vehicleDetails.model}`;

//   // 🔁 Cache HIT
//   if (marketPriceCache.has(cacheKey)) {
//     return {
//       ...marketPriceCache.get(cacheKey),
//       source: "cache",
//     };
//   }

//   const currentYear = new Date().getFullYear();
//   const vehicleYear = parseInt(vehicleDetails.year, 10);

//   if (isNaN(vehicleYear)) {
//     return null;
//   }

//   // Base price assumption (INR)
//   let basePrice = 800000;

//   // Depreciation logic
//   const age = currentYear - vehicleYear;
//   const depreciationRate = 0.06;

//   let fairPrice = basePrice * Math.pow(1 - depreciationRate, age);

//   // Floor protection
//   if (fairPrice < 150000) {
//     fairPrice = 150000;
//   }

//   const pricingResult = {
//     marketFairPrice: Math.round(fairPrice),
//     confidence: "medium",
//     source: "heuristic",
//   };

//   // 🧠 Cache STORE
//   marketPriceCache.set(cacheKey, pricingResult);

//   return pricingResult;
// };

// module.exports = {estimateMarketFairPrice};

// --- 1. DEFINE THE CACHE (This was missing!) ---
const marketPriceCache = new Map();

/**
 * Estimate market fair price using heuristic rules + caching
 * @param {object} vehicleDetails
 * @returns {object|null}
 */
const estimateMarketFairPrice = (vehicleDetails) => {
  if (!vehicleDetails || !vehicleDetails.year) {
    return null;
  }

  // Create a unique key for this specific car
  const cacheKey = `${vehicleDetails.year}-${vehicleDetails.make}-${vehicleDetails.model}`;

  // 🔁 Cache HIT: If we already calculated this recently, return it
  if (marketPriceCache.has(cacheKey)) {
    console.log(`Cache HIT for ${cacheKey}`);
    return {
      ...marketPriceCache.get(cacheKey),
      source: "cache",
    };
  }

  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(vehicleDetails.year, 10);

  if (isNaN(vehicleYear)) {
    return null;
  }

  // Base price assumption (INR)
  let basePrice = 800000;

  // Depreciation logic
  const age = currentYear - vehicleYear;
  const depreciationRate = 0.06;

  let fairPrice = basePrice * Math.pow(1 - depreciationRate, age);

  // Floor protection (Minimum price)
  if (fairPrice < 150000) {
    fairPrice = 150000;
  }

  const pricingResult = {
    marketFairPrice: Math.round(fairPrice),
    confidence: "medium",
    source: "heuristic",
  };

  // 🧠 Cache STORE: Save result for next time
  marketPriceCache.set(cacheKey, pricingResult);

  return pricingResult;
};

// Don't forget to export!
module.exports = { estimateMarketFairPrice };
