import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessTokenRequest,
  registerUser,
} from "../api/auth.api";
import { setAccessToken, setOnAuthFailure } from "../api/axios";
import { extractApiErrorMessage } from "../utils/validators";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  // If any request's refresh attempt fails, the axios interceptor calls
  // this — drop local auth state so ProtectedRoute sends the user to /login.
  useEffect(() => {
    setOnAuthFailure(() => {
      clearSession();
    });
  }, [clearSession]);

  // On first load, try to silently restore a session from the HTTP-only
  // refresh-token cookie. If there's no valid cookie this just fails
  // quietly and the user lands on the public pages.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await refreshAccessTokenRequest();
        setAccessToken(token);
        const me = await fetchCurrentUser();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser, accessToken } = await loginUser(credentials);
    setAccessToken(accessToken);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (details) => {
    const { user: newUser, accessToken } = await registerUser(details);
    setAccessToken(accessToken);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Even if the server call fails, clear local state so the UI is
      // never stuck in a logged-in-looking state.
      toast.error(extractApiErrorMessage(error, "Logout request failed."));
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    initializing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
