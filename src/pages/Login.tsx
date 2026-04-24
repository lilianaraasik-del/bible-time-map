import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { LogIn, Smartphone } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    navigate("/profiil", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.ok === true) {
      toast({ title: "Tere tulemast!", description: "Sisselogimine õnnestus." });
      navigate("/profiil");
      return;
    }

    toast({
      title: "Sisselogimine ebaõnnestus",
      description: res.error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-md mx-auto px-6 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Logi sisse</CardTitle>
            <CardDescription>
              Kasuta sama e-maili ja parooli, mis KERK mobiilirakenduses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Parool</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sisse logimine..." : "Logi sisse"}
              </Button>
            </form>

            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Pole veel kontot?</p>
                  <p>
                    Loo konto KERK mobiilirakenduses (App Store või Google Play)
                    ja seejärel logi siia sama e-maili ja parooliga.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link to="/eraamatud" className="text-sm text-muted-foreground hover:text-primary">
                Tagasi e-raamatutesse
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
