import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";
import { getNotifications, markNotificationRead } from "../../services/api";
import { getStoredUser } from "../../utils/session";

function NotificationBell() {
  const currentUser = getStoredUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      if (!currentUser?.userId) {
        return;
      }

      try {
        const response = await getNotifications(currentUser.userId);
        if (!cancelled) {
          setNotifications(response.data || []);
        }
      } catch {
        if (!cancelled) {
          setNotifications([]);
        }
      }
    }

    loadNotifications();
    const timer = setInterval(loadNotifications, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [currentUser?.userId]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const onItemClick = async (item) => {
    if (item.isRead) {
      return;
    }

    try {
      await markNotificationRead(item.id || item.notificationId);
      setNotifications((prev) =>
        prev.map((entry) =>
          (entry.id || entry.notificationId) === (item.id || item.notificationId)
            ? { ...entry, isRead: true }
            : entry
        )
      );
    } catch {
      // no-op
    }
  };

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
          fontSize: 20,
          position: "relative",
          color: "#1f6fb8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease, color 0.2s ease",
        }}
        aria-label="Notifications"
      >
        <FaRegBell />
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: -6, right: -6, background: "#F57C00", color: "white", borderRadius: 999, fontSize: 11, padding: "2px 6px" }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: 30, width: 320, background: "white", border: "1px solid #ddd", borderRadius: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", zIndex: 20 }}>
          <div style={{ padding: 14, borderBottom: "1px solid #eee", fontWeight: 700 }}>Notifications</div>
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map((item) => (
                <div
                  key={item.id || item.notificationId}
                  onClick={() => onItemClick(item)}
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #f2f2f2",
                    fontSize: 14,
                    cursor: "pointer",
                    background: item.isRead ? "#fff" : "#f4fbff",
                    fontWeight: item.isRead ? 400 : 600,
                  }}
                >
                  {item.message}
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                    {(item.type || "GENERAL").replace(/_/g, " ")}
                  </div>
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
