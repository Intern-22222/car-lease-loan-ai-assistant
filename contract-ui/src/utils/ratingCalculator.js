import { getSafeFieldValue } from "./fieldMapping";
import {
  APR_RATING_THRESHOLDS,
  LEASE_TERM_RATING_THRESHOLDS,
  MONTHLY_PAYMENT_RATING_THRESHOLDS,
  DOWN_PAYMENT_RATING_THRESHOLDS,
  RESIDUAL_VALUE_RATING_THRESHOLDS,
  MILEAGE_ALLOWANCE_RATING_THRESHOLDS,
  TERMINATION_LEVEL_RATINGS,
  PURCHASE_OPTION_RATINGS,
  MAINTENANCE_TYPE_RATINGS,
  WARRANTY_TYPE_RATINGS,
  PENALTY_LEVEL_RATINGS,
  rateByThresholds,
  rateByEnum,
} from "../constants/ratingConfig";

const ratingFunctions = {
  aprPercent: (v) => rateByThresholds(v, APR_RATING_THRESHOLDS),
  leaseTermMonths: (v) => rateByThresholds(v, LEASE_TERM_RATING_THRESHOLDS),
  monthlyPaymentINR: (v) => rateByThresholds(v, MONTHLY_PAYMENT_RATING_THRESHOLDS),
  downPaymentINR: (v) => rateByThresholds(v, DOWN_PAYMENT_RATING_THRESHOLDS),
  residualValueINR: (v) => rateByThresholds(v, RESIDUAL_VALUE_RATING_THRESHOLDS),
  annualMileageKm: (v) => rateByThresholds(v, MILEAGE_ALLOWANCE_RATING_THRESHOLDS),
  earlyTerminationLevel: (v) => rateByEnum(v, TERMINATION_LEVEL_RATINGS),
  purchaseOptionStatus: (v) => rateByEnum(v, PURCHASE_OPTION_RATINGS),
  maintenanceType: (v) => rateByEnum(v, MAINTENANCE_TYPE_RATINGS),
  warrantyType: (v) => rateByEnum(v, WARRANTY_TYPE_RATINGS),
  penaltyLevel: (v) => rateByEnum(v, PENALTY_LEVEL_RATINGS),
};

export const calculateContractRatings = (contract) => {
  if (!contract) return {};
  
  return Object.keys(ratingFunctions).reduce((acc, key) => {
    const value = getSafeFieldValue(contract, key, key.includes("Level") || key.includes("Status") ? "" : 0);
    acc[key] = ratingFunctions[key](value);
    return acc;
  }, {});
};
