import "./Hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__content">
        <p className="hero__pre">We're getting married</p>

        <h1 className="hero__names">
          Kelsie
          <span className="hero__ampersand">&</span>
          Gabriel
        </h1>

        <div className="hero__date-line">
          <span className="hero__line" />
          <p className="hero__date">September 25, 2027 · Clarksville, IN</p>
          <span className="hero__line" />
        </div>

        <p className="hero__story">
          Wedding website.
          <br />
          <br />
          For our wedding.
          <br />
          Please join us. For our wedding celebration
          <br />
          No Spanish
        </p>

        <div className="hero__cta-row">
          <a
            className="hero__cta"
            onClick={() =>
              document
                .querySelector("#rsvp")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            RSVP Now
          </a>
          <a
            className="hero__cta hero__cta--ghost"
            onClick={() =>
              document
                .querySelector("#details")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Details
          </a>
        </div>
      </div>
    </section>
  );
}
