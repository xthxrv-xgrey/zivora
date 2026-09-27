import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_API_URL is not set. Create a .env file (see .env.example) pointing at your backend."
  );
}

// The access token lives here, in memory, rather than in localStorage —
// AuthContext keeps this in sync with its own React state.
let accessToken = null;
let onAuthFailure = () => {};

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// AuthContext registers a callback here so the interceptor can clear
// state and redirect to /login when a refresh attempt fails.
export function setOnAuthFailure(callback) {
  onAuthFailure = callback;
}

const api = axios.create({
  baseURL,
  withCredentials: true, // send the HTTP-only refresh-token cookie
});

// Separate, bare client for the refresh call itself so it never runs
// through the response interceptor below (that would risk a loop).
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken && !config.headers?.skipAuth) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// --- 401 handling -----------------------------------------------------
// Multiple requests can fail with 401 at the same time (e.g. a page that
// fires several protected calls on mount). We only want ONE refresh
// request in flight; every other failed request waits on that same
// promise and retries once it resolves.
let refreshPromise = null;

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh-token")
      .then((res) => {
        const newToken = res.data?.data?.accessToken;
        setAccessToken(newToken);
        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("No access token returned");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        onAuthFailure();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
