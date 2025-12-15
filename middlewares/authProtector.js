import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// === COMMON UTIL (React Native) ===
const getUser = async () => {
  try {
    const [token, user] = await Promise.all([
      AsyncStorage.getItem("token"),
      AsyncStorage.getItem("user"),
    ]);
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { token: null, user: null };
  }
};

/**
 * Generic protector for React Navigation.
 * - redirectTo: screen name to go when not authenticated
 * - fallbackRoute: screen name to go when role not allowed
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "Login",
  fallbackRoute = "Home",
}) => {
  const navigation = useNavigation();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const checkAuth = async () => {
        const { token, user } = await getUser();
        const isAuthed = !!token && !!user;
        const roleOk =
          allowedRoles.length === 0 ||
          (user && allowedRoles.includes(user.role));

        if (!mounted) return;

        if (!isAuthed) {
          setAllowed(false);
          setChecking(false);
          navigation.replace(redirectTo);
          return;
        }

        if (!roleOk) {
          setAllowed(false);
          setChecking(false);
          navigation.replace(fallbackRoute);
          return;
        }

        setAllowed(true);
        setChecking(false);
      };

      checkAuth();
      return () => {
        mounted = false;
      };
    }, [allowedRoles, navigation, redirectTo, fallbackRoute])
  );

  if (checking) return null; // can replace with a loader UI
  if (!allowed) return null;
  return children;
};

// === SPECIFIC PROTECTORS ===
export const ProtectedRouteForCustomer = (props) => (
  <ProtectedRoute allowedRoles={["customer"]} {...props} />
);

export const ProtectedRouteForStaff = (props) => (
  <ProtectedRoute allowedRoles={["staff"]} {...props} />
);

export const ProtectedRouteForAdmin = (props) => (
  <ProtectedRoute allowedRoles={["admin"]} {...props} />
);

export const ProtectedRouteForCustomerAndStaff = (props) => (
  <ProtectedRoute allowedRoles={["customer", "staff"]} {...props} />
);

export const ProtectedRouteForAll = (props) => <ProtectedRoute {...props} />;

export default ProtectedRoute;
