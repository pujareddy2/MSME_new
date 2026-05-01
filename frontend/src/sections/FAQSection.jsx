import { useState } from "react";

function FAQSection() {
  const [active, setActive] = useState(null);

  const faqs = [
    {
      q: "What is the Innovation Platform?",
      a: "This platform connects organizations, government bodies, and industry partners with innovators to solve real-world problems and generate employment opportunities.",
    },
    {
      q: "Who can submit problem statements?",
      a: "Government ministries, departments, industry partners, and organizations can submit problem statements for collaboration.",
    },
    {
      q: "Who can participate?",
      a: "Students, developers, startups, and professionals interested in solving organization challenges can participate in platform initiatives.",
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