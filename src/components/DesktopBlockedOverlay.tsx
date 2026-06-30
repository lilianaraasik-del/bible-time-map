import { Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesktopBlockedOverlayProps {
  variant?: "full" | "after-preview";
  previewPages?: number;
}

export function DesktopBlockedOverlay({
  variant = "after-preview",
  previewPages,
}: DesktopBlockedOverlayProps) {
  const headline =
    variant === "full"
      ? "Seda raamatut saab lugeda ainult mobiilis või tahvelarvutis"
      : "Eelvaade läbi";

  const sub =
    variant === "full"
      ? "Autoriõiguste kaitseks ei ole täisraamat arvutis kättesaadav."
      : previewPages
      ? `Näitasime sulle esimesed ${previewPages} lehekülge. Terve raamatu lugemiseks ava see mobiilis või tahvelarvutis.`
      : "Näitasime sulle tasuta sissejuhatust. Terve raamatu lugemiseks ava see mobiilis või tahvelarvutis.";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/95 backdrop-blur-sm p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-xl p-6 text-center space-y-5">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Smartphone className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-semibold">{headline}</h3>
          <p className="text-sm text-muted-foreground">{sub}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <a
              href="https://play.google.com/store/apps/details?id=com.kerk.eraamatapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4 mr-2" />
              Lae Android-äpp
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">
            iPhone'is: ava materjalid.piibel.ee Safaris → Jaga → <strong>Lisa avaekraanile</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DesktopBlockedOverlay;
