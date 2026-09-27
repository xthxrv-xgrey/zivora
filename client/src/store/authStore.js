import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/auth.api";
import { refreshAccessToken, setAccessToken, setOnAuthFailure } from "../api/axios";
import toast from "react-hot-toast";
import { extractApiErrorMessage } from "../utils/validators";

let initializationPromise = null;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      initializing: true,

      clearSession: () => {
        setAccessToken(null);
        set({ user: null });
      },

      initializeAuth: async () => {
        if (initializationPromise) {
          return initializationPromise;
        }

        initializationPromise = (async () => {
          try {
            // Using the exported refreshAccessToken from axios ensures we share the same
            // promise lock as the interceptor, avoiding race conditions and duplicate calls.
            const token = await refreshAccessToken();
            setAccessToken(token);
            const me = await fetchCurrentUser();
            set({ user: me });
          } catch (error) {
            get().clearSession();
          } finally {
            set({ initializing: false });
            initializationPromise = null;
          }
        })();

        return initializationPromise;
      },

      login: async (credentials) => {
        const { user: loggedInUser, accessToken } = await loginUser(credentials);
        setAccessToken(accessToken);
        set({ user: loggedInUser });
        return loggedInUser;
      },

      register: async (details) => {
        const { user: newUser, accessToken } = await registerUser(details);
        setAccessToken(accessToken);
        set({ user: newUser });
        return newUser;
      },

      logout: async () => {
        try {
          await logoutUser();
        } catch (error) {
          toast.error(extractApiErrorMessage(error, "Logout request failed."));
        } finally {
          get().clearSession();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // Only persist the safe user data
      }),
    }
  )
);

// Register the axios interceptor callback so it can trigger a full session clear
// when a refresh attempt fails. This avoids a circular dependency.
setOnAuthFailure(() => {
  useAuthStore.getState().clearSession();
});
