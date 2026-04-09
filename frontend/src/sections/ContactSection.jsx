import React from "react";

const ContactSection = () => {
  return (
    <section  id="contact" className="contact">
      <div className="contact-container">

        <div className="contact-left">
          <h2>Contact Us</h2>
          <p>
            For queries related to TS_Msme ,
            guidelines or technical assistance, reach out to us.
          </p>

          <div className="contact-info">
            <p><strong>Email:</strong> support@ts_msme.gov.in</p>
            <p><strong>Phone:</strong> +91 11 2958 1000</p>
            <p><strong>Address:</strong> AICTE Headquarters, New Delhi, India</p>
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="5" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;