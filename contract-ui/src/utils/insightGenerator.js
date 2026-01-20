import { MAINTENANCE_TYPE, WARRANTY_TYPE, AVAILABILITY_STATUS } from "../constants/enums";
import { WARRANTY_TYPE_RATINGS } from "../constants/ratingConfig";

export const generateInsights = (contractA, contractB) => {
  const insights = [];
  if (!contractA || !contractB) return insights;

  const comparisons = [
    {
      label: "APR",
      emoji: "💰",
      getDiff: () => contractA.aprPercent - contractB.aprPercent,
      threshold: 0.5,
      formatMessage: (diff) => `${diff > 0 ? contractB.name : contractA.name} has lower interest rate (${diff > 0 ? contractB.aprPercent : contractA.aprPercent}% vs ${diff > 0 ? contractA.aprPercent : contractB.aprPercent}%)`,
    },
    {
      label: "Monthly Payment",
      emoji: "📊",
      getDiff: () => contractA.monthlyPaymentINR - contractB.monthlyPaymentINR,
      threshold: 100,
      formatMessage: (diff) => `${diff > 0 ? contractB.name : contractA.name} has lower monthly payment (₹${diff > 0 ? contractB.monthlyPaymentINR : contractA.monthlyPaymentINR} vs ₹${diff > 0 ? contractA.monthlyPaymentINR : contractB.monthlyPaymentINR})`,
    },
    {
      label: "Down Payment",
      emoji: "💳",
      getDiff: () => contractA.downPaymentINR - contractB.downPaymentINR,
      threshold: 1000,
      formatMessage: (diff) => `${diff > 0 ? contractB.name : contractA.name} requires lower down payment (₹${diff > 0 ? contractB.downPaymentINR : contractA.downPaymentINR} vs ₹${diff > 0 ? contractA.downPaymentINR : contractB.downPaymentINR})`,
    },
    {
      label: "Residual Value",
      emoji: "📈",
      getDiff: () => contractA.residualValueINR - contractB.residualValueINR,
      threshold: 10000,
      formatMessage: (diff) => `${diff > 0 ? contractA.name : contractB.name} has higher residual value (₹${diff > 0 ? contractA.residualValueINR : contractB.residualValueINR} vs ₹${diff > 0 ? contractB.residualValueINR : contractA.residualValueINR})`,
    },
    {
      label: "Mileage",
      emoji: "🛣️",
      getDiff: () => contractA.annualMileageKm - contractB.annualMileageKm,
      threshold: 1000,
      formatMessage: (diff) => `${diff > 0 ? contractA.name : contractB.name} offers higher mileage (${diff > 0 ? contractA.annualMileageKm : contractB.annualMileageKm} vs ${diff > 0 ? contractB.annualMileageKm : contractA.annualMileageKm} km)`,
    },
  ];

  comparisons.forEach(({ emoji, getDiff, threshold, formatMessage }) => {
    const diff = getDiff();
    if (Math.abs(diff) > threshold) {
      insights.push(`${emoji} ${formatMessage(diff)}`);
    }
  });

  if (contractA.maintenanceType !== contractB.maintenanceType) {
    const better = contractA.maintenanceType === MAINTENANCE_TYPE.DEALER ? contractA.name : contractB.name;
    insights.push(`🔧 ${better} includes dealer-managed maintenance`);
  }

  if (contractA.warrantyType !== contractB.warrantyType) {
    const better = (WARRANTY_TYPE_RATINGS[contractA.warrantyType] || 0) > (WARRANTY_TYPE_RATINGS[contractB.warrantyType] || 0) ? contractA.name : contractB.name;
    insights.push(`🛡️ ${better} offers better warranty coverage`);
  }

  if ((contractA.purchaseOptionStatus === AVAILABILITY_STATUS.AVAILABLE) !== (contractB.purchaseOptionStatus === AVAILABILITY_STATUS.AVAILABLE)) {
    const better = contractA.purchaseOptionStatus === AVAILABILITY_STATUS.AVAILABLE ? contractA.name : contractB.name;
    insights.push(`🏷️ ${better} includes a purchase option at lease end`);
  }

  const totalCostA = contractA.monthlyPaymentINR * contractA.leaseTermMonths + contractA.downPaymentINR;
  const totalCostB = contractB.monthlyPaymentINR * contractB.leaseTermMonths + contractB.downPaymentINR;
  const costDiff = totalCostA - totalCostB;

  if (Math.abs(costDiff) > 50000) {
    const better = costDiff > 0 ? contractB.name : contractA.name;
    insights.push(`💡 ${better} has lower total cost (savings: ₹${Math.abs(costDiff).toLocaleString("en-IN")})`);
  }

  return insights;
};
