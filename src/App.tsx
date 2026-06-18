import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Ajajoon from "./pages/Ajajoon.tsx";
import Raamat from "./pages/Raamat.tsx";
import Kommentaar from "./pages/Kommentaar.tsx";
import Paigad from "./pages/Paigad.tsx";
import Sundmused from "./pages/Sundmused.tsx";
import Tabernacle from "./pages/Tabernacle.tsx";
import JeesuseSugupuu from "./pages/JeesuseSugupuu.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ScrollToTop } from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ajajoon" element={<Ajajoon />} />
          <Route path="/paigad" element={<Paigad />} />
          <Route path="/sundmused" element={<Sundmused />} />
          <Route path="/raamat/:book" element={<Raamat />} />
          <Route path="/raamat/:book/kommentaar" element={<Kommentaar />} />
          <Route path="/kaardid/tabernaakel" element={<Tabernacle />} />
          <Route path="/jeesuse-sugupuu" element={<JeesuseSugupuu />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
