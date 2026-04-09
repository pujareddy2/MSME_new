export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    return null;
  }
}

export function getStoredTeam() {
  try {
    return JSON.parse(localStorage.getItem("team") || "null");
  } catch {
    return null;
  }
}

export function saveSession(user, team = null) {
  localStorage.setItem("authUser", JSON.stringify(user));
  if (team) {
    localStorage.setItem("team", JSON.stringify(team));
  }
  localStorage.setItem("role", user.role || user.roleName || "");
  localStorage.setItem("userEmail", user.email || "");
}

export function clearSession() {
  localStorage.removeItem("authUser");
  localStorage.removeItem("team");
  localStorage.removeItem("role");
  localStorage.removeItem("userEmail");
}