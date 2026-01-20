/**
 * Centralized Rating Configuration
 * Config-driven approach for scoring: easy to tune without touching logic
 */

import { RATING_SCALE } from "./enums";

// ==================== APR RATING THRESHOLDS ====================
export const APR_RATING_THRESHOLDS = [
  { maxValue: 5, score: 10 },
  { maxValue: 6, score: 9 },
  { maxValue: 7, score: 8 },
  { maxValue: 8, score: 7 },
  { maxValue: 9, score: 6 },
  { maxValue: 10, score: 5 },
  { maxValue: 12, score: 3 },
  { maxValue: Infinity, score: 1 }
];

// ==================== LEASE TERM RATING THRESHOLDS ====================
export const LEASE_TERM_RATING_THRESHOLDS = [
  { minValue: 60, score: 10 },
  { minValue: 48, score: 8 },
  { minValue: 36, score: 7 },
  { minValue: 24, score: 5 },
  { minValue: 0, score: 3 }
];

// ==================== MONTHLY PAYMENT RATING THRESHOLDS ====================
export const MONTHLY_PAYMENT_RATING_THRESHOLDS = [
  { maxValue: 4000, score: 10 },
  { maxValue: 5000, score: 9 },
  { maxValue: 6000, score: 8 },
  { maxValue: 7000, score: 6 },
  { maxValue: Infinity, score: 4 }
];

// ==================== DOWN PAYMENT RATING THRESHOLDS ====================
export const DOWN_PAYMENT_RATING_THRESHOLDS = [
  { maxValue: 20000, score: 10 },
  { maxValue: 40000, score: 8 },
  { maxValue: 60000, score: 6 },
  { maxValue: 80000, score: 4 },
  { maxValue: Infinity, score: 2 }
];

// ==================== RESIDUAL VALUE RATING THRESHOLDS ====================
export const RESIDUAL_VALUE_RATING_THRESHOLDS = [
  { minValue: 500000, score: 10 },
  { minValue: 400000, score: 8 },
  { minValue: 300000, score: 6 },
  { minValue: 0, score: 4 }
];

// ==================== MILEAGE ALLOWANCE RATING THRESHOLDS ====================
export const MILEAGE_ALLOWANCE_RATING_THRESHOLDS = [
  { minValue: 20000, score: 10 },
  { minValue: 15000, score: 8 },
  { minValue: 12000, score: 6 },
  { minValue: 0, score: 4 }
];

// ==================== ENUM-BASED RATINGS ====================
export const TERMINATION_LEVEL_RATINGS = {
  Low: 8,
  Medium: 6,
  High: 3
};

export const PURCHASE_OPTION_RATINGS = {
  Available: 8,
  "Not Available": 3
};

export const MAINTENANCE_TYPE_RATINGS = {
  Dealer: 9,
  Shared: 7,
  Customer: 5
};

export const WARRANTY_TYPE_RATINGS = {
  Included: 9,
  Partial: 6,
  "Not Included": 3
};

export const PENALTY_LEVEL_RATINGS = {
  Low: 9,
  Medium: 6,
  High: 3
};

// ==================== SCORING FIELDS ====================
export const RATING_FIELDS = [
  {
    key: "aprPercent",
    label: "Interest Rate (APR)",
    weight: 2,
    rating: "rateAPR"
  },
  {
    key: "leaseTermMonths",
    label: "Lease Term Duration",
    weight: 1,
    rating: "rateLeaseTermMonths"
  },
  {
    key: "monthlyPaymentINR",
    label: "Monthly Payment",
    weight: 2,
    rating: "rateMonthlyPaymentINR"
  },
  {
    key: "downPaymentINR",
    label: "Down Payment",
    weight: 2,
    rating: "rateDownPaymentINR"
  },
  {
    key: "residualValueINR",
    label: "Residual Value",
    weight: 1,
    rating: "rateResidualValueINR"
  },
  {
    key: "annualMileageKm",
    label: "Mileage Allowance",
    weight: 1,
    rating: "rateMileageAllowanceKm"
  },
  {
    key: "earlyTerminationLevel",
    label: "Early Termination Clause",
    weight: 1,
    rating: "rateEarlyTerminationLevel"
  },
  {
    key: "purchaseOptionStatus",
    label: "Purchase Option",
    weight: 1,
    rating: "ratePurchaseOptionStatus"
  },
  {
    key: "maintenanceType",
    label: "Maintenance Responsibilities",
    weight: 1.5,
    rating: "rateMaintenanceType"
  },
  {
    key: "warrantyType",
    label: "Warranty & Insurance Coverage",
    weight: 1.5,
    rating: "rateWarrantyType"
  },
  {
    key: "penaltyLevel",
    label: "Penalties / Late Fees",
    weight: 1,
    rating: "ratePenaltyLevel"
  }
];

// ==================== UTILITY FUNCTION ====================
/**
 * Generic function to rate a value based on thresholds
 * Supports both min/max based comparisons
 */
export const rateByThresholds = (value, thresholds) => {
  for (const threshold of thresholds) {
    if (threshold.maxValue !== undefined && value <= threshold.maxValue) {
      return threshold.score;
    }
    if (threshold.minValue !== undefined && value >= threshold.minValue) {
      return threshold.score;
    }
  }
  return RATING_SCALE.MIN;
};

/**
 * Rate by enum value lookup
 */
export const rateByEnum = (value, enumRatings) => {
  return enumRatings[value] ?? RATING_SCALE.MIN;
};

/**
 * Get color based on score
 */
export const getScoreColor = (score) => {
  if (score >= RATING_SCALE.EXCELLENT) return "green";
  if (score >= RATING_SCALE.GOOD) return "orange";
  return "red";
};

/**
 * Calculate weighted total score
 */
export const calculateTotalScore = (ratings) => {
  let totalScore = 0;
  let totalWeight = 0;

  for (const field of RATING_FIELDS) {
    const score = ratings[field.key];
    if (score !== undefined) {
      totalScore += score * field.weight;
      totalWeight += field.weight;
    }
  }

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) / 100 : 0;
};
