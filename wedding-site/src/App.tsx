import { useSearchParams } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RSVP from "./components/RSVP";
import Details from "./components/Details";
import ImportantInfo from "./components/ImportantInfo";
import Travel from "./components/Travel";
import Footer from "./components/Footer";

export default function App() {
  const [searchParams] = useSearchParams();
  const rsvpCode = searchParams.get("rsvp") || null;

  return (
    <>
      <div className="page-bg" />
      <div className="site-container">
        <Navbar />
        <main>
          <Hero />
          <RSVP rsvpCode={rsvpCode} />
          <Details />
          <ImportantInfo />
          <Travel />
          <Footer />
        </main>
      </div>
    </>
  );
}
