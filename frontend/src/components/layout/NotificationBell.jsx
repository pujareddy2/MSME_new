import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications } from "../../services/api";
import { getStoredUser } from "../../utils/session";

function NotificationBell() {
  const currentUser = getStoredUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      if (!currentUser?.userId) {
        return;
      }

      try {
        const response = await getNotifications(currentUser.userId);
        setNotifications(response.data || []);
      } catch {
        setNotifications([]);
      }
    }

    loadNotifications();
  }, [currentUser?.userId]);

  if (!currentUser?.userId) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 18,
          position: "relative",
          color: "#4b275e",
        }}
      >
        🔔
        {notifications.length > 0 && (
          <span style={{ position: "absolute", top: -6, right: -6, background: "#F57C00", color: "white", borderRadius: 999, fontSize: 11, padding: "2px 6px" }}>
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: 30, width: 320, background: "white", border: "1px solid #ddd", borderRadius: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", zIndex: 20 }}>
          <div style={{ padding: 14, borderBottom: "1px solid #eee", fontWeight: 700 }}>Notifications</div>
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {notifications.length > 0 ? (
              notifications.slice(0, 6).map((item) => (
                <div key={item.notificationId} style={{ padding: 12, borderBottom: "1px solid #f2f2f2", fontSize: 14 }}>
                  {item.message}
                </div>
              ))
            ) : (
              <div style={{ padding: 14, fontSize: 14 }}>No notifications yet</div>
            )}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid #eee" }}>
            <Link to="/profile" style={{ color: "#4b275e", fontWeight: 700 }}>View profile</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;