import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button, Card } from "@/components/ui";

export default function OfflinePage() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-sm w-full text-center p-6 space-y-4">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
          <WifiOff className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-slate-900">You&apos;re offline</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Basement parking signal can be tricky! Reconnect to the internet to
            browse live slots or update bookings.
          </p>
        </div>
        <Link href="/find" className="block">
          <Button fullWidth variant="primary">
            Try Again
          </Button>
        </Link>
      </Card>
    </div>
  );
}
