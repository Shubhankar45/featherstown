import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Birds from "./pages/Birds";
import Compare from "./pages/Compare";
import ReviewsPage from "./pages/ReviewsPage";
import Contact from "./pages/Contact";
import Breeds from "./pages/Breeds";
import BreedDetails from "./pages/BreedDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageChrome from "./components/PageChrome";

/* Scrolls to top on route change, but lets hash links (#about etc.)
   on the Home page scroll to their target instead. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <div className="flex-grow">
      <PageChrome />
      <ScrollManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/birds" element={<Birds />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/breeds" element={<Breeds />} />
        <Route path="/breed/:id" element={<BreedDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
