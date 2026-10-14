import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    address: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/auth/profile")
      .then((data) => setForm(data.data))
      .catch((err) => setError(err.message));
  }, []);

  const updateProfile = async (event) => {
    event.preventDefault();
    try {
      const updated = await apiFetch(`/users/${user._id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      await apiFetch("/auth/password", {
        method: "PUT",
        body: JSON.stringify(passwords),
      });
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage("Password changed.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-amber-900">Profile</h1>
      {message && <p className="mt-4 text-green-700">{message}</p>}
      {error && <p className="mt-4 text-red-700">{error}</p>}
      <form onSubmit={updateProfile} className="mt-8 space-y-4">
        {[
          ["firstName", "First name"],
          ["lastName", "Last name"],
          ["contactNumber", "Contact number"],
          ["address", "Address"],
        ].map(([name, label]) => (
          <label
            key={name}
            className="block text-sm font-semibold text-amber-900"
          >
            {label}
            <input
              value={form[name] || ""}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className="mt-2 w-full rounded-xl border border-amber-300 px-4 py-3 font-normal"
            />
          </label>
        ))}
        <Button type="submit" variant="primary">
          Save Profile
        </Button>
      </form>
      <form
        onSubmit={changePassword}
        className="mt-10 space-y-4 border-t-2 border-amber-900 pt-8"
      >
        <h2 className="text-xl text-amber-900">Change Password</h2>
        <input
          required
          type="password"
          placeholder="Current password"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
          className="w-full rounded-xl border border-amber-300 px-4 py-3"
        />
        <input
          required
          type="password"
          placeholder="New password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          className="w-full rounded-xl border border-amber-300 px-4 py-3"
        />
        <Button type="submit">Change Password</Button>
      </form>
    </section>
  );
};

export default ProfilePage;
