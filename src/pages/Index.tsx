import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
          Piibli Tarkuse Puu
        </h1>
        <p className="text-lg text-muted-foreground">
          Avasta Piibli raamatud kronoloogilises järjekorras — autorid, ajastud ja kategooriad ühel interaktiivsel ajateljel.
        </p>
        <Link to="/ajajoon">
          <Button size="lg">Vaata ajajoont</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
