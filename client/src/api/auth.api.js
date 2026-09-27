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

