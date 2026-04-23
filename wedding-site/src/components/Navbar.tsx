import { useState, useEffect } from "react";
import "./Navbar.css";

const links = [
  { label: "Home", href: "#home" },
  { label: "RSVP", href: "#rsvp" },
  { label: "Details", href: "#details" },
  { label: "Important Info", href: "#important-information" },
  { label: "Travel", href: "#travel" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [menuOpen]);

  const handleLink = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const burgerClass = `navbar__burger${menuOpen ? " navbar__burger--open" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar__monogram" onClick={() => handleLink("#home")}>
        K <span>&</span> G
      </div>

      <ul className="navbar__links">
        {links.map((l) => (
          <li key={l.label}>
            <a onClick={() => handleLink(l.href)}>{l.label}</a>
          </li>
        ))}
      </ul>

      <button
        className={burgerClass}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`modal-overlay ${menuOpen ? "open" : ""}`}>
        <div className="modal-content">
          {links.map((l) => (
            <a key={l.label} onClick={() => handleLink(l.href)}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
