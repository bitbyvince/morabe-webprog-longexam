const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function apiFetch(path, options = {}) {
  const stored = localStorage.getItem("user");
  const headers = new Headers(options.headers || {});
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (stored) {
    const user = JSON.parse(stored);
    if (user.token) headers.set("Authorization", `Bearer ${user.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }
  return data;
}

export { API_URL };
