import "./Travel.css";

const hotels = [
  {
    name: "Home2 Suites by Hilton Clarksville Louisville North",
    tier: null,
    note: null,
    distance: "2.1 miles from venue",
    price: "From $166/night",
    code: null,
    url: "https://www.hilton.com/en/hotels/ckvbhht-home2-suites-clarksville-louisville-north/",
  },
  {
    name: "Hampton Inn Louisville-North/Clarksville",
    tier: null,
    note: null,
    distance: "1.8 miles from venue",
    price: "From $157/night",
    code: null,
    url: "https://www.hamptoninn.com/hotels/us/en/locations/ky/louisville-north/clarksville",
  },
  {
    name: "Hilton Garden Inn Jeffersonville Louisville North",
    tier: null,
    note: null,
    distance: "6.9 miles from venue",
    price: "From $128/night",
    code: null,
    url: "https://www.hilton.com/en/hotels/sdfjfgi-hilton-garden-inn-jeffersonville-louisville-north/",
  },
];

const tips = [
  {
    icon: "✈️",
    title: "Fly Into",
    body: "The closest airport is Louisville Muhammad Ali International (SDF), about 15 minutes from the venue. Cincinnati/Northern Kentucky International (CVG) is about 1.5 hours away and can sometimes have cheaper flights if you're okay with a bit of a drive. Both airports have plenty of rental car options available.",
  },
  {
    icon: "🚗",
    title: "Getting There",
    body: "We recommend renting a car to get around, as public transportation options are limited. Parking is available at the venue. Taking I-65 and exiting at Lewis and Clark Parkway or eastern boulevard are both good routes to get there.",
  },
  {
    icon: "🍷",
    title: "Arrive Early",
    body: "If you have the time, we highly recommend arriving a day or two early to explore the beautiful Louisville area! There are great restaurants, parks, and attractions to check out. Don't miss out on the slugger museum and its gigantic baseball bat!",
  },
];

export default function Travel() {
  return (
    <section id="travel" className="travel">
      <div className="travel__container">
        <div className="travel__header">
          <p className="section-eyebrow">Getting Here</p>
          <h2 className="section-title">Travel & Stay</h2>
          <p className="section-sub">Clarksville, Indiana</p>
        </div>

        <div className="travel__tips-grid">
          {tips.map((t) => (
            <div key={t.title} className="travel__tip">
              <span className="travel__tip-icon">{t.icon}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>

        <div className="travel__divider">
          <span />
          <p>Where to Stay</p>
          <span />
        </div>

        <div className="travel__hotels">
          {hotels.map((h) => (
            <div key={h.name} className="travel__hotel">
              <div className="travel__hotel-header">
                <div>
                  {h.tier && (
                    <span className="travel__hotel-tier">{h.tier}</span>
                  )}
                  <h3 className="travel__hotel-name">{h.name}</h3>
                </div>
                <p className="travel__hotel-price">{h.price}</p>
              </div>
              <p className="travel__hotel-distance">📍 {h.distance}</p>
              {h.note && <p className="travel__hotel-note">{h.note}</p>}
              {h.code && (
                <div className="travel__hotel-code">
                  Code: <strong>{h.code}</strong>
                </div>
              )}
              <a href={h.url} className="travel__hotel-link">
                Book Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
