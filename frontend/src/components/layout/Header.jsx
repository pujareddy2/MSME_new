import { Link } from "react-router-dom";
import logo from "../../images/ts-msme.jpg";

function Header() {
  return (
    <>
      {/* Top Government Strip */}

      <div className="gov-strip">
        <div className="gov-container">

          <img
            src={logo}
            alt="TS MSME Logo"
            className="sih-logo"
          />

          <div className="gov-right">
            <Link to="/login" className="login-btn">
              Login <span className="login-icon">👤</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Main Navbar */}

      <div className="main-navbar">
        <div className="nav-container">

          <h2 className="brand">
            TS-MSME Innovation Portal
          </h2>

          <ul className="nav-links">

            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About TS-MSME</Link>
            </li>

            <li>
              <Link to="/problems">Problem Statements</Link>
            </li>

            <li>
              <Link to="/guidelines">Guidelines</Link>
            </li>

            <li>
              <Link to="/faqs">FAQs</Link>
            </li>

            <li>
              <Link to="/contact">Contact Us</Link>
            </li>

          </ul>

        </div>
      </div>
    </>
  );
}

export default Header;