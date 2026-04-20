import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";
import "./login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const normalizePhone = (value) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) {
      digits = digits.slice(2);
    }
    if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    return digits.slice(0, 10);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required";
    } else if (!/^\d{10}$/.test(form.currentPassword.trim())) {
      nextErrors.currentPassword = "Current password must be exactly 10 digits";
    }

    if (!form.newPassword.trim()) {
      nextErrors.newPassword = "New password is required";
    } else if (form.newPassword.trim().length < 8) {
      nextErrors.newPassword = "New password must be at least 8 characters";
    }

    if (!form.confirmNewPassword.trim()) {
      nextErrors.confirmNewPassword = "Confirm new password is required";
    } else if (form.confirmNewPassword !== form.newPassword) {
      nextErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field, value) => {
    const nextValue = field === "currentPassword" ? normalizePhone(value) : value;
    setForm((prev) => ({ ...prev, [field]: nextValue }));

    setErrors((prev) => {
      const nextErrors = { ...prev };
      if (field === "confirmNewPassword" || field === "newPassword") {
        if (field === "newPassword" && form.confirmNewPassword && form.confirmNewPassword !== nextValue) {
          nextErrors.confirmNewPassword = "Passwords do not match";
        } else if ((field === "confirmNewPassword" && nextValue !== form.newPassword) || (field === "newPassword" && form.confirmNewPassword !== nextValue)) {
          nextErrors.confirmNewPassword = "Passwords do not match";
        } else {
          delete nextErrors.confirmNewPassword;
        }
      }
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: form.email.trim(),
        currentPassword: form.currentPassword.trim(),
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      };

      const response = await forgotPassword(payload);
      setSuccess(true);
      setMessage(response.data || "Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Invalid email or current password";
      setSuccess(false);
      setMessage(typeof backendMessage === "string" ? backendMessage : "Invalid email or current password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-page">
      <h1 className="login-title">Forgot Password</h1>
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Current Password (Phone Number)"
            value={form.currentPassword}
            onChange={(e) => updateField("currentPassword", e.target.value)}
          />
          <p className="field-hint">Enter your registered phone number</p>
          {errors.currentPassword && <p className="field-error">{errors.currentPassword}</p>}

          <input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) => updateField("newPassword", e.target.value)}
          />
          {errors.newPassword && <p className="field-error">{errors.newPassword}</p>}

          <input
            type="password"
            placeholder="Confirm New Password"
            value={form.confirmNewPassword}
            onChange={(e) => updateField("confirmNewPassword", e.target.value)}
          />
          {errors.confirmNewPassword && <p className="field-error">{errors.confirmNewPassword}</p>}

          {message && (
            <p className={success ? "form-success" : "form-error"}>{message}</p>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            className="link-btn"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
