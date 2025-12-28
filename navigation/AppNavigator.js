import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import SplashScreen from "../pages/Splash/SplashScreen";
import OnboardingScreen from "../pages/Onboarding/OnboardingScreen";
import SignInScreen from "../pages/Auth/SignInScreen";
import SignUpScreen from "../pages/Auth/SignUpScreen";
import OtpScreen from "../pages/Auth/OtpScreen";
import OtpConsentScreen from "../pages/Auth/OtpConsentScreen";
import ForgotPasswordScreen from "../pages/Auth/ForgotPasswordScreen";
import CreatePasswordScreen from "../pages/Auth/CreatePasswordScreen";
import PasswordSuccessScreen from "../pages/Auth/PasswordSuccessScreen";

import HomeScreen from "../pages/Home/HomeScreen";
import SearchScreen from "../pages/Search/SearchScreen";
import SearchResultsScreen from "../pages/Search/SearchResultsScreen";
import FilterScreen from "../pages/Search/FilterScreen";

import StudioDetailScreen from "../pages/Detail/StudioDetailScreen";
import ReviewsScreen from "../pages/Detail/ReviewsScreen";
import ShareSheetScreen from "../pages/Detail/ShareSheetScreen";
import RoomViewerScreen from "../pages/Detail/RoomViewerScreen";

import SetDesignHighlightScreen from "../pages/SetDesign/SetDesignHighlightScreen";
import SetDesignListScreen from "../pages/SetDesign/SetDesignListScreen";
import SetDesignFormScreen from "../pages/SetDesign/SetDesignFormScreen";

import BookingRequestScreen from "../pages/Booking/BookingRequestScreen";
import SelectDateScreen from "../pages/Booking/SelectDateScreen";
import BookingFormScreen from "../pages/Booking/BookingFormScreen";
import CheckoutScreen from "../pages/Booking/CheckoutScreen";
import SelectSetDesignScreen from "../pages/Booking/SelectSetDesignScreen";
import PaymentMethodScreen from "../pages/Booking/PaymentMethodScreen";
import AddCardScreen from "../pages/Booking/AddCardScreen";
import CardSuccessScreen from "../pages/Booking/CardSuccessScreen";
import QRCodeScreen from "../pages/Booking/QRCodeScreen";

import BookingHistoryScreen from "../pages/History/BookingHistoryScreen";
import BookingDetailScreen from "../pages/History/BookingDetailScreen";

import FavoritesScreen from "../pages/Favorites/FavoritesScreen";
import MessageListScreen from "../pages/Messages/MessageListScreen";
import ChatScreen from "../pages/Messages/ChatScreen";
import NotificationsScreen from "../pages/Notifications/NotificationsScreen";

import ProfileScreen from "../pages/Profile/ProfileScreen";
import EditProfileScreen from "../pages/Profile/EditProfileScreen";
import LogoutConfirmScreen from "../pages/Profile/LogoutConfirmScreen";
import PrivacyScreen from "../pages/Profile/PrivacyScreen";
import NotificationSettingsScreen from "../pages/Profile/NotificationSettingsScreen";
import SupportScreen from "../pages/Profile/SupportScreen";
import SecurityScreen from "../pages/Profile/SecurityScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarIcon = (name) => ({ color, size }) => (
  <Feather name={name} color={color} size={size} />
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2F64F3",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Trang chủ", tabBarIcon: tabBarIcon("home") }}
      />
      <Tab.Screen
        name="History"
        component={BookingHistoryScreen}
        options={{ tabBarLabel: "Lịch sử", tabBarIcon: tabBarIcon("clock") }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageListScreen}
        options={{ tabBarLabel: "Tin nhắn", tabBarIcon: tabBarIcon("message-circle") }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Hồ sơ", tabBarIcon: tabBarIcon("user") }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="OtpConsent" component={OtpConsentScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
        <Stack.Screen name="PasswordSuccess" component={PasswordSuccessScreen} />

        <Stack.Screen name="MainTabs" component={MainTabs} />

        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />

        <Stack.Screen name="Detail" component={StudioDetailScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="ShareSheet" component={ShareSheetScreen} />
        <Stack.Screen name="RoomViewer" component={RoomViewerScreen} />

        <Stack.Screen name="SetDesignHighlight" component={SetDesignHighlightScreen} />
        <Stack.Screen name="SetDesignList" component={SetDesignListScreen} />
        <Stack.Screen name="SetDesignForm" component={SetDesignFormScreen} />

        <Stack.Screen name="BookingRequest" component={BookingRequestScreen} />
        <Stack.Screen name="SelectDate" component={SelectDateScreen} />
        <Stack.Screen name="BookingForm" component={BookingFormScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="SelectSetDesign" component={SelectSetDesignScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="AddCard" component={AddCardScreen} />
        <Stack.Screen name="CardSuccess" component={CardSuccessScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} />

        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="LogoutConfirm" component={LogoutConfirmScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

