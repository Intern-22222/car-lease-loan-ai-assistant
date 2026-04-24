

const marketPriceCache = new Map();


const calculateFairnessScore = (
  marketPrice,
  contractPrice,
  interestRate,
  tenureMonths,
) => {
  let score = 100;
  let reasons = [];

  if (contractPrice > marketPrice) {
    const diffPercent = ((contractPrice - marketPrice) / marketPrice) * 100;
    const penalty = Math.min(diffPercent * 1.5, 50); 
    score -= penalty;
    if (penalty > 10)
      reasons.push("Price is significantly above market value.");
  } else {
   
    score += 5;
    reasons.push("Price is below market value (Good Deal).");
  }


  const safeRate = 10;
  if (interestRate && interestRate > safeRate) {
    const ratePenalty = (interestRate - safeRate) * 3;
    score -= ratePenalty;
    if (ratePenalty > 5) reasons.push(`High interest rate (${interestRate}%).`);
  }

  if (tenureMonths && tenureMonths > 60) {
    score -= 10;
    reasons.push("Long loan term (> 5 years) increases total interest.");
  }

  score = Math.max(0, Math.min(Math.round(score), 100));

  let label = "Fair";
  if (score >= 80) label = "Excellent Deal";
  else if (score >= 60) label = "Fair Deal";
  else if (score >= 40) label = "Poor Deal";
  else label = "Bad Deal / Predatory";

  return { score, label, reasons };
};


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

  let basePrice = 800000; 
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
