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
// const marketPriceCache = new Map();

// /**
//  * Estimate market fair price using heuristic rules + caching
//  * @param {object} vehicleDetails
//  * @returns {object|null}
//  */
// const estimateMarketFairPrice = (vehicleDetails) => {
//   if (!vehicleDetails || !vehicleDetails.year) {
//     return null;
//   }

//   // Create a unique key for this specific car
//   const cacheKey = `${vehicleDetails.year}-${vehicleDetails.make}-${vehicleDetails.model}`;

//   // 🔁 Cache HIT: If we already calculated this recently, return it
//   if (marketPriceCache.has(cacheKey)) {
//     console.log(`Cache HIT for ${cacheKey}`);
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

//   // Floor protection (Minimum price)
//   if (fairPrice < 150000) {
//     fairPrice = 150000;
//   }

//   const pricingResult = {
//     marketFairPrice: Math.round(fairPrice),
//     confidence: "medium",
//     source: "heuristic",
//   };

//   // 🧠 Cache STORE: Save result for next time
//   marketPriceCache.set(cacheKey, pricingResult);

//   return pricingResult;
// };

// // Don't forget to export!
// module.exports = { estimateMarketFairPrice };


const marketPriceCache = new Map();

/**
 * Calculates a 0-100 Fairness Score based on Price, Rate, and Tenure.
 */
const calculateFairnessScore = (
  marketPrice,
  contractPrice,
  interestRate,
  tenureMonths,
) => {
  let score = 100;
  let reasons = [];

  // 1. PRICE PENALTY (Most important)
  // If Contract > Market, deduct 1 point for every 1% overpriced
  if (contractPrice > marketPrice) {
    const diffPercent = ((contractPrice - marketPrice) / marketPrice) * 100;
    const penalty = Math.min(diffPercent * 1.5, 50); // Cap penalty at 50 pts
    score -= penalty;
    if (penalty > 10)
      reasons.push("Price is significantly above market value.");
  } else {
    // Bonus for good deal
    score += 5;
    reasons.push("Price is below market value (Good Deal).");
  }

  // 2. INTEREST RATE PENALTY
  // Benchmarking against ~9-10% as "Standard"
  // Deduct 3 points for every 1% above 10%
  const safeRate = 10;
  if (interestRate && interestRate > safeRate) {
    const ratePenalty = (interestRate - safeRate) * 3;
    score -= ratePenalty;
    if (ratePenalty > 5) reasons.push(`High interest rate (${interestRate}%).`);
  }

  // 3. TENURE PENALTY
  // Loans > 60 months increase risk of being "underwater"
  if (tenureMonths && tenureMonths > 60) {
    score -= 10;
    reasons.push("Long loan term (> 5 years) increases total interest.");
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(Math.round(score), 100));

  let label = "Fair";
  if (score >= 80) label = "Excellent Deal";
  else if (score >= 60) label = "Fair Deal";
  else if (score >= 40) label = "Poor Deal";
  else label = "Bad Deal / Predatory";

  return { score, label, reasons };
};

/**
 * Estimate market fair price using heuristic rules + caching
 */
const estimateMarketFairPrice = (vehicleDetails) => {
  if (!vehicleDetails || !vehicleDetails.year) return null;

  const cacheKey = `${vehicleDetails.year}-${vehicleDetails.make}-${vehicleDetails.model}`;

  if (marketPriceCache.has(cacheKey)) {
    console.log(`⚡ Serving price from cache for: ${cacheKey}`);
    return { ...marketPriceCache.get(cacheKey), source: "cache" };
  }

  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(vehicleDetails.year, 10);
  if (isNaN(vehicleYear)) return null;

  let basePrice = 800000; // Base assumption INR
  const age = currentYear - vehicleYear;
  const depreciationRate = 0.06;

  let fairPrice = basePrice * Math.pow(1 - depreciationRate, age);
  if (fairPrice < 150000) fairPrice = 150000;

  const pricingResult = {
    marketFairPrice: Math.round(fairPrice),
    confidence: "medium",
    source: "heuristic",
  };

  marketPriceCache.set(cacheKey, pricingResult);
  return pricingResult;
};

module.exports = { estimateMarketFairPrice, calculateFairnessScore };
