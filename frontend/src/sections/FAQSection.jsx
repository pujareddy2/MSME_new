import { useState } from "react";

function FAQSection() {
  const [active, setActive] = useState(null);

  const faqs = [
    {
      q: "What is the Smart India Hackathon?",
      a: "Smart India Hackathon is an initiative by the Government of India aimed at addressing pressing problems through student innovation."
    },
    {
      q: "When did the Smart India Hackathon start?",
      a: "SIH was launched in 2017 as a nationwide innovation initiative."
    },
    {
      q: "Who can submit problem statements?",
      a: "Government ministries, departments and industry partners can submit problem statements."
    }
  ];

  return (
    <section className="faq">
      <div className="faq-container">
        <h2 className="section-title">General FAQ</h2>

        {faqs.map((item, index) => (
          <div key={index} className="faq-card">
            <div
              className="faq-header"
              onClick={() => setActive(active === index ? null : index)}
            >
              <h4>{item.q}</h4>
              <div className="faq-icon">
                {active === index ? "-" : "+"}
              </div>
            </div>

            {active === index && (
              <div className="faq-body">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQSection;