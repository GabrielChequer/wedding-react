import "./Details.css";

const timeline = [
  {
    time: "4:00 PM",
    label: "Guests Arrive",
    desc: "Welcome drinks & light appetizers in the garden",
  },
  {
    time: "4:30 PM",
    label: "Ceremony Begins",
    desc: "Please be seated by 4:20 PM",
  },
  {
    time: "5:00 PM",
    label: "Cocktail Hour",
    desc: "Champagne, wine & hors d'oeuvres",
  },
  { time: "6:30 PM", label: "Dinner", desc: "Seated dinner & toasts" },
  {
    time: "8:00 PM",
    label: "First Dance",
    desc: "Dancing & celebration begins",
  },
  {
    time: "11:30 PM",
    label: "Last Dance",
    desc: "Good night & farewell",
  },
];

export default function Details() {
  return (
    <section id="details" className="details">
      <div className="details__container">
        <div className="details__header">
          <p className="section-eyebrow">The Big Day</p>
          <h2 className="section-title">Details</h2>
          <p className="section-sub">
            September 25th, 2027 · Clarksville, Indiana
          </p>
        </div>

        <div className="details__venue-card">
          <div className="details__venue-info">
            <span className="details__venue-label">Ceremony & Reception</span>
            <h3>The Magnolia</h3>
            <p>318 W Lewis and Clark Pkwy, Clarksville, IN 47129</p>
            <p className="details__venue-note">
              The Magnolia is a beautiful, rustic venue with both indoor and
              outdoor spaces. The ceremony will be in the garden, followed by
              cocktail hour on the terrace and dinner in the main hall.
            </p>
            <a
              href="https://maps.google.com?q=The+Magnolia+Clarksville+IN"
              target="_blank"
              rel="noopener noreferrer"
              className="details__map-link"
            >
              Get Directions →
            </a>
          </div>
          <div className="details__venue-decoration" />
        </div>

        <div className="details__timeline-section">
          <h3 className="details__section-label">Day-Of Schedule</h3>
          <div className="details__timeline">
            {timeline.map((item, i) => (
              <div key={i} className="details__timeline-item">
                <div className="details__timeline-time">{item.time}</div>
                <div className="details__timeline-dot" />
                <div className="details__timeline-content">
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
