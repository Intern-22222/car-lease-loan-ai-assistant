/**
 * Field Mapping, Validation, and UI Utilities
 */

import { FIELD_REQUIREMENTS, UNITS } from "../constants/enums";

// ==================== FIELD DISPLAY MAPPING ====================
export const FIELD_DISPLAY_MAP = {
  aprPercent: {
    label: "Interest Rate (APR)",
    unit: UNITS.PERCENT,
    format: "numeric"
  },
  leaseTermMonths: {
    label: "Lease Term",
    unit: UNITS.MONTHS,
    format: "numeric"
  },
  monthlyPaymentINR: {
    label: "Monthly Payment",
    unit: UNITS.CURRENCY_INR,
    format: "currency"
  },
  downPaymentINR: {
    label: "Down Payment",
    unit: UNITS.CURRENCY_INR,
    format: "currency"
  },
  residualValueINR: {
    label: "Residual Value",
    unit: UNITS.CURRENCY_INR,
    format: "currency"
  },
  annualMileageKm: {
    label: "Annual Mileage Allowance",
    unit: UNITS.DISTANCE_KM,
    format: "numeric"
  },
  earlyTerminationLevel: {
    label: "Early Termination Clause",
    unit: "",
    format: "enum"
  },
  purchaseOptionStatus: {
    label: "Purchase Option",
    unit: "",
    format: "enum"
  },
  maintenanceType: {
    label: "Maintenance Responsibilities",
    unit: "",
    format: "enum"
  },
  warrantyType: {
    label: "Warranty & Insurance Coverage",
    unit: "",
    format: "enum"
  },
  penaltyLevel: {
    label: "Penalties / Late Fees",
    unit: "",
    format: "enum"
  }
};

// ==================== FIELD ORDERING ====================
// Controlled field order for consistent table display
export const FIELD_ORDER = [
  "aprPercent",
  "leaseTermMonths",
  "monthlyPaymentINR",
  "downPaymentINR",
  "residualValueINR",
  "annualMileageKm",
  "earlyTerminationLevel",
  "purchaseOptionStatus",
  "maintenanceType",
  "warrantyType",
  "penaltyLevel"
];

// ==================== VALIDATION ====================
/**
 * Validate a single contract data
 * Returns { isValid: boolean, errors: string[] }
 */
export const validateContract = (contract) => {
  const errors = [];

  if (!contract.id || typeof contract.id !== "string") {
    errors.push("Contract must have a valid ID");
  }

  if (!contract.name || typeof contract.name !== "string") {
    errors.push("Contract must have a valid name");
  }

  // Validate required fields based on FIELD_REQUIREMENTS
  for (const [fieldKey, fieldSpec] of Object.entries(FIELD_REQUIREMENTS)) {
    const value = contract[fieldKey];

    if (fieldSpec.required && (value === undefined || value === null || value === "")) {
      errors.push(`Missing required field: ${fieldKey}`);
      continue;
    }

    if (value !== undefined && value !== null && value !== "") {
      // Type validation
      if (fieldSpec.type === "number" && typeof value !== "number") {
        errors.push(`${fieldKey} must be a number`);
      }
      
      if (fieldSpec.type === "enum" && !fieldSpec.enum.includes(value)) {
        errors.push(`${fieldKey} has invalid value: ${value}`);
      }

      // Range validation
      if (fieldSpec.min !== undefined && value < fieldSpec.min) {
        errors.push(`${fieldKey} cannot be less than ${fieldSpec.min}`);
      }

      if (fieldSpec.max !== undefined && value > fieldSpec.max) {
        errors.push(`${fieldKey} cannot be greater than ${fieldSpec.max}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format value for display with unit
 */
export const formatValue = (value, fieldKey) => {
  if (value === undefined || value === null || value === "") {
    return <span className="missing-value">—</span>;
  }

  const fieldConfig = FIELD_DISPLAY_MAP[fieldKey];
  if (!fieldConfig) return value;

  const { unit, format } = fieldConfig;

  if (format === "currency") {
    return `${UNITS.CURRENCY_SYMBOL} ${value.toLocaleString("en-IN")}`;
  }

  if (format === "numeric") {
    return `${value.toLocaleString("en-IN")} ${unit}`;
  }

  // enum format - just return the value
  return value;
};

/**
 * Get display label for a field
 */
export const getFieldLabel = (fieldKey) => {
  return FIELD_DISPLAY_MAP[fieldKey]?.label || fieldKey;
};

/**
 * Get unit for a field
 */
export const getFieldUnit = (fieldKey) => {
  return FIELD_DISPLAY_MAP[fieldKey]?.unit || "";
};

/**
 * Check if two contracts are different
 */
export const areContractsDifferent = (contractId1, contractId2) => {
  return contractId1 && contractId2 && contractId1 !== contractId2;
};

/**
 * Get safe field value with fallback
 */
export const getSafeFieldValue = (contract, fieldKey, defaultValue = undefined) => {
  if (!contract || typeof contract !== "object") return defaultValue;
  const value = contract[fieldKey];
  return value !== undefined && value !== null ? value : defaultValue;
};
