import Link from "next/link";
import { ArrowLeft, ShieldAlert, AlertTriangle, Handshake, Lock } from "lucide-react";
import { Button, Card } from "@/components/ui";

export const metadata = {
  title: "Security & Liability Disclaimer",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-6 md:py-10">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
          </Link>
          <span className="text-xs font-semibold text-slate-500">
            RentParking Legal Notice
          </span>
        </div>

        <Card className="p-5 md:p-7 space-y-5">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Security, Payment &amp; Liability Disclaimer
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Please read carefully before listing or booking any parking slot.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Handshake className="h-4 w-4 text-emerald-600" />
                1. Convenience Platform Only (No Escrow / No Payment Handling)
              </div>
              <p className="text-xs text-slate-600">
                RentParking only provides a digital noticeboard for residents of
                the same society to share parking availability and owner-defined
                hourly/daily rates. We do not collect payments, hold funds in
                escrow, verify legal property ownership, or act as a broker or
                landlord. All payments are settled directly between the parking
                owner and renter.
              </p>
            </div>

            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                2. Owner &amp; Renter Responsibility for Security &amp; Property
              </div>
              <p className="text-xs text-amber-900/90">
                The platform is <strong>not responsible</strong> for any
                suspicious activity, unauthorized access, vehicle theft, damage,
                towing, overstaying, or personal disputes. The{" "}
                <strong>parking owner is solely responsible</strong> for their
                parking property and compliance with society/RWA rules, and the
                renter is solely responsible for their vehicle and timely exit.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Lock className="h-4 w-4 text-indigo-600" />
                3. No Legal Documentation or Insurance
              </div>
              <p className="text-xs text-slate-600">
                Bookings created on RentParking are informal community
                convenience records and do not constitute a legal lease,
                license agreement, or insurance policy. Always follow your
                residential society&apos;s security gate procedures and verify
                your neighbor&apos;s details before handing over access.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
