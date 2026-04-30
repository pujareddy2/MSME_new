import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// TODO: Add final logo here later
import NotificationBell from "./NotificationBell";
import { clearSession, getStoredUser } from "../../utils/session";

function Header() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <>
      {/* Top Government Strip */}

      <div className="gov-strip">
        <div className="gov-container">

          {/* logo placeholder - removed for now to allow final branding to be added later */}
          <div className="platform-logo" aria-hidden="true">&nbsp;</div>

          <div className="gov-right">
            <NotificationBell />
            {currentUser ? (
              <>
                <Link to="/profile" className="login-btn">
                  Profile
                </Link>
                <button type="button" className="login-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="login-btn">
                Login <span className="login-icon">👤</span>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Main Navbar */}

      <div className="main-navbar">
        <div className="nav-container">

          <h2 className="brand">
            Innovation Portal
          </h2>

          <ul className="nav-links">

            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About Us</Link>
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