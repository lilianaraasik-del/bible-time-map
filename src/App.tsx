import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { GOOGLE_CLIENT_ID } from "@/lib/googleAuth";
import Index from "./pages/Index.tsx";
import Ajajoon from "./pages/Ajajoon.tsx";
import Raamat from "./pages/Raamat.tsx";
import Paigad from "./pages/Paigad.tsx";
import Sundmused from "./pages/Sundmused.tsx";
import Eraamatud from "./pages/Eraamatud.tsx";
import Login from "./pages/Login.tsx";
import Profiil from "./pages/Profiil.tsx";
import Paketid from "./pages/Paketid.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ajajoon" element={<Ajajoon />} />
              <Route path="/paigad" element={<Paigad />} />
              <Route path="/sundmused" element={<Sundmused />} />
              <Route path="/eraamatud" element={<Eraamatud />} />
              <Route path="/raamat/:book" element={<Raamat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profiil" element={<Profiil />} />
              <Route path="/paketid" element={<Paketid />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
