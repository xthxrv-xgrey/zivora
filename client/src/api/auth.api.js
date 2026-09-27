import api from "./axios";

export function registerUser({ name, email, password, confirmPassword }) {
  return api
    .post("/auth/register", { name, email, password, confirmPassword })
    .then((res) => res.data.data);
}

export function loginUser({ email, password }) {
  return api.post("/auth/login", { email, password }).then((res) => res.data.data);
}

export function logoutUser() {
  return api.post("/auth/logout").then((res) => res.data);
}

export function fetchCurrentUser() {
  return api.get("/auth/me").then((res) => res.data.data.user);
}

// Used only during app bootstrap to silently try to establish a session
// from the refresh-token cookie. Uses the shared axios instance so a 401
// here is handled by the normal interceptor (and simply fails, which is
// fine — it just means the visitor isn't logged in).
export function refreshAccessTokenRequest() {
  return api.post("/auth/refresh-token").then((res) => res.data.data.accessToken);
}
