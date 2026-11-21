export interface PriceEstimate {
  totalHours: number;
  fullDays: number;
  remainingHours: number;
  estimatedAmount: number;
  breakdown: string;
  cappedToDaily: boolean;
}

/**
 * Renter-friendly parking price calculator.
 * - Minimum billable duration is 1 hour (rounded up to the nearest hour).
 * - For each 24h block, uses dailyRate (or 24 * hourlyRate if lower).
 * - For any remaining hours, automatically caps at dailyRate if remainingHours * hourlyRate > dailyRate.
 */
export function calculateRenterFriendlyPrice(
  startTime: Date,
  endTime: Date,
  hourlyRate: number,
  dailyRate: number
): PriceEstimate {
  const diffMs = endTime.getTime() - startTime.getTime();
  const totalHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));

  const effectiveDaily = Math.min(dailyRate, hourlyRate * 24);
  const fullDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  const rawRemainingCost = remainingHours * hourlyRate;
  const cappedToDaily = remainingHours > 0 && rawRemainingCost > effectiveDaily;
  const remainingCost = cappedToDaily ? effectiveDaily : rawRemainingCost;

  const estimatedAmount = fullDays * effectiveDaily + remainingCost;

  let breakdown = "";
  if (fullDays === 0) {
    if (cappedToDaily) {
      breakdown = `${totalHours} hr (capped to 1 day rate ₹${effectiveDaily})`;
    } else {
      breakdown = `${totalHours} hr × ₹${hourlyRate}/hr`;
    }
  } else if (remainingHours === 0) {
    breakdown = `${fullDays} day${fullDays > 1 ? "s" : ""} × ₹${effectiveDaily}/day`;
  } else if (cappedToDaily) {
    const billedDays = fullDays + 1;
    breakdown = `${billedDays} days (remaining ${remainingHours} hr capped to daily rate)`;
  } else {
    breakdown = `${fullDays}d × ₹${effectiveDaily} + ${remainingHours}h × ₹${hourlyRate}`;
  }

  return {
    totalHours,
    fullDays,
    remainingHours,
    estimatedAmount,
    breakdown,
    cappedToDaily,
  };
}
