import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";
import userService from "../services/userService";

/* =========================================
   AUTH CONTEXT
========================================= */

export const AuthContext = createContext(null);

/* =========================================
   AUTH PROVIDER
========================================= */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* =========================================
     CHECK AUTHENTICATION
  ========================================= */

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      const response = await userService.getProfile();

      const currentUser =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        null;

      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================
     LOGIN
  ========================================= */

  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await authService.login(credentials);

      /*
        Different possible API response structures
      */

      let loggedInUser =
        response?.data?.user ||
        response?.user ||
        null;

      /*
        If login response doesn't contain user,
        fetch the current user from profile API.
      */

      if (!loggedInUser) {
        const profileResponse =
          await userService.getProfile();

        loggedInUser =
          profileResponse?.data?.user ||
          profileResponse?.data ||
          profileResponse?.user ||
          null;
      }

      if (!loggedInUser) {
        throw new Error(
          "Login successful, but user information could not be loaded."
        );
      }

      /*
        IMPORTANT:
        Update AuthContext immediately.
      */

      setUser(loggedInUser);
      setIsAuthenticated(true);

      return {
        ...response,
        data: {
          ...response?.data,
          user: loggedInUser,
        },
      };
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     REGISTER
  ========================================= */

  const register = async (userData) => {
    const response =
      await authService.register(userData);

    return response;
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const logout = async () => {
  try {
    setIsLoggingOut(true);
    setLoading(true);

    await authService.logout();

    setUser(null);
    setIsAuthenticated(false);
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};

  /* =========================================
     REFRESH USER
  ========================================= */

  const refreshUser = async () => {
    await checkAuth();
  };

  /* =========================================
     INITIAL AUTH CHECK
  ========================================= */

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /* =========================================
     CONTEXT VALUE
  ========================================= */

  const value = {
    user,
    setUser,

    loading,
    isAuthenticated,
    isLoggingOut,

    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;