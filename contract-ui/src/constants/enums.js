/**
 * Enums and Constants for Contract Comparison
 * Eliminates magic strings and provides centralized source of truth
 */

// ==================== PENALTY LEVELS ====================
export const PENALTY_LEVEL = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

// ==================== MAINTENANCE TYPES ====================
export const MAINTENANCE_TYPE = {
  DEALER: "Dealer",
  CUSTOMER: "Customer",
  SHARED: "Shared"
};

// ==================== WARRANTY TYPES ====================
export const WARRANTY_TYPE = {
  INCLUDED: "Included",
  PARTIAL: "Partial",
  NOT_INCLUDED: "Not Included"
};

// ==================== AVAILABILITY STATUS ====================
export const AVAILABILITY_STATUS = {
  AVAILABLE: "Available",
  NOT_AVAILABLE: "Not Available"
};

// ==================== TERMINATION FLEXIBILITY ====================
export const TERMINATION_LEVEL = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

// ==================== RATING THRESHOLDS ====================
export const RATING_SCALE = {
  MIN: 0,
  MAX: 10,
  EXCELLENT: 7,
  GOOD: 4
};

// ==================== COLOR SCHEME ====================
export const RATING_COLORS = {
  GREEN: "green",   // >= 7
  ORANGE: "orange", // >= 4
  RED: "red"         // < 4
};

// ==================== NUMERIC UNITS ====================
export const UNITS = {
  CURRENCY_INR: "INR",
  CURRENCY_SYMBOL: "₹",
  DISTANCE_KM: "km",
  DISTANCE_UNIT: "km/year",
  MONTHS: "months",
  PERCENT: "%"
};

// ==================== VALIDATION CONSTANTS ====================
export const FIELD_REQUIREMENTS = {
  aprPercent: { required: true, type: "number", min: 0, max: 100 },
  leaseTermMonths: { required: true, type: "number", min: 1 },
  monthlyPaymentINR: { required: true, type: "number", min: 0 },
  downPaymentINR: { required: true, type: "number", min: 0 },
  residualValueINR: { required: true, type: "number", min: 0 },
  annualMileageKm: { required: true, type: "number", min: 0 },
  earlyTerminationLevel: { required: true, type: "enum", enum: Object.values(TERMINATION_LEVEL) },
  purchaseOptionStatus: { required: true, type: "enum", enum: Object.values(AVAILABILITY_STATUS) },
  maintenanceType: { required: true, type: "enum", enum: Object.values(MAINTENANCE_TYPE) },
  warrantyType: { required: true, type: "enum", enum: Object.values(WARRANTY_TYPE) },
  penaltyLevel: { required: true, type: "enum", enum: Object.values(PENALTY_LEVEL) }
};
