import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CarFront,
  Clock,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/guards";
import { Button, Card, DisclaimerBanner } from "@/components/ui";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "SUPER_ADMIN" && !user.societyId) {
      redirect("/admin");
    }
    if (!user.societyId || !user.flatNumber || !user.disclaimerAcceptedAt) {
      redirect("/onboarding");
    }
    redirect("/find");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <CarFront className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              RentParking
            </span>
          </div>
          <Link href="/login">
            <Button size="sm" variant="primary">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-14 space-y-8">
        <section className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Built for Residential Societies
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Share &amp; rent parking slots inside your society
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Have an empty slot while traveling? Expecting guests? List your
            hourly &amp; daily rates or book a neighbor&apos;s parking spot in
            seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue with Email OTP
              </Button>
            </Link>
            <Link href="/disclaimer" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" fullWidth>
                How It Works &amp; Safety
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Card className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Flexible Hourly &amp; Daily Rates
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Slot owners set their own charges. Renter-friendly pricing
              automatically caps long stays to the daily rate.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Closed Society Community
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Residents join using their society&apos;s invite code. You only
              see and share slots within your own community.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Direct Neighbor Settlement
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              No middleman fees or payment lock-ins. Coordinate directly via
              WhatsApp and settle directly with your neighbor.
            </p>
          </Card>
        </section>

        <DisclaimerBanner />
      </main>
    </div>
  );
}
