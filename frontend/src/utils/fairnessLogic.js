export const calculateFairnessScore = (contract) => {
  let score = 10;
  
  // Rule 1: High APR is bad
  if (parseFloat(contract.apr) > 5.0) score -= 2;
  
  // Rule 2: High termination fee is bad
  if (parseInt(contract.terminationFee) > 400) score -= 1.5;

  // Ensure it doesn't go below 0
  return Math.max(0, score).toFixed(1); // Returns string like "8.5"
};

export const checkSimilarity = (c1, c2) => {
  // If Make and Model are the same, they are "Similar"
  return c1.vehicle === c2.vehicle;
};