import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export function DisclaimerBanner({
  compact = false,
  className,
}: DisclaimerBannerProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-200/90 bg-amber-50/80 text-amber-950",
        compact ? "p-3" : "p-4",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-bold text-amber-900">
            Community Convenience Platform — Security & Payment Notice
          </p>
          <p className="text-amber-900/90">
            {compact
              ? "RentParking only lists rates for convenience and does not handle payments, escrow, or legal verification. The parking owner and renter are solely responsible for property, vehicle safety, payments, and any suspicious activity."
              : "RentParking is strictly a convenience platform connecting residents within the same society. We do not process payments, hold escrow, verify ownership documents, or provide security/insurance. The parking owner is solely responsible for their property and slot, and both parties handle payments and safety directly at their own discretion."}
          </p>
          <Link
            href="/disclaimer"
            className="inline-block font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-950"
          >
            Read full Security & Liability Disclaimer
          </Link>
        </div>
      </div>
    </div>
  );
}
