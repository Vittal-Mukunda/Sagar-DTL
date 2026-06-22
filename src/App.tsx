import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ManifestProvider } from "./lib/ManifestContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { SectionPage } from "./pages/SectionPage";
import { NotFound } from "./pages/NotFound";

/** Scroll to top whenever the route changes (hash router). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <ManifestProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<SectionPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ManifestProvider>
  );
}
