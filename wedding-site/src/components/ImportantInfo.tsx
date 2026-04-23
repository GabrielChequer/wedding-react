import "./ImportantInfo.css";

const impInfo = [
  {
    q: "What is the dress code?",
    a: "We recommend cocktail attire. Think elegant dresses and suits, but feel free to add your own flair! Comfortable shoes are a must for dancing. No denim, please. We want everyone to look and feel their best on our special day.",
  },
  {
    q: "Are there any gifting preferences?",
    a: "Your presence is the greatest gift. If you wish to give, we have a small registry on Amazon and would gratefully accept contributions to our honeymoon fund.",
  },
  {
    q: "Can I take photos?",
    a: "During the ceremony, we kindly ask for an unplugged experience — our photographer will capture every moment. During cocktail hour and reception, please snap away!",
  },
  {
    q: "Is there parking on-site?",
    a: "Yes, the venue has plenty of parking for everyone. However, if you plan to enjoy the bar, maybe don't drive :)",
  },
];

export default function ImportantInfo() {
  return (
    <section id="important-information" className="details__info-section">
      <div className="Info__header">
        <p className="section-eyebrow">Be prepared!</p>
        <h2 className="section-title">Important Information</h2>
      </div>
      <div className="details__infos">
        {impInfo.map((impInfo, i) => (
          <div key={i} className="details__info">
            <h4 className="details__info-q">{impInfo.q}</h4>
            <p className="details__info-a">{impInfo.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
